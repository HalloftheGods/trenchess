import { resolvePlayerId } from "@/core/setup/coreHelpers";
import type { TrenchessState } from "@/shared/types";
import type { Ctx } from "boardgame.io";

/**
 * ready (Atom)
 * Sets a player's status to ready during the pre-game Setup phase.
 */
export const ready = (
  {
    G: gameState,
    playerID,
    ctx: context,
  }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
  isGM?: boolean,
) => {
  const playerId = resolvePlayerId(
    gameState,
    context,
    playerID,
    explicitPid,
    isGM,
  );
  
  const hasPlayerId = !!playerId;
  if (hasPlayerId) {
    gameState.readyPlayers[playerId!] = true;
  }
};
