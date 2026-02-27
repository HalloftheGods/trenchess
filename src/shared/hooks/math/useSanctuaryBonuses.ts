import { isUnitProtected } from "@/core/mechanics";
import type { BoardPiece, TerrainType } from "@/shared/types/game";

export function useSanctuaryBonuses(
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
) {
  // Derived inline for zero-lag synchronization with engine state
  const bonuses: Record<string, number> = {
    red: 0,
    yellow: 0,
    green: 0,
    blue: 0,
  };

  if (!board || !terrain) return bonuses;

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < (board[r]?.length || 0); c++) {
      const piece = board[r][c];
      if (piece) {
        const t = terrain[r]?.[c];
        if (t && isUnitProtected(piece.type, t)) {
          bonuses[piece.player] = (bonuses[piece.player] || 0) + 1;
        }
      }
    }
  }
  return bonuses;
}
