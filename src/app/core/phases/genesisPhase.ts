import type { Ctx } from "boardgame.io";
import type {
  TrenchessState,
  PieceType,
  TerrainType,
  BoardPiece,
} from "@tc.types";
import { PHASES } from "@constants/game";
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
  mirrorBoard,
  CORE_ADMIN_MOVES,
} from "@mechanics/moves";

/**
 * Genesis Phase: The "Creation" stage.
 * Used for initial match configuration and standalone Architect (Zen Garden) mode.
 */
export const genesisPhase = {
  next: PHASES.MAIN,
  moves: {
    ...CORE_ADMIN_MOVES,
  },
  turn: {
    activePlayers: { all: "editing" },
    stages: {
      editing: {
        moves: {
          placePiece: (
            game: { G: TrenchessState; ctx: Ctx; playerID?: string },
            row: number,
            col: number,
            type: PieceType,
            explicitPid?: string,
          ) => placePiece(game, row, col, type, explicitPid, true),
          placeTerrain: (
            game: { G: TrenchessState; ctx: Ctx; playerID?: string },
            row: number,
            col: number,
            type: TerrainType,
            explicitPid?: string,
          ) => placeTerrain(game, row, col, type, explicitPid, true),
          ready: (
            game: { G: TrenchessState; ctx: Ctx; playerID?: string },
            explicitPid?: string,
          ) => ready(game, explicitPid, true),
          randomizeTerrain: (
            game: {
              G: TrenchessState;
              ctx: Ctx;
              random: { Number: () => number };
              playerID?: string;
            },
            explicitPid?: string,
          ) => randomizeTerrain(game, explicitPid, true),
          randomizeUnits: (
            game: {
              G: TrenchessState;
              ctx: Ctx;
              random: { Number: () => number };
              playerID?: string;
            },
            explicitPid?: string,
          ) => randomizeUnits(game, explicitPid, true),
          setClassicalFormation: (
            game: {
              G: TrenchessState;
              ctx: Ctx;
              random: { Number: () => number };
              playerID?: string;
            },
            explicitPid?: string,
          ) => setClassicalFormation(game, explicitPid, true),
          applyChiGarden: (
            game: {
              G: TrenchessState;
              ctx: Ctx;
              random: { Number: () => number };
              playerID?: string;
            },
            explicitPid?: string,
          ) => applyChiGarden(game, explicitPid, true),
          resetToOmega: (
            game: { G: TrenchessState; ctx: Ctx; playerID?: string },
            explicitPid?: string,
          ) => resetToOmega(game, explicitPid, true),
          resetTerrain: (
            game: { G: TrenchessState; ctx: Ctx; playerID?: string },
            explicitPid?: string,
          ) => resetTerrain(game, explicitPid, true),
          resetUnits: (
            game: { G: TrenchessState; ctx: Ctx; playerID?: string },
            explicitPid?: string,
          ) => resetUnits(game, explicitPid, true),
          forfeit: (
            game: { G: TrenchessState; ctx: Ctx; playerID?: string },
            explicitPid?: string,
          ) => forfeit(game, explicitPid, true),
          mirrorBoard: (
            game: { G: TrenchessState; ctx: Ctx; playerID?: string },
            explicitPid?: string,
          ) => mirrorBoard(game, explicitPid, true),
          syncLayout: (
            game: { G: TrenchessState },
            layout: {
              board: (BoardPiece | null)[][];
              terrain: TerrainType[][];
              inventory: Record<string, PieceType[]>;
              terrainInventory: Record<string, TerrainType[]>;
            },
          ) => {
            game.G.board = layout.board;
            game.G.terrain = layout.terrain;
            game.G.inventory = layout.inventory;
            game.G.terrainInventory = layout.terrainInventory;
          },
          ...CORE_ADMIN_MOVES,
          beginTrenchCraft: ({
            events,
          }: {
            events: { endPhase: () => void };
          }) => {
            events?.endPhase();
          },
        },
      },
    },
  },
};
