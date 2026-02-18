import {
  BOARD_SIZE,
  TERRAIN_TYPES,
  PIECES,
  INITIAL_ARMY,
  MAX_TERRAIN_PER_PLAYER,
  TERRAIN_CARDS_PER_TYPE,
} from "../constants";
import type { GameMode, BoardPiece, TerrainType, PieceType } from "../types";

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
    // Distribute equally (48 / numPlayers)
    const share = Math.floor(48 / players.length);
    terrainInventory[p] = deck.splice(0, share);
  });

  return { board, terrain, inventory, terrainInventory };
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

  const maxPlacement =
    players.length === 2
      ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
      : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  players.forEach((p) => {
    const myCells = getPlayerCells(p, mode);
    const playerCards = [...(nextTInv[p] || [])];

    // 1. Collect all non-flat terrain back to inventory
    for (const [r, c] of myCells) {
      if (nextTerrain[r][c] !== TERRAIN_TYPES.FLAT) {
        playerCards.push(nextTerrain[r][c]);
        nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
      }
    }

    shuffle(playerCards); // Randomize preference order

    const available = myCells.filter(
      ([r, c]) =>
        nextTerrain[r][c] === TERRAIN_TYPES.FLAT && !currentBoard[r][c],
    );
    shuffle(available);

    const remaining: TerrainType[] = [];
    let placedCount = 0;

    for (const card of playerCards) {
      if (available.length > 0 && placedCount < maxPlacement) {
        const [r, c] = available.pop()!;
        nextTerrain[r][c] = card;
        placedCount++;
      } else {
        remaining.push(card);
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
    const targets: { r: number; c: number; type: PieceType }[] = [];
    if (mode === "2p-ns") {
      const backRank = [
        PIECES.TANK,
        PIECES.HORSEMAN,
        PIECES.SNIPER,
        PIECES.BATTLEKNIGHT,
        PIECES.COMMANDER,
        PIECES.SNIPER,
        PIECES.HORSEMAN,
        PIECES.TANK,
      ];
      const pawnRank = Array(8).fill(PIECES.BOT);
      if (p === "player1") {
        backRank.forEach((type, i) => targets.push({ r: 2, c: 2 + i, type }));
        pawnRank.forEach((type, i) => targets.push({ r: 3, c: 2 + i, type }));
      } else {
        backRank.forEach((type, i) => targets.push({ r: 9, c: 2 + i, type }));
        pawnRank.forEach((type, i) => targets.push({ r: 8, c: 2 + i, type }));
      }
    } else if (mode === "2p-ew") {
      const backRank = [
        PIECES.TANK,
        PIECES.HORSEMAN,
        PIECES.SNIPER,
        PIECES.BATTLEKNIGHT,
        PIECES.COMMANDER,
        PIECES.SNIPER,
        PIECES.HORSEMAN,
        PIECES.TANK,
      ];
      const pawnRank = Array(8).fill(PIECES.BOT);
      if (p === "player3") {
        backRank.forEach((type, i) => targets.push({ r: 2 + i, c: 2, type }));
        pawnRank.forEach((type, i) => targets.push({ r: 2 + i, c: 3, type }));
      } else {
        backRank.forEach((type, i) => targets.push({ r: 2 + i, c: 9, type }));
        pawnRank.forEach((type, i) => targets.push({ r: 2 + i, c: 8, type }));
      }
    } else {
      const formation = [
        [PIECES.TANK, PIECES.BATTLEKNIGHT, PIECES.COMMANDER, PIECES.TANK],
        [PIECES.HORSEMAN, PIECES.SNIPER, PIECES.SNIPER, PIECES.HORSEMAN],
        [PIECES.BOT, PIECES.BOT, PIECES.BOT, PIECES.BOT],
        [PIECES.BOT, PIECES.BOT, PIECES.BOT, PIECES.BOT],
      ];
      let rOrigins = 0,
        cOrigins = 0,
        rStep = 1;
      if (p === "player1") {
        rOrigins = 1;
        cOrigins = 1;
      } else if (p === "player2") {
        rOrigins = 1;
        cOrigins = 7;
      } else if (p === "player3") {
        rOrigins = 10;
        cOrigins = 1;
        rStep = -1;
      } else {
        rOrigins = 10;
        cOrigins = 7;
        rStep = -1;
      }
      for (let rIdx = 0; rIdx < 4; rIdx++) {
        for (let cIdx = 0; cIdx < 4; cIdx++) {
          targets.push({
            r: rOrigins + rIdx * rStep,
            c: cOrigins + cIdx,
            type: formation[rIdx][cIdx],
          });
        }
      }
    }

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
