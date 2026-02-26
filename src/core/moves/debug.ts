import type { TrenchessState, GameMode } from "@/shared/types";
import { getPlayersForMode } from "@/core/setup/territory";
import { INVALID_MOVE } from "boardgame.io/core";

/**
 * Debug moves for direct state manipulation.
 * These are globally available but check for GM flag.
 */

export const setTurn = ({ events, G }: any, nextPlayer: string) => {
  if (!G.isGamemaster) return INVALID_MOVE;
  events.endTurn({ next: nextPlayer });
};

export const setPhase = ({ events, G }: any, phase: string) => {
  if (!G.isGamemaster) return INVALID_MOVE;
  events.setPhase(phase);
};

export const patchG = ({ G }: { G: TrenchessState }, patch: Partial<TrenchessState>) => {
  if (!G.isGamemaster) return INVALID_MOVE;
  Object.assign(G, patch);
};

export const debugSetMode = ({ G }: { G: TrenchessState }, mode: GameMode) => {
  if (!G.isGamemaster) return INVALID_MOVE;
  G.mode = mode;
  G.activePlayers = getPlayersForMode(mode);
};
