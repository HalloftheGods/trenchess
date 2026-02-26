import type { TrenchessState } from "@/shared/types";
import { INVALID_MOVE } from "boardgame.io/core";
import type { FnContext } from "boardgame.io";

/**
 * Debug moves for direct state manipulation.
 * These are globally available but check for GM flag.
 */

export const setTurn = (
  { events, G }: FnContext<TrenchessState>,
  nextPlayer: string,
) => {
  if (!G.isGamemaster) return INVALID_MOVE;
  events.endTurn({ next: nextPlayer });
};

export const setPhase = (
  { events, G }: FnContext<TrenchessState>,
  phase: string,
) => {
  if (!G.isGamemaster) return INVALID_MOVE;
  events.setPhase(phase);
};

export const patchG = (
  { G }: { G: TrenchessState },
  patch: Partial<TrenchessState>,
) => {
  if (!G.isGamemaster) return INVALID_MOVE;
  Object.assign(G, patch);
};

export const authorizeMasterProtocol = ({ G }: { G: TrenchessState }) => {
  G.isGamemaster = true;
};

export const CORE_ADMIN_MOVES = {
  patchG,
  setTurn,
  setPhase,
  authorizeMasterProtocol,
};
