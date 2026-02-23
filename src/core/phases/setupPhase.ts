import { placePiece, placeTerrain, ready } from "@/core/moves";
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
  },
  endIf: ({ G }: { G: TrenchessState }) => {
    return G.activePlayers.every((p: string) => G.readyPlayers[p]);
  },
};
