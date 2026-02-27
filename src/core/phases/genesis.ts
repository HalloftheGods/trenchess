import type { Ctx } from "boardgame.io";
import type { TrenchessState, PieceType, TerrainType } from "@/shared/types";
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
} from "@/core/mechanics/moves";

/**
 * Genesis Phase: The "Creation" stage.
 * Used for initial match configuration and standalone Architect (Zen Garden) mode.
 */
export const genesis = {
  start: true,
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
            game: { G: TrenchessState; ctx: Ctx },
            row: number,
            col: number,
            type: PieceType,
            explicitPid?: string,
          ) => placePiece(game, row, col, type, explicitPid, true),
          placeTerrain: (
            game: { G: TrenchessState; ctx: Ctx },
            row: number,
            col: number,
            type: TerrainType,
            explicitPid?: string,
          ) => placeTerrain(game, row, col, type, explicitPid, true),
          ready: (
            game: { G: TrenchessState; ctx: Ctx },
            explicitPid?: string,
          ) => ready(game, explicitPid, true),
          randomizeTerrain: (
            game: {
              G: TrenchessState;
              ctx: Ctx;
              random: { Number: () => number };
            },
            explicitPid?: string,
          ) => randomizeTerrain(game, explicitPid, true),
          randomizeUnits: (
            game: {
              G: TrenchessState;
              ctx: Ctx;
              random: { Number: () => number };
            },
            explicitPid?: string,
          ) => randomizeUnits(game, explicitPid, true),
          setClassicalFormation: (
            game: {
              G: TrenchessState;
              ctx: Ctx;
              random: { Number: () => number };
            },
            explicitPid?: string,
          ) => setClassicalFormation(game, explicitPid, true),
          applyChiGarden: (
            game: {
              G: TrenchessState;
              ctx: Ctx;
              random: { Number: () => number };
            },
            explicitPid?: string,
          ) => applyChiGarden(game, explicitPid, true),
          resetToOmega: (
            game: { G: TrenchessState; ctx: Ctx },
            explicitPid?: string,
          ) => resetToOmega(game, explicitPid, true),
          resetTerrain: (
            game: { G: TrenchessState; ctx: Ctx },
            explicitPid?: string,
          ) => resetTerrain(game, explicitPid, true),
          resetUnits: (
            game: { G: TrenchessState; ctx: Ctx },
            explicitPid?: string,
          ) => resetUnits(game, explicitPid, true),
          forfeit: (
            game: { G: TrenchessState; ctx: Ctx },
            explicitPid?: string,
          ) => forfeit(game, explicitPid, true),
          mirrorBoard: (
            game: { G: TrenchessState; ctx: Ctx },
            explicitPid?: string,
          ) => mirrorBoard(game, explicitPid, true),
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
