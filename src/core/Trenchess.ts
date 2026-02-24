import type { Game, Ctx } from "boardgame.io";
import { createInitialState } from "@/core/setup/setupLogic";
import type {
  GameMode,
  TrenchessState,
  TrenchessSetupData,
} from "@/shared/types/game";
import { setupPhase } from "@/core/phases/setupPhase";
import { playPhase } from "@/core/phases/playPhase";

export const Trenchess: Game<TrenchessState, Ctx, TrenchessSetupData> = {
  name: "trenchess",

  setup: (_, setupData) => {
    const data = setupData as TrenchessSetupData;
    const mode: GameMode = data?.mode || "2p-ns";
    let players: string[];

    const playerMap: Record<string, string> = {
      "0": "red",
      "1": "yellow",
      "2": "green",
      "3": "blue",
    };

    switch (mode) {
      case "2p-ns":
        players = ["red", "blue"];
        playerMap["0"] = "red";
        playerMap["1"] = "blue";
        break;
      case "2p-ew":
        players = ["green", "yellow"];
        playerMap["0"] = "green";
        playerMap["1"] = "yellow";
        break;
      default:
        players = ["red", "yellow", "green", "blue"];
        break;
    }

    const {
      board: initialBoard,
      terrain: initialTerrain,
      inventory: initialInventory,
      terrainInventory: initialTerrainInventory,
    } = createInitialState(mode, players);

    const initialReadyPlayers: Record<string, boolean> = {};
    let allPlaced = true;

    // Check if the game is already fully placed via setupData
    if (data?.inventory) {
      players.forEach((p) => {
        const remainingUnits = (data.inventory![p] || []).length;
        if (remainingUnits === 0) {
          initialReadyPlayers[p] = true;
        } else {
          allPlaced = false;
        }
      });
    } else {
      allPlaced = false;
    }

    return {
      board: data?.board || initialBoard,
      terrain: data?.terrain || initialTerrain,
      inventory: data?.inventory || initialInventory,
      terrainInventory: data?.terrainInventory || initialTerrainInventory,
      capturedBy: { red: [], yellow: [], green: [], blue: [] },
      lostToDesert: [],
      lastMove: null,
      mode,
      activePlayers: players,
      readyPlayers: allPlaced ? initialReadyPlayers : {},
      playerMap,
    };
  },

  phases: {
    setup: setupPhase,
    play: playPhase,
  },

  endIf: ({ G }) => {
    if (G.activePlayers.length === 1) {
      return { winner: G.activePlayers[0] };
    }
  },
};
