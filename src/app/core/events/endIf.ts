import type { TrenchessState } from "@tc.types/game";

/**
 * Global game end condition.
 */
export const gameEndIf = ({ G }: { G: TrenchessState }) => {
  if (G.activePlayers.length === 1) {
    const winner = G.activePlayers[0];
    return { winner, reason: G.winnerReason || "checkmate" };
  }
};

/**
 * End condition for the Main Phase (Trench Craft).
 */
export const mainPhaseEndIf = ({ G }: { G: TrenchessState }) => {
  return G.activePlayers.every((p: string) => G.readyPlayers[p]);
};
