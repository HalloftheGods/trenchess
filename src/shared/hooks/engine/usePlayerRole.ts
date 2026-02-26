import { useMemo } from "react";
import type { TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export function usePlayerRole(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
  playerID?: string,
) {
  const currentTurn = useMemo(() => {
    if (bgioState?.G?.playerMap && bgioState?.ctx) {
      return bgioState.G.playerMap[bgioState.ctx.currentPlayer];
    }
    return "red";
  }, [bgioState]);

  const localPlayer = useMemo(() => {
    if (playerID && bgioState?.G?.playerMap[playerID]) {
      return bgioState.G.playerMap[playerID];
    }
    return currentTurn;
  }, [playerID, bgioState, currentTurn]);

  return { currentTurn, localPlayer };
}
