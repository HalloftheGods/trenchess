import { BOARD_SIZE } from "@/core/primitives/game";
import { PIECES } from "@/core/primitives/pieces";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types/game";

const { KING } = PIECES;
import { getValidMoves } from "@/core/mechanics/movement/movementLogic";

export const isPlayerInCheck = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  // 1. Find King (Commander)
  let kingPos: [number, number] | null = null;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.player === player && p.type === KING.id) {
        kingPos = [r, c];
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return true; // No king = lost (conceptually)

  const [kr, kc] = kingPos;

  // 2. Check if any enemy piece can attack kingPos
  return board.some((row, r) =>
    row.some((cell, c) => {
      // If it's an enemy piece
      if (cell && cell.player !== player) {
        // Get their raw moves (depth 1 to skip check filter)
        const moves = getValidMoves(
          r,
          c,
          cell,
          cell.player,
          board,
          terrain,
          mode,
          1,
        );
        // If they can hit the king
        return moves.some(([mr, mc]) => mr === kr && mc === kc);
      }
      return false;
    }),
  );
};

export const hasAnyValidMoves = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  return board.some((row, r) =>
    row.some((cell, c) => {
      if (cell && cell.player === player) {
        const moves = getValidMoves(
          r,
          c,
          cell,
          player,
          board,
          terrain,
          mode,
          0,
        );
        return moves.length > 0;
      }
      return false;
    }),
  );
};
