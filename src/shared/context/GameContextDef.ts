import { createContext } from "react";
import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "@tc.types/game";
import type { BgioClient, MultiplayerState, ChatMessage } from "@tc.types";

export interface GameContextValue {
  bgioState: { G: TrenchessState; ctx: Ctx } | null;
  clientRef: React.RefObject<BgioClient | undefined>;
  isEngineActive: boolean;
  isConnected: boolean;
  isOnline: boolean;
  initializeEngine: (
    multiplayer: MultiplayerState,
    showBgDebug: boolean,
  ) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
}

export const GameContext = createContext<GameContextValue | null>(null);
