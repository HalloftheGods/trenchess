import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "@tc.types/game";
import { applyDesertRule } from "@mechanics/terrain/applyDesertRule";

/**
 * Handle side-effects that happen after any move.
 */
const onMove = ({ G, ctx }: { G: TrenchessState; ctx: Ctx }) => {
  const pid = G.playerMap[ctx.currentPlayer];
  if (!pid) return;

  console.log(`[ON_MOVE] Player: ${pid}. Move: ${JSON.stringify(G.lastMove)}`);

  // Global move side-effects can be added here.
  
  // Apply Passive Terrain Events (Desert Rule)
  if (G.lastMove) {
    const { to } = G.lastMove;
    applyDesertRule(G, pid, { r: to[0], c: to[1] });
  }
};

export default onMove;
