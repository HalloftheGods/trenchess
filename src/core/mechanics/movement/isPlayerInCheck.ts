import { PIECES } from "@constants/pieces";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types";
import { isCellGuarded } from "./isCellGuarded";

const { KING } = PIECES;

/**
 * isPlayerInCheck (Molecule)
 * Checks if the current player's Commander (King) is under threat from any enemy unit.
 * Uses targeted reverse-lookup search for maximum performance.
 */
export const isPlayerInCheck = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  // 1. Find King (Commander)
  let kingPosition: [number, number] | null = null;

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const piece = board[r][c];
      if (piece?.player === player && piece?.type === KING) {
        kingPosition = [r, c];
        break;
      }
    }
    if (kingPosition) break;
  }

  if (!kingPosition) return true; // Lost state if King is missing

  const [kingRow, kingCol] = kingPosition;

  // 2. Targeted threat detection
  return isCellGuarded(kingRow, kingCol, player, board, terrain, mode);
};
