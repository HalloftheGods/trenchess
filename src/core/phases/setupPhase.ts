import {
  placePiece,
  placeTerrain,
  ready,
  randomizeTerrain,
  randomizeUnits,
  setClassicalFormation,
  applyChiGarden,
  resetToOmega,
} from "@/core/moves";
import type { TrenchessState } from "@/shared/types/game";

export const setupPhase = {
  start: true,
  next: "play",
  turn: {
    activePlayers: { all: "setup" },
  },
  moves: {
    placePiece,
    placeTerrain,
    ready,
    randomizeTerrain,
    randomizeUnits,
    setClassicalFormation,
    applyChiGarden,
    resetToOmega,
  },
  endIf: ({ G }: { G: TrenchessState }) => {
    return G.activePlayers.every((p: string) => G.readyPlayers[p]);
  },
};
