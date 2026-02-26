import type { Game } from "boardgame.io";
import { createInitialState } from "@/core/setup/setupLogic";
import type {
  GameMode,
  TrenchessState,
  TrenchessSetupData,
} from "@/shared/types/game";
import { setupPhase } from "@/core/phases/setupPhase";
import { playPhase } from "@/core/phases/playPhase";
import {
  placePiece,
  placeTerrain,
  ready,
  randomizeTerrain,
  randomizeUnits,
  setClassicalFormation,
  applyChiGarden,
  resetToOmega,
  resetTerrain,
  resetUnits,
  forfeit,
  setMode,
  mirrorBoard,
  setTurn,
  setPhase,
  patchG,
} from "@/core/moves";

export const Trenchess: Game<
  TrenchessState,
  Record<string, unknown>,
  TrenchessSetupData
> = {
  name: "trenchess",

  minPlayers: 2,
  maxPlayers: 4,

  moves: {
    setTurn,
    setPhase,
    patchG,
    setMode,
  },

  setup: (_, setupData) => {
    const data = setupData as TrenchessSetupData;
    const mode: GameMode = data?.mode || "4p";
    let players: string[];

    const playerMap: Record<string, string> = {};

    switch (mode) {
      case "2p-ns":
        players = ["red", "blue"];
        break;
      case "2p-ew":
        players = ["green", "yellow"];
        break;
      default:
        players = ["red", "yellow", "green", "blue"];
        break;
    }

    // Map boardgame.io player indices to our color-based IDs
    players.forEach((pid, index) => {
      playerMap[index.toString()] = pid;
    });

    const {
      board: initialBoard,
      terrain: initialTerrain,
      inventory: initialInventory,
      terrainInventory: initialTerrainInventory,
      mercenaryPoints: initialMercenaryPoints,
    } = createInitialState(mode, players, data?.isMercenary);

    const initialReadyPlayers: Record<string, boolean> = {};

    return {
      board: data?.board || initialBoard,
      terrain: data?.terrain || initialTerrain,
      inventory: data?.inventory || initialInventory,
      terrainInventory: data?.terrainInventory || initialTerrainInventory,
      mercenaryPoints: initialMercenaryPoints,
      capturedBy: { red: [], yellow: [], green: [], blue: [] },
      lostToDesert: [],
      lastMove: null,
      mode,
      activePlayers: players,
      readyPlayers: initialReadyPlayers,
      playerMap,
      winner: null,
      winnerReason: null,
      isGamemaster: data?.isGamemaster || false,
      isMercenary: data?.isMercenary || false,
      fogOfWar: true,
    };
  },

  phases: {
    gamemaster: {
      start: true,
      next: "setup",
      turn: {
        activePlayers: { all: "editing" },
        stages: {
          editing: {
            moves: {
              placePiece: (game, row, col, type, explicitPid) =>
                placePiece(game, row, col, type, explicitPid, true),
              placeTerrain: (game, row, col, type, explicitPid) =>
                placeTerrain(game, row, col, type, explicitPid, true),
              ready: (game, explicitPid) => ready(game, explicitPid, true),
              randomizeTerrain: (game, explicitPid) =>
                randomizeTerrain(game, explicitPid, true),
              randomizeUnits: (game, explicitPid) =>
                randomizeUnits(game, explicitPid, true),
              setClassicalFormation: (game, explicitPid) =>
                setClassicalFormation(game, explicitPid, true),
              applyChiGarden: (game, explicitPid) =>
                applyChiGarden(game, explicitPid, true),
              resetToOmega: (game, explicitPid) =>
                resetToOmega(game, explicitPid, true),
              resetTerrain: (game, explicitPid) =>
                resetTerrain(game, explicitPid, true),
              resetUnits: (game, explicitPid) =>
                resetUnits(game, explicitPid, true),
              forfeit: (game, explicitPid) => forfeit(game, explicitPid, true),
              setMode,
              mirrorBoard: (game, explicitPid) =>
                mirrorBoard(game, explicitPid, true),
              finishGamemaster: ({ events }) => {
                events?.endPhase();
              },
            },
          },
        },
      },
      // Skip by default unless isGamemaster is true
      endIf: ({ G }) => !G.isGamemaster,
    },
    setup: setupPhase,
    play: playPhase,
  },

  endIf: ({ G }) => {
    if (G.activePlayers.length === 1) {
      const winner = G.activePlayers[0];
      return { winner, reason: G.winnerReason || "checkmate" };
    }
  },
};
