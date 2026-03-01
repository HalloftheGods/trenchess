import {
  movePiece,
  forfeit,
  CORE_ADMIN_MOVES,
} from "@mechanics/moves";
import { onMove, onTurnBegin } from "@engine/events";
import type { TrenchessState } from "@tc.types/game";
import type { Ctx } from "boardgame.io";

/**
 * Combat Phase: The "Labryinth" stage.
 * Tactical battle where armies clash and kings are pursued.
 */
export const combatPhase = {
  onBegin: ({ G }: { G: TrenchessState }) => {
    console.log(`[PHASE_START] Combat Phase starting. Mode: ${G.mode}. Active Players: ${G.activePlayers.join(", ")}`);
  },
  moves: {
    ...CORE_ADMIN_MOVES,
    movePiece,
    forfeit,
  },
  turn: {
    onBegin: onTurnBegin,
    onMove,
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
