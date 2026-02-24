import { movePiece, forfeit } from "@/core/moves";
import { onMove } from "@/core/events";
import type { TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export const playPhase = {
  onMove,
  turn: {
    minMoves: 1,
    maxMoves: 1,
    order: {
      first: () => 0,
      next: ({ G, ctx }: { G: TrenchessState; ctx: Ctx }) =>
        (ctx.playOrderPos + 1) % G.activePlayers.length,
    },
  },
  moves: {
    movePiece,
    forfeit,
  },
};
