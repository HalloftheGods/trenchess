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

/**
 * shuffle (Atom)
 * Standard Fisher-Yates shuffle implementation.
 */
export const shuffle = <T>(array: T[]) => {
  for (let index = array.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
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
) => {
  const nextTerrainMap = TerraForm.generate({
    mode,
    seed: Math.random(),
    symmetry: "rotational",
  });

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
        const isTerrainIncompatible = !isTerrainFlat && !canPlaceUnit(pieceType, terrainAtCell);
        
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
 * Shuffles and re-places all available terrain for the given players.
 */
export const randomizeTerrain = (
  currentTerrain: TerrainType[][],
  currentBoard: (BoardPiece | null)[][],
  terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
) => {
  const nextTerrainMap = currentTerrain.map((row) => [...row]);
  const nextTerrainInventory = { ...terrainInventory };

  const isTwoPlayerMode = mode === "2p-ns" || mode === "2p-ew";
  const terrainQuota = isTwoPlayerMode
    ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
    : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  players.forEach((player) => {
    const myTerritoryCells = getPlayerCells(player, mode);
    let playerTerrainPool = [...(nextTerrainInventory[player] || [])];

    // If inventory is empty, generate a balanced fallback pool
    const isInventoryEmpty = playerTerrainPool.length === 0;
    if (isInventoryEmpty) {
      const terrainTypes = [
        TERRAIN_TYPES.TREES,
        TERRAIN_TYPES.PONDS,
        TERRAIN_TYPES.RUBBLE,
        TERRAIN_TYPES.DESERT,
      ];
      playerTerrainPool = terrainTypes.flatMap((type) => Array(4).fill(type));
    }

    // Reclaim already placed terrain from the board
    for (const [row, col] of myTerritoryCells) {
      const terrainAtCell = nextTerrainMap[row][col];
      const isSpecialTerrain = terrainAtCell !== TERRAIN_TYPES.FLAT;
      
      if (isSpecialTerrain) {
        playerTerrainPool.push(terrainAtCell);
        nextTerrainMap[row][col] = TERRAIN_TYPES.FLAT as TerrainType;
      }
    }

    shuffle(playerTerrainPool);

    const availableCells = [...myTerritoryCells];
    shuffle(availableCells);

    let currentPlacedCount = 0;
    const remainingInventory: TerrainType[] = [];

    for (const terrainTypeToPlace of playerTerrainPool) {
      const isQuotaReached = currentPlacedCount >= terrainQuota;
      if (isQuotaReached) {
        remainingInventory.push(terrainTypeToPlace);
        continue;
      }

      const cellIndex = availableCells.findIndex(([row, col]) => {
        const pieceAtCell = currentBoard[row][col];
        const isCellEmpty = !pieceAtCell;
        const isPieceCompatible = isCellEmpty || canPlaceUnit(pieceAtCell!.type, terrainTypeToPlace);
        return isPieceCompatible;
      });

      const isCellFound = cellIndex !== -1;
      if (isCellFound) {
        const [row, col] = availableCells[cellIndex];
        nextTerrainMap[row][col] = terrainTypeToPlace;
        availableCells.splice(cellIndex, 1);
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
 * Shuffles and re-places all units for the given players.
 */
export const randomizeUnits = (
  currentBoard: (BoardPiece | null)[][],
  currentTerrain: TerrainType[][],
  unitInventory: Record<string, PieceType[]>,
  players: string[],
  mode: GameMode,
) => {
  const nextBoardState = currentBoard.map((row) => [...row]);
  const nextUnitInventory = { ...unitInventory };

  players.forEach((player) => {
    const myTerritoryCells = getPlayerCells(player, mode);
    const playerUnitPool = [...(nextUnitInventory[player] || [])];

    // Reclaim units from the board
    for (const [row, col] of myTerritoryCells) {
      const pieceAtCell = nextBoardState[row][col];
      const isOwnPieceAtCell = pieceAtCell && pieceAtCell.player === player;
      
      if (isOwnPieceAtCell) {
        playerUnitPool.push(pieceAtCell!.type);
        nextBoardState[row][col] = null;
      }
    }

    shuffle(playerUnitPool);

    const availableCells = myTerritoryCells.filter(([row, col]) => {
      const isCellOccupied = !!nextBoardState[row][col];
      return !isCellOccupied;
    });
    shuffle(availableCells);

    const remainingInventory: PieceType[] = [];
    for (const unitTypeToPlace of playerUnitPool) {
      const cellIndex = availableCells.findIndex(([row, col]) => {
        const terrainAtCell = currentTerrain[row][col];
        const isCompatibleWithTerrain = canPlaceUnit(unitTypeToPlace, terrainAtCell);
        return isCompatibleWithTerrain;
      });

      const isCellFound = cellIndex !== -1;
      if (isCellFound) {
        const [row, col] = availableCells[cellIndex];
        nextBoardState[row][col] = { type: unitTypeToPlace, player: player };
        availableCells.splice(cellIndex, 1);
      } else {
        remainingInventory.push(unitTypeToPlace);
      }
    }
    nextUnitInventory[player] = remainingInventory;
  });

  return { board: nextBoardState, inventory: nextUnitInventory };
};
