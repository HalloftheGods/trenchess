import type { TrenchessState } from "@tc.types";
import { INVALID_MOVE } from "boardgame.io/core";
import type { FnContext } from "boardgame.io";
import { setMode } from "./bulkSetup";

/**
 * Debug moves for direct state manipulation.
 * These are globally available but check for GM flag.
 */

export const setTurn = (
  { events, G }: FnContext<TrenchessState>,
  nextPlayer: string,
) => {
  if (!G.isGamemaster) return INVALID_MOVE;

  // Convert player ID (red, blue, etc.) to boardgame.io player index (0, 1, etc.)
  const nextPlayerIndex = Object.keys(G.playerMap).find(
    (key) => G.playerMap[key] === nextPlayer,
  );

  if (nextPlayerIndex) {
    events.endTurn({ next: nextPlayerIndex });
  } else {
    // If not found, try as index directly
    events.endTurn({ next: nextPlayer });
  }
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

export const setActiveScreen = (
  { G }: { G: TrenchessState },
  screenId: string | undefined,
) => {
  if (!G.isGamemaster) return INVALID_MOVE;
  G.activeScreen = screenId;
};

export const authorizeMasterProtocol = ({ G }: { G: TrenchessState }) => {
  G.isGamemaster = true;
};

export const CORE_ADMIN_MOVES = {
  patchG,
  setTurn,
  setPhase,
  setMode,
  setActiveScreen,
  authorizeMasterProtocol,
};
