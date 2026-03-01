import { BOARD_SIZE } from "@constants";
import { PIECES } from "@constants";
import { TERRAIN_TYPES } from "@constants";
import type { TrenchessState } from "@tc.types/game";

const { KING } = PIECES;

/**
 * Pieces in desert must move or perish.
 * This is applied to the current player's pieces at the end of their move.
 */
export const applyDesertRule = (
  G: TrenchessState,
  pid: string,
  justMoved: { r: number; c: number } | null,
) => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = G.board[r][c];
      if (p && p.player === pid && G.terrain[r][c] === TERRAIN_TYPES.DESERT) {
        // If it wasn't the piece that just moved, it perishes
        if (!justMoved || r !== justMoved.r || c !== justMoved.c) {
          if (p.type === KING) {
            const victim = p.player;
            G.lostToDesert.push({ ...p });
            G.activePlayers = G.activePlayers.filter(
              (ap: string) => ap !== victim,
            );
            if (G.activePlayers.length === 1) {
              G.winner = G.activePlayers[0];
              G.winnerReason = "checkmate"; // King elimination counts as checkmate/victory
            }
            for (let row = 0; row < BOARD_SIZE; row++) {
              for (let col = 0; col < BOARD_SIZE; col++) {
                const pieceAtCell = G.board[row][col];
                if (pieceAtCell?.player === victim) {
                  G.lostToDesert.push({ ...pieceAtCell });
                  G.board[row][col] = null;
                }
              }
            }
          } else {
            G.lostToDesert.push({ ...p });
            G.board[r][c] = null;
          }
        }
      }
    }
  }
};
