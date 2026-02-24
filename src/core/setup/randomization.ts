import { BOARD_SIZE } from "@/constants";
import { MAX_TERRAIN_PER_PLAYER, TERRAIN_TYPES } from "@/constants";
import type {
  GameMode,
  BoardPiece,
  TerrainType,
  PieceType,
} from "@/shared/types";
import { TerraForm } from "./generateTrench";
import { getPlayerCells } from "./territory";
import { canPlaceUnit } from "./validation";
import { UNIT_BLUEPRINTS } from "../blueprints/units";

/**
 * shuffle (Atom)
 * Standard Fisher-Yates shuffle implementation.
 */
export const shuffle = <T>(
  array: T[],
  randomSource?: { Number: () => number },
) => {
  const getRand = () => (randomSource ? randomSource.Number() : Math.random());
  for (let index = array.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(getRand() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
};

/**
 * generateElementalTerrain (Molecule)
 * Procedurally generates a new terrain map using the TerraForm engine.
 */
export const generateElementalTerrain = (
  _currentTerrain: TerrainType[][],
  currentBoard: (BoardPiece | null)[][],
  _terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
  randomSource?: { Number: () => number },
) => {
  const getRand = () => (randomSource ? randomSource.Number() : Math.random());

  const nextTerrainMap = TerraForm.generate({
    mode,
    seed: getRand(),
    symmetry: "rotational",
  });
  // ... (rest of the function using nextTerrainMap and players)

  const nextTerrainInventory: Record<string, TerrainType[]> = {};
  players.forEach((player) => {
    nextTerrainInventory[player] = [];
  });

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const pieceAtCell = currentBoard[row][col];
      const hasPieceAtCell = !!pieceAtCell;

      if (hasPieceAtCell) {
        const pieceType = pieceAtCell!.type;
        const terrainAtCell = nextTerrainMap[row][col];

        const isTerrainFlat = terrainAtCell === TERRAIN_TYPES.FLAT;
        const isTerrainIncompatible =
          !isTerrainFlat && !canPlaceUnit(pieceType, terrainAtCell);

        if (isTerrainIncompatible) {
          nextTerrainMap[row][col] = TERRAIN_TYPES.FLAT as TerrainType;
        }
      }
    }
  }

  return { terrain: nextTerrainMap, terrainInventory: nextTerrainInventory };
};

/**
 * randomizeTerrain (Molecule)
 * Shuffles and re-places all available terrain for the given players with tactical intelligence.
 */
export const randomizeTerrain = (
  currentTerrain: TerrainType[][],
  currentBoard: (BoardPiece | null)[][],
  terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
  forceQuota?: number,
  randomSource?: { Number: () => number },
) => {
  const getRand = () => (randomSource ? randomSource.Number() : Math.random());
  const nextTerrainMap = currentTerrain.map((row) => [...row]);
  const nextTerrainInventory = { ...terrainInventory };

  const isTwoPlayerMode = mode === "2p-ns" || mode === "2p-ew";
  const terrainQuota =
    forceQuota !== undefined
      ? forceQuota
      : isTwoPlayerMode
        ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
        : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  players.forEach((player) => {
    const myTerritoryCells = getPlayerCells(player, mode);
    const playerTerrainPool = [...(nextTerrainInventory[player] || [])];

    // 1. Ensure pool can meet quota (fallback generation)
    if (playerTerrainPool.length < terrainQuota) {
      const terrainTypes = [
        TERRAIN_TYPES.FORESTS,
        TERRAIN_TYPES.SWAMPS,
        TERRAIN_TYPES.MOUNTAINS,
        TERRAIN_TYPES.DESERT,
      ];
      // Generate enough pieces to meet the quota if needed
      while (playerTerrainPool.length < terrainQuota + 4) {
        playerTerrainPool.push(...terrainTypes);
      }
    }

    // 2. Reclaim existing terrain
    for (const [row, col] of myTerritoryCells) {
      const terrainAtCell = nextTerrainMap[row][col];
      if (terrainAtCell !== TERRAIN_TYPES.FLAT) {
        playerTerrainPool.push(terrainAtCell);
        nextTerrainMap[row][col] = TERRAIN_TYPES.FLAT as TerrainType;
      }
    }

    shuffle(playerTerrainPool, randomSource);

    const availableCells = [...myTerritoryCells];
    let currentPlacedCount = 0;
    const remainingInventory: TerrainType[] = [];

    for (const terrainTypeToPlace of playerTerrainPool) {
      if (currentPlacedCount >= terrainQuota) {
        remainingInventory.push(terrainTypeToPlace);
        continue;
      }

      // 3. Intelligent Terrain Placement
      const cellScores = availableCells.map(([r, c]) => {
        const piece = currentBoard[r][c];

        // Block if piece is incompatible
        if (piece && !canPlaceUnit(piece.type, terrainTypeToPlace)) {
          return { r, c, score: -1000 };
        }

        let score = 0;

        // Advantage Scoring: Place terrain where allied units benefit
        if (piece && piece.player === player) {
          const blueprint = UNIT_BLUEPRINTS[piece.type];
          if (blueprint?.sanctuaryTerrain?.includes(terrainTypeToPlace)) {
            score += 100; // Buff existing unit
          }
        }

        // Distance from units (Synergy search)
        // Check neighbors for units that like this terrain
        const neighbors = [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ];
        neighbors.forEach(([nr, nc]) => {
          if (nr >= 0 && nr < 12 && nc >= 0 && nc < 12) {
            const neighborPiece = currentBoard[nr][nc];
            if (neighborPiece && neighborPiece.player === player) {
              const blueprint = UNIT_BLUEPRINTS[neighborPiece.type];
              if (blueprint?.sanctuaryTerrain?.includes(terrainTypeToPlace)) {
                score += 30; // Place near units that like it
              }
            }
          }
        });

        score += getRand() * 10;
        return { r, c, score };
      });

      cellScores.sort((a, b) => b.score - a.score);
      const bestCell = cellScores.find((cell) => cell.score > -500);

      if (bestCell) {
        nextTerrainMap[bestCell.r][bestCell.c] = terrainTypeToPlace;
        const idx = availableCells.findIndex(
          ([r, c]) => r === bestCell.r && c === bestCell.c,
        );
        if (idx !== -1) availableCells.splice(idx, 1);
        currentPlacedCount++;
      } else {
        remainingInventory.push(terrainTypeToPlace);
      }
    }

    nextTerrainInventory[player] = remainingInventory;
  });

  return { terrain: nextTerrainMap, terrainInventory: nextTerrainInventory };
};

/**
 * randomizeUnits (Molecule)
 * Shuffles and re-places all units for the given players with tactical intelligence.
 */
export const randomizeUnits = (
  currentBoard: (BoardPiece | null)[][],
  currentTerrain: TerrainType[][],
  unitInventory: Record<string, PieceType[]>,
  players: string[],
  mode: GameMode,
  randomSource?: { Number: () => number },
) => {
  const getRand = () => (randomSource ? randomSource.Number() : Math.random());
  const nextBoardState = currentBoard.map((row) => [...row]);
  const nextUnitInventory = { ...unitInventory };

  players.forEach((player) => {
    const myTerritoryCells = getPlayerCells(player, mode);
    const playerUnitPool = [...(nextUnitInventory[player] || [])];

    // 1. Reclaim units from the board
    for (const [row, col] of myTerritoryCells) {
      const pieceAtCell = nextBoardState[row][col];
      const isOwnPieceAtCell = pieceAtCell && pieceAtCell.player === player;

      if (isOwnPieceAtCell) {
        playerUnitPool.push(pieceAtCell!.type);
        nextBoardState[row][col] = null;
      }
    }

    // 2. Intelligent Placement Logic
    shuffle(playerUnitPool, randomSource);

    const availableCells = myTerritoryCells.filter(([row, col]) => {
      const isCellOccupied = !!nextBoardState[row][col];
      return !isCellOccupied;
    });

    const remainingInventory: PieceType[] = [];

    for (const unitTypeToPlace of playerUnitPool) {
      // Score every cell for this unit
      const cellScores = availableCells.map(([r, c]) => {
        const terrain = currentTerrain[r][c];
        const isCompatible = canPlaceUnit(unitTypeToPlace, terrain);
        if (!isCompatible) return { r, c, score: -1000 };

        let score = 0;

        // Sanctuary / Blueprint Advantages
        const blueprint = UNIT_BLUEPRINTS[unitTypeToPlace];
        if (blueprint?.sanctuaryTerrain?.includes(terrain)) {
          score += 50; // Tactical Advantage
        }

        // Row positioning (Pawns forward, Kings back)
        const isNorthPlayer = player === "red" || player === "yellow";
        const rank = isNorthPlayer ? r : 11 - r;

        if (unitTypeToPlace === "pawn") score += rank * 5; // Pawns like the front
        if (unitTypeToPlace === "king") score -= rank * 10; // Kings stay back
        if (unitTypeToPlace === "rook") score -= rank * 2; // Rooks like back ranks

        // Column positioning (Center control)
        const centerDistance = Math.abs(c - 5.5);
        score -= centerDistance * 3; // Prefer central files

        // Random noise to keep it fresh
        score += getRand() * 10;

        return { r, c, score };
      });

      // Sort by score descending
      cellScores.sort((a, b) => b.score - a.score);

      const bestCell = cellScores.find((cell) => cell.score > -500);

      if (bestCell) {
        nextBoardState[bestCell.r][bestCell.c] = {
          type: unitTypeToPlace,
          player: player,
        };
        // Remove from available
        const idx = availableCells.findIndex(
          ([r, c]) => r === bestCell.r && c === bestCell.c,
        );
        if (idx !== -1) availableCells.splice(idx, 1);
      } else {
        remainingInventory.push(unitTypeToPlace);
      }
    }
    nextUnitInventory[player] = remainingInventory;
  });

  return { board: nextBoardState, inventory: nextUnitInventory };
};
