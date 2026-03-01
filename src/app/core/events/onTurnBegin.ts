import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "@tc.types/game";

/**
 * Handle side-effects at the start of a turn.
 */
const onTurnBegin = ({
  G: _G,
  ctx: _ctx,
}: {
  G: TrenchessState;
  ctx: Ctx;
}) => {
  // Logic for turn start (e.g., status effect ticks)
};

export default onTurnBegin;
