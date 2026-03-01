import { resolvePlayerId } from "@/app/core/setup/coreHelpers";
import type { TrenchessState } from "@tc.types";
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
  const canOverride = isGM || gameState.isGamemaster;
  const playerId = resolvePlayerId(
    gameState,
    context,
    playerID,
    explicitPid,
    canOverride,
  );

  const hasPlayerId = !!playerId;
  if (hasPlayerId) {
    console.log(`[READY] Player ${playerId} is ready.`);
    gameState.readyPlayers[playerId!] = true;
  } else {
    console.warn(`[READY] Could not resolve player ID for ready move. explicitPid: ${explicitPid}, playerID: ${playerID}, isGM: ${isGM}, G.isGamemaster: ${gameState.isGamemaster}`);
  }
};
