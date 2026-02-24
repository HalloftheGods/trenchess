import { BOARD_SIZE } from "@/constants";
import { PIECES } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import type { TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

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
            G.activePlayers = G.activePlayers.filter(
              (ap: string) => ap !== victim,
            );
            for (let row = 0; row < BOARD_SIZE; row++) {
              for (let col = 0; col < BOARD_SIZE; col++) {
                if (G.board[row][col]?.player === victim)
                  G.board[row][col] = null;
              }
            }
          } else {
            G.board[r][c] = null;
          }
        }
      }
    }
  }
};

/**
 * Handle side-effects that happen after any move.
 */
export const onMove = ({ G, ctx }: { G: TrenchessState; ctx: Ctx }) => {
  const pid = G.playerMap[ctx.currentPlayer];
  if (!pid) return;

  // Global move side-effects can be added here.
  // Note: Desert rule is currently called within movePiece to get 'justMoved' context.
};

/**
 * Handle side-effects at the start of a turn.
 */
export const onTurnBegin = ({
  G: _G,
  ctx: _ctx,
}: {
  G: TrenchessState;
  ctx: Ctx;
}) => {
  // Logic for turn start (e.g., status effect ticks)
};
