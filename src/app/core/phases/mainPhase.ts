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
  authorizeMasterProtocol,
  CORE_ADMIN_MOVES,
} from "@mechanics/moves";
import { mainPhaseEndIf } from "@engine/events";
import { PHASES } from "@constants/game";

/**
 * Main Phase: The "Trench Craft" stage.
 * Players strategically deploy units and terrain within their territories.
 */
export const mainPhase = {
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
          authorizeMasterProtocol,
          ...CORE_ADMIN_MOVES,
        },
      },
    },
  },
  endIf: mainPhaseEndIf,
};
