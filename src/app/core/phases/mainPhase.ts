import type {
  TrenchessState,
  BoardPiece,
  PieceType,
  TerrainType,
} from "@tc.types";
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
  CORE_ADMIN_MOVES,
} from "@mechanics/moves";
import { mainPhaseEndIf } from "@engine/events";
import { PHASES } from "@constants/game";

/**
 * Main Phase: The "Trench Craft" stage.
 * Players strategically deploy units and terrain within their territories.
 */
export const mainPhase = {
  onBegin: ({ G }: { G: TrenchessState }) => {
    console.log(
      `[PHASE_START] Main Phase starting. Mode: ${G.mode}. Active Players: ${G.activePlayers.join(", ")}`,
    );
  },
  next: PHASES.COMBAT,
  moves: {
    ...CORE_ADMIN_MOVES,
  },
  turn: {
    activePlayers: { all: "setup" },
    stages: {
      setup: {
        moves: {
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
        },
      },
    },
  },
  endIf: mainPhaseEndIf,
};
