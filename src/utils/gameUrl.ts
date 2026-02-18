import type { GameMode, BoardPiece, TerrainType, PieceType } from "../types";
import { BOARD_SIZE, TERRAIN_TYPES } from "../constants";

interface GameSeed {
  m: GameMode; // mode
  b: { r: number; c: number; p: string; t: string }[]; // board pieces: row, col, player, type
  t: { r: number; c: number; v: string }[]; // terrain: row, col, value (type)
  n?: string; // name of layout
}

/**
 * Encodes the current board and terrain configuration into a base64 string.
 */
export const serializeGame = (
  mode: GameMode,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  layoutName?: string,
): string => {
  const bData: GameSeed["b"] = [];
  const tData: GameSeed["t"] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece) {
        bData.push({ r, c, p: piece.player, t: piece.type });
      }
      const t = terrain[r][c];
      if (t !== TERRAIN_TYPES.FLAT) {
        tData.push({ r, c, v: t });
      }
    }
  }

  const seed: GameSeed = { m: mode, b: bData, t: tData, n: layoutName };
  try {
    return btoa(JSON.stringify(seed));
  } catch (e) {
    console.error("Failed to serialize game", e);
    return "";
  }
};

/**
 * Decodes a base64 string back into game state components.
 */
export const deserializeGame = (
  encoded: string,
): {
  mode: GameMode;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  layoutName?: string;
} | null => {
  try {
    const json = atob(encoded);
    const seed: GameSeed = JSON.parse(json);

    // Validate mode basic check
    if (!["2p-ns", "2p-ew", "4p", "2v2"].includes(seed.m)) {
      console.warn("Invalid mode in seed:", seed.m);
      return null;
    }

    // Reconstruct Board
    const board: (BoardPiece | null)[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));

    if (Array.isArray(seed.b)) {
      seed.b.forEach((item) => {
        if (
          item.r >= 0 &&
          item.r < BOARD_SIZE &&
          item.c >= 0 &&
          item.c < BOARD_SIZE
        ) {
          board[item.r][item.c] = {
            type: item.t as PieceType,
            player: item.p,
          };
        }
      });
    }

    // Reconstruct Terrain
    const terrain: TerrainType[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT));

    if (Array.isArray(seed.t)) {
      seed.t.forEach((item) => {
        if (
          item.r >= 0 &&
          item.r < BOARD_SIZE &&
          item.c >= 0 &&
          item.c < BOARD_SIZE
        ) {
          terrain[item.r][item.c] = item.v as TerrainType;
        }
      });
    }

    return { mode: seed.m, board, terrain, layoutName: seed.n };
  } catch (e) {
    console.error("Failed to deserialize game seed", e);
    return null;
  }
};

/**
 * Adapts a seed to a specific target game mode (e.g. rotating for NS <-> EW).
 */
export const adaptSeedToMode = (
  seed: {
    mode: GameMode;
    board: (BoardPiece | null)[][];
    terrain: TerrainType[][];
    layoutName?: string;
  },
  targetMode: GameMode,
) => {
  // If modes match, or if either is not 2-player (complex mapping), return as is for now
  if (seed.mode === targetMode) return seed;

  const isSeedNS = seed.mode === "2p-ns";
  const isTargetEW = targetMode === "2p-ew";
  const isSeedEW = seed.mode === "2p-ew";
  const isTargetNS = targetMode === "2p-ns";

  // Only handle NS <-> EW Rotation for now
  if (!((isSeedNS && isTargetEW) || (isSeedEW && isTargetNS))) {
    return seed;
  }

  const newBoard: (BoardPiece | null)[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  const newTerrain: TerrainType[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT as TerrainType));

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      // Transpose coordinates: (r, c) -> (c, r)
      // This maps Rows (NS) to Columns (EW) ensuring P1 (Top) becomes P3 (Left)
      const tr = c;
      const tc = r;

      newTerrain[tr][tc] = seed.terrain[r][c];

      const piece = seed.board[r][c];
      if (piece) {
        let newPlayer = piece.player;
        if (isSeedNS && isTargetEW) {
          if (piece.player === "player1") newPlayer = "player3"; // P1 (N) -> P3 (W)
          if (piece.player === "player4") newPlayer = "player2"; // P4 (S) -> P2 (E)
        } else if (isSeedEW && isTargetNS) {
          if (piece.player === "player3") newPlayer = "player1"; // P3 (W) -> P1 (N)
          if (piece.player === "player2") newPlayer = "player4"; // P2 (E) -> P4 (S)
        }
        newBoard[tr][tc] = { ...piece, player: newPlayer };
      }
    }
  }

  return { ...seed, mode: targetMode, board: newBoard, terrain: newTerrain };
};
