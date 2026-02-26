import {
  movePiece,
  forfeit,
  CORE_ADMIN_MOVES,
} from "@/core/moves";
import { onMove } from "@/core/events";
import type { TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export const playPhase = {
  onMove,
  moves: {
    ...CORE_ADMIN_MOVES,
    movePiece,
    forfeit,
  },
  turn: {
    minMoves: 1,
    maxMoves: 1,
    order: {
      first: () => 0,
      next: ({ G, ctx }: { G: TrenchessState; ctx: Ctx }) => {
        let nextPos = (ctx.playOrderPos + 1) % ctx.numPlayers;
        const isPlayerActive = (pos: number) => {
          const pid = G.playerMap[ctx.playOrder[pos]];
          return G.activePlayers.includes(pid);
        };

        while (!isPlayerActive(nextPos) && nextPos !== ctx.playOrderPos) {
          nextPos = (nextPos + 1) % ctx.numPlayers;
        }
        return nextPos;
      },
    },
  },
};
