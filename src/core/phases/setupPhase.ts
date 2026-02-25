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
} from "@/core/moves";
import type { TrenchessState } from "@/shared/types/game";

export const setupPhase = {
  next: "play",
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
        },
      },
    },
  },
  endIf: ({ G }: { G: TrenchessState }) => {
    return G.activePlayers.every((p: string) => G.readyPlayers[p]);
  },
};
