import type { Game } from "boardgame.io";
import { createInitialState } from "@engine/setup/setupLogic";
import type { TrenchessState } from "@tc.types/game";
import { genesisPhase } from "@engine/phases/genesisPhase";
import { mainPhase } from "@engine/phases/mainPhase";
import { combatPhase } from "@engine/phases/combatPhase";
import { CORE_ADMIN_MOVES } from "@engine/mechanics/moves";
import { GAME, PHASES } from "@constants/game";
import { gameEndIf } from "@engine/events";

export const Trenchess: Game<TrenchessState> = {
  name: GAME.NAME,

  minPlayers: GAME.PLAYERS.MIN,
  maxPlayers: GAME.PLAYERS.MAX,

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
    [PHASES.GENESIS]: genesisPhase,
    [PHASES.MAIN]: mainPhase,
    [PHASES.COMBAT]: combatPhase,
  },

  endIf: gameEndIf,
};
