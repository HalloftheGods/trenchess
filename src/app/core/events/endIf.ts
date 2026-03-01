import type { TrenchessState } from "@tc.types/game";

/**
 * Global game end condition.
 */
export const gameEndIf = ({ G }: { G: TrenchessState }) => {
  if (G.activePlayers.length === 1) {
    const winner = G.activePlayers[0];
    console.log(`[GAME_END] Active players count: ${G.activePlayers.length}. Winner: ${winner}. Reason: ${G.winnerReason || "checkmate"}`);
    return { winner, reason: G.winnerReason || "checkmate" };
  }
};

/**
 * End condition for the Main Phase (Trench Craft).
 */
export const mainPhaseEndIf = ({ G }: { G: TrenchessState }) => {
  const allReady = G.activePlayers.every((p: string) => G.readyPlayers[p]);
  if (allReady) {
    console.log(`[PHASE_END] Main Phase ending. All players ready: ${G.activePlayers.join(", ")}`);
  }
  return allReady;
};
