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
} from "@/core/moves";
import type { TrenchessState } from "@/shared/types/game";

export const setupPhase = {
  next: "play",
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
        },
      },
    },
  },
  endIf: ({ G }: { G: TrenchessState }) => {
    return G.activePlayers.every((p: string) => G.readyPlayers[p]);
  },
};
