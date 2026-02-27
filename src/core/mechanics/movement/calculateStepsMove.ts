import type { BoardPiece, TerrainType } from "@/shared/types";
import { isCellHabitable } from "./isCellHabitable";

/**
 * calculateStepMoves (Atom)
 * Handles non-sliding move patterns from blueprints.
 */
export const calculateStepMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  validMoves: number[][],
  pattern?: (r: number, c: number) => [number, number][],
) => {
  if (!pattern) return;
  pattern(row, col).forEach(([tr, tc]) => {
    isCellHabitable(tr, tc, piece, player, board, terrain, validMoves);
  });
};
