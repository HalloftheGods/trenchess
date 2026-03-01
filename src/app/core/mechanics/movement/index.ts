import { PIECES } from "@constants/pieces";
import { UNIT_BLUEPRINTS } from "@/app/core/blueprints/units";
import type { BoardPiece, TerrainType, GameMode } from "@tc.types";

import { isPlayerInCheck as baseIsPlayerInCheck } from "./isPlayerInCheck";
import { hasAnyValidMoves as baseHasAnyValidMoves } from "./hasAnyValidMoves";
import { calculatePawnMoves } from "./pawnMoves";
import { calculateKingMoves } from "./kingMoves";
import { calculateSlidingMoves } from "./slidingMoves";
import { calculateStepMoves } from "./calculateStepsMove";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

/**
 * getValidMoves — The definitive tactical calculation for unit movement.
 * Refactored to use UNIT_BLUEPRINTS and provide clean, readable logic.
 */
export const getValidMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
  recursionDepth = 0,
  skipCheck = false,
): number[][] => {
  const validMoves: number[][] = [];
  const { type } = piece;

  if (type === PAWN) {
    calculatePawnMoves(row, col, player, board, mode, validMoves);
  } else if (type === KNIGHT) {
    calculateStepMoves(
      row,
      col,
      piece,
      player,
      board,
      terrain,
      validMoves,
      UNIT_BLUEPRINTS[KNIGHT].movePattern,
    );
    calculateStepMoves(
      row,
      col,
      piece,
      player,
      board,
      terrain,
      validMoves,
      UNIT_BLUEPRINTS[KNIGHT].newMovePattern,
    );
  } else if (type === BISHOP) {
    calculateSlidingMoves(row, col, piece, player, board, terrain, validMoves, [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]);
    calculateStepMoves(
      row,
      col,
      piece,
      player,
      board,
      terrain,
      validMoves,
      UNIT_BLUEPRINTS[BISHOP].newMovePattern,
    );
  } else if (type === ROOK) {
    calculateSlidingMoves(row, col, piece, player, board, terrain, validMoves, [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]);
    calculateStepMoves(
      row,
      col,
      piece,
      player,
      board,
      terrain,
      validMoves,
      UNIT_BLUEPRINTS[ROOK].newMovePattern,
    );
  } else if (type === QUEEN) {
    calculateSlidingMoves(row, col, piece, player, board, terrain, validMoves, [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]);
    calculateStepMoves(
      row,
      col,
      piece,
      player,
      board,
      terrain,
      validMoves,
      UNIT_BLUEPRINTS[QUEEN].newMovePattern,
    );
  } else if (type === KING) {
    calculateKingMoves(
      row,
      col,
      piece,
      player,
      board,
      terrain,
      mode,
      recursionDepth,
      validMoves,
    );
  }

  // Final Safety Check: Checkmate Prevention
  const isOuterSearch = recursionDepth === 0;
  if (isOuterSearch && !skipCheck) {
    const isSafeMove = ([moveRow, moveCol]: number[]) => {
      // 1. Create a shallow clone of the board to prevent mutating frozen state
      const testBoard = board.map(r => [...r]);

      // 2. Cache target state is no longer needed since we use a clone
      // const originalTargetPiece = testBoard[moveRow][moveCol];

      // 3. Temporarily apply move
      testBoard[moveRow][moveCol] = piece;
      testBoard[row][col] = null;

      // 4. Check for threat
      const isSafe = !isPlayerInCheck(player, testBoard, terrain, mode);

      // Revert state is no longer needed as we throw away testBoard
      return isSafe;
    };
    return validMoves.filter(isSafeMove);
  }

  return validMoves;
};

/**
 * isPlayerInCheck (Molecule)
 */
export const isPlayerInCheck = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  return baseIsPlayerInCheck(player, board, terrain, mode);
};

/**
 * hasAnyValidMoves (Molecule)
 */
export const hasAnyValidMoves = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  return baseHasAnyValidMoves(player, board, terrain, mode, getValidMoves);
};
