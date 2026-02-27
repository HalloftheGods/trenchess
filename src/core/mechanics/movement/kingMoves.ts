import { PIECES } from "@constants/pieces";
import { UNIT_BLUEPRINTS } from "@/core/blueprints/units";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types";
import { isCellHabitable } from "./isCellHabitable";
import { isCellGuarded } from "./isCellGuarded";
import { calculateStepMoves } from "./calculateStepsMove";

const { KING } = PIECES;

/**
 * calculateKingMoves (Molecule)
 */
export const calculateKingMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
  recursionDepth: number,
  validMoves: number[][],
) => {
  const blueprint = UNIT_BLUEPRINTS[KING];

  // 1. Standard 1-step moves
  calculateStepMoves(
    row,
    col,
    piece,
    player,
    board,
    terrain,
    validMoves,
    blueprint.movePattern,
  );

  // 2. Orthogonal Joust (2-step jumps)
  blueprint.newMovePattern?.(row, col).forEach(([tr, tc]) => {
    const dr = (tr - row) / 2;
    const dc = (tc - col) / 2;
    const midRow = row + dr;
    const midCol = col + dc;

    const midPiece = board[midRow]?.[midCol];
    const isSafeToPass = !midPiece || midPiece.player !== player;

    if (isSafeToPass) {
      if (recursionDepth > 0) {
        isCellHabitable(tr, tc, piece, player, board, terrain, validMoves);
      } else {
        const isMidPointGuarded = isCellGuarded(
          midRow,
          midCol,
          player,
          board,
          terrain,
          mode,
        );

        if (!isMidPointGuarded) {
          isCellHabitable(tr, tc, piece, player, board, terrain, validMoves);
        }
      }
    }
  });
};
