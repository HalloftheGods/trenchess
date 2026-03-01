import { PHASES } from "@constants/game";
import { CORE_ADMIN_MOVES } from "@mechanics/moves";

/**
 * Menu Phase: Local idle state for the main UI.
 * This phase is active when players are unconfigured or browsing UI configurations contextually prior to starting a match.
 */
export const menuPhase = {
  start: true,
  next: PHASES.GENESIS,
  moves: {
    ...CORE_ADMIN_MOVES,
  },
  turn: {
    activePlayers: { all: "idle" },
    stages: {
      idle: {
        moves: {
          ...CORE_ADMIN_MOVES,
        },
      },
    },
  },
};
