import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "@tc.types/game";

/**
 * Handle side-effects at the start of a turn.
 */
const onTurnBegin = ({
  G,
  ctx,
}: {
  G: TrenchessState;
  ctx: Ctx;
}) => {
  const pid = G.playerMap[ctx.currentPlayer];
  console.log(`[ON_TURN_BEGIN] Turn: ${ctx.turn}. Current Player: ${pid} (ID: ${ctx.currentPlayer})`);
  // Logic for turn start (e.g., status effect ticks)
};

export default onTurnBegin;
