import { INVALID_MOVE } from "boardgame.io/core";
import { resolvePlayerId } from "@/app/core/setup/coreHelpers";
import type { TrenchessState } from "@tc.types";
import type { Ctx } from "boardgame.io";

/**
 * forfeit (Atom)
 * Allows a player to concede the match.
 */
export const forfeit = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
  isGM?: boolean,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid, isGM);
  if (!playerId) return INVALID_MOVE;

  // Remove the player from activePlayers
  G.activePlayers = G.activePlayers.filter((p) => p !== playerId);

  if (G.activePlayers.length === 1) {
    G.winner = G.activePlayers[0];
    G.winnerReason = "forfeit";
  }
};
