import type { BoardPiece, TerrainType } from "@/shared/types";
import { isCellHabitable } from "./isCellHabitable";

/**
 * calculateSlidingMoves (Atom)
 * Handles sliding move patterns in specific directions.
 */
export const calculateSlidingMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  validMoves: number[][],
  directions: number[][],
) => {
  directions.forEach(([dr, dc]) => {
    let tr = row + dr;
    let tc = col + dc;
    while (isCellHabitable(tr, tc, piece, player, board, terrain, validMoves)) {
      const isOccupied = !!board[tr][tc];
      if (isOccupied) break;
      tr += dr;
      tc += dc;
    }
  });
};
