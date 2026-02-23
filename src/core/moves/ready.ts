import type { TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export const ready = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const pid =
    explicitPid ||
    (playerID !== undefined
      ? G.playerMap[playerID]
      : G.playerMap[ctx.currentPlayer]);
  if (pid) G.readyPlayers[pid] = true;
};
