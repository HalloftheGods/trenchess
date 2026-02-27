import type { Game } from "boardgame.io";
import { createInitialState } from "@/core/setup/setupLogic";
import type { TrenchessState } from "@/shared/types/game";
import { genesis } from "@/core/phases/genesis";
import { mainPhase } from "@/core/phases/mainPhase";
import { combatPhase } from "@/core/phases/combatPhase";
import { CORE_ADMIN_MOVES } from "@/core/mechanics/moves";
import { PHASES } from "@constants/game";

export const Trenchess: Game<TrenchessState> = {
  name: "trenchess",

  minPlayers: 2,
  maxPlayers: 4,

  moves: {
    ...CORE_ADMIN_MOVES,
  },

  setup: () => {
    const initialState = createInitialState(null, []);

    return {
      board: initialState.board,
      terrain: initialState.terrain,
      inventory: initialState.inventory,
      terrainInventory: initialState.terrainInventory,
      mercenaryPoints: initialState.mercenaryPoints,
      capturedBy: {},
      lostToDesert: [],
      lastMove: null,
      mode: null,
      activePlayers: ["red", "yellow", "green", "blue"],
      readyPlayers: {},
      playerMap: {
        "0": "red",
        "1": "yellow",
        "2": "green",
        "3": "blue",
      },
      winner: null,
      winnerReason: null,
      isGamemaster: true,
      isMercenary: false,
    };
  },

  phases: {
    [PHASES.GENESIS]: genesis,
    [PHASES.MAIN]: mainPhase,
    [PHASES.COMBAT]: combatPhase,
  },

  endIf: ({ G }) => {
    if (G.activePlayers.length === 1) {
      const winner = G.activePlayers[0];
      return { winner, reason: G.winnerReason || "checkmate" };
    }
  },
};
