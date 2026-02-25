import { BOARD_SIZE } from "@constants";
import { TERRAIN_TYPES } from "@constants";
import type { TerrainType, BoardPiece, GameMode } from "@/shared/types";
import { getClassicalFormationTargets } from "../formations";

export const buildBoard = (): (BoardPiece | null)[][] =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

/**
 * buildClassicalBoard (Molecule)
 * Generates a board with a standard starting formation for the given mode.
 */
export const buildClassicalBoard = (
  mode: GameMode,
): (BoardPiece | null)[][] => {
  const board = buildBoard();
  const players =
    mode === "2p-ns"
      ? ["red", "blue"]
      : mode === "2p-ew"
        ? ["green", "yellow"]
        : ["red", "yellow", "green", "blue"];

  players.forEach((player) => {
    const targets = getClassicalFormationTargets(player, mode);
    targets.forEach(({ row, col, type }) => {
      board[row][col] = { type, player };
    });
  });

  return board;
};

export const buildTerrain = (): TerrainType[][] =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT));

export { serializeGame } from "@/shared/utils/gameUrl";
