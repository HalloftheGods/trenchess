import { BOARD_SIZE, TERRAIN_CARDS_PER_TYPE, MAX_TERRAIN_PER_PLAYER } from "../constants";
import { PIECES, INITIAL_ARMY } from "../data/unitDetails";
import { TERRAIN_TYPES } from "../data/terrainDetails";
import type {
  GameMode,
  BoardPiece,
  TerrainType,
  PieceType,
} from "../types/game";
import { TerraForm } from "./TerraForm";
import { getClassicalFormationTargets } from "./boardLayouts";

export interface SetupResult {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
}

// Helper: Get cells in a player's territory
export const getPlayerCells = (
  player: string,
  mode: GameMode,
): [number, number][] => {
  const cells: [number, number][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      let isMyArea = false;
      if (mode === "2p-ns") {
        isMyArea = player === "player1" ? r < 6 : r >= 6;
      } else if (mode === "2p-ew") {
        if (player === "player3") isMyArea = c < 6;
        if (player === "player2") isMyArea = c >= 6;
      } else {
        if (player === "player1") isMyArea = r < 6 && c < 6;
        if (player === "player2") isMyArea = r < 6 && c >= 6;
        if (player === "player3") isMyArea = r >= 6 && c < 6;
        if (player === "player4") isMyArea = r >= 6 && c >= 6;
      }
      if (isMyArea) cells.push([r, c]);
    }
  }
  return cells;
};

// Helper: Check if a unit can be placed on a terrain
export const canPlaceUnit = (
  unitType: PieceType,
  terrainType: TerrainType,
): boolean => {
  if (terrainType === TERRAIN_TYPES.DESERT && unitType !== PIECES.TANK)
    return false;
  if (unitType === PIECES.TANK && terrainType === TERRAIN_TYPES.TREES)
    return false;
  if (unitType === PIECES.HORSEMAN && terrainType === TERRAIN_TYPES.TREES)
    return false;
  if (unitType === PIECES.HORSEMAN && terrainType === TERRAIN_TYPES.PONDS)
    return false;
  if (unitType === PIECES.SNIPER && terrainType === TERRAIN_TYPES.PONDS)
    return false;
  if (unitType === PIECES.TANK && terrainType === TERRAIN_TYPES.RUBBLE)
    return false;
  if (unitType === PIECES.SNIPER && terrainType === TERRAIN_TYPES.RUBBLE)
    return false;
  return true;
};

// Helper: Shuffle Array in place
const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const createInitialState = (
  _mode: GameMode,
  players: string[],
): SetupResult => {
  const board: (BoardPiece | null)[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  const terrain: TerrainType[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT as TerrainType));

  // Generate Deck
  const deck: TerrainType[] = [];
  const types = [
    TERRAIN_TYPES.TREES,
    TERRAIN_TYPES.PONDS,
    TERRAIN_TYPES.RUBBLE,
    TERRAIN_TYPES.DESERT,
  ];
  types.forEach((t) => {
    for (let i = 0; i < TERRAIN_CARDS_PER_TYPE; i++)
      deck.push(t as TerrainType);
  });
  shuffle(deck);

  const inventory: Record<string, PieceType[]> = {};
  const terrainInventory: Record<string, TerrainType[]> = {};
  players.forEach((p) => {
    inventory[p] = INITIAL_ARMY.flatMap((unit) =>
      Array(unit.count).fill(unit.type),
    );
    // Distribute exactly the quota
    const share =
      players.length === 2
        ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
        : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
    terrainInventory[p] = deck.splice(0, share);
  });

  return { board, terrain, inventory, terrainInventory };
};

export const generateElementalTerrain = (
  _currentTerrain: TerrainType[][],
  currentBoard: (BoardPiece | null)[][],
  _terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
) => {
  // Use TerraForm for sophisticated generation
  const nextTerrain = TerraForm.generate({
    mode,
    seed: Math.random(),
    symmetry: "rotational", // Default to fair symmetry
  });

  const nextTInv: Record<string, TerrainType[]> = {};
  players.forEach((p) => {
    nextTInv[p] = [];
  });

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (currentBoard[r][c]) {
        const unit = currentBoard[r][c]!;
        const terr = nextTerrain[r][c];
        if (terr !== TERRAIN_TYPES.FLAT && !canPlaceUnit(unit.type, terr)) {
          nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
        }
      }
    }
  }

  return { terrain: nextTerrain, terrainInventory: nextTInv };
};

export const randomizeTerrain = (
  currentTerrain: TerrainType[][],
  currentBoard: (BoardPiece | null)[][],
  terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
) => {
  const nextTerrain = currentTerrain.map((row) => [...row]);
  const nextTInv = { ...terrainInventory };

  players.forEach((p) => {
    const myCells = getPlayerCells(p, mode);
    const playerTerrain = [...(nextTInv[p] || [])];

    // Clear existing terrain for player
    for (const [r, c] of myCells) {
      if (nextTerrain[r][c] !== TERRAIN_TYPES.FLAT) {
        playerTerrain.push(nextTerrain[r][c]);
        nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
      }
    }

    shuffle(playerTerrain);

    const available = myCells.filter(([r, c]) => {
      // Find empty cells or cells with compatible unit
      if (!currentBoard[r][c]) return true;
      // If there's a unit, we cannot know the terrain until we pop it, so we'll check compatibility when placing.
      // But for simple placement, let's just use empty cells if possible, or we'll skip later.
      return true;
    });
    shuffle(available);

    const quota =
      players.length === 2
        ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
        : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
    let placedCount = 0;

    const remaining: TerrainType[] = [];
    for (const terrType of playerTerrain) {
      if (placedCount >= quota) {
        remaining.push(terrType);
        continue;
      }
      // Find compatible cell
      const cellIdx = available.findIndex(([r, c]) => {
        const unit = currentBoard[r][c];
        if (!unit) return true;
        return canPlaceUnit(unit.type, terrType);
      });

      if (cellIdx !== -1) {
        const [r, c] = available[cellIdx];
        nextTerrain[r][c] = terrType;
        available.splice(cellIdx, 1);
        placedCount++;
      } else {
        remaining.push(terrType);
      }
    }

    nextTInv[p] = remaining;
  });

  return { terrain: nextTerrain, terrainInventory: nextTInv };
};

export const randomizeUnits = (
  currentBoard: (BoardPiece | null)[][],
  currentTerrain: TerrainType[][],
  unitInventory: Record<string, PieceType[]>,
  players: string[],
  mode: GameMode,
) => {
  const nextBoard = currentBoard.map((row) => [...row]);
  const nextInv = { ...unitInventory };

  players.forEach((p) => {
    const myCells = getPlayerCells(p, mode);
    const playerUnits = [...(nextInv[p] || [])];

    // 1. Clear existing units
    for (const [r, c] of myCells) {
      if (nextBoard[r][c] && nextBoard[r][c]!.player === p) {
        playerUnits.push(nextBoard[r][c]!.type);
        nextBoard[r][c] = null;
      }
    }

    shuffle(playerUnits);

    const available = myCells.filter(([r, c]) => !nextBoard[r][c]);
    shuffle(available);

    const remaining: PieceType[] = [];
    for (const unitType of playerUnits) {
      // Find a compatible cell
      const cellIdx = available.findIndex(([r, c]) =>
        canPlaceUnit(unitType, currentTerrain[r][c]),
      );

      if (cellIdx !== -1) {
        const [r, c] = available[cellIdx];
        nextBoard[r][c] = { type: unitType, player: p };
        available.splice(cellIdx, 1);
      } else {
        remaining.push(unitType);
      }
    }
    nextInv[p] = remaining;
  });

  return { board: nextBoard, inventory: nextInv };
};

export const applyClassicalFormation = (
  currentBoard: (BoardPiece | null)[][],
  currentTerrain: TerrainType[][],
  unitInventory: Record<string, PieceType[]>,
  terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
) => {
  const nextBoard = currentBoard.map((row) => [...row]);
  const nextTerrain = currentTerrain.map((row) => [...row]);
  const nextInv = { ...unitInventory };
  const nextTInv = { ...terrainInventory };

  players.forEach((p) => {
    // 1. Clear units first
    const myCells = getPlayerCells(p, mode);
    for (const [r, c] of myCells) {
      if (nextBoard[r][c]?.player === p) {
        // Technically we should push back to inventory, but we are about to overwrite it anyway
        // because classical assumes a fresh start or re-use of all pieces.
        // Actually, let's just clear board. Inventory will be cleared when we place.
        nextBoard[r][c] = null;
      }
    }

    // 2. Define Targets
    const targets = getClassicalFormationTargets(p, mode);

    const playerTerrainInv = [...(nextTInv[p] || [])];
    for (const { r, c, type } of targets) {
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) continue;
      const terr = nextTerrain[r][c];

      // Ensure compatibility
      if (!canPlaceUnit(type, terr)) {
        // If incompatible, remove terrain (return to inventory) and place unit
        if (terr !== TERRAIN_TYPES.FLAT) {
          playerTerrainInv.push(terr);
          nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
        }
      }
      nextBoard[r][c] = { type, player: p };
    }
    // Update inventories
    nextInv[p] = []; // All units placed
    nextTInv[p] = playerTerrainInv;
  });

  return {
    board: nextBoard,
    terrain: nextTerrain,
    inventory: nextInv,
    terrainInventory: nextTInv,
  };
};
