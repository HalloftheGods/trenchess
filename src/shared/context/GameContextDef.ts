import { createContext } from "react";
import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "@tc.types/game";
import type { BgioClient, MultiplayerState } from "@tc.types";

export interface GameContextValue {
  bgioState: { G: TrenchessState; ctx: Ctx } | null;
  clientRef: React.RefObject<BgioClient | undefined>;
  isEngineActive: boolean;
  initializeEngine: (
    multiplayer: MultiplayerState,
    showBgDebug: boolean,
  ) => void;
}

export const GameContext = createContext<GameContextValue | null>(null);
