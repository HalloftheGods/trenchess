import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Trenchess } from "@/core/Trenchess";
import { getServerUrl } from "@/shared/utils/env";

import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "@/shared/types/game";
import type { BgioClient, MultiplayerState } from "@/shared/types";
import { Client as BaseClient } from "boardgame.io/client";

import { GameContext } from "./GameContextDef";

interface GameProviderProps {
  children: React.ReactNode;
}

/**
 * GameProvider — The absolute source of truth and anchor for the Engine.
 * It mounts once and holds the boardgame.io Client instance persistently.
 */
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [bgioState, setBgioState] = useState<{
    G: TrenchessState;
    ctx: Ctx;
  } | null>(null);
  const clientRef = useRef<BgioClient | undefined>(undefined);
  const [clientInstance, setClientInstance] = useState<BgioClient | null>(null);

  const lastClientParamsRef = useRef<{
    playerID?: string;
    roomId?: string;
    debug?: boolean;
  }>({});

  const initializeEngine = useCallback(
    (multiplayer: MultiplayerState, showBgDebug: boolean) => {
      const isOnline = !!multiplayer.roomId;
      const playerID = isOnline
        ? multiplayer.playerIndex !== null
          ? String(multiplayer.playerIndex)
          : "0"
        : "0";

      const currentRoomId = multiplayer.roomId || undefined;
      const local = lastClientParamsRef.current;

      const needsReinit =
        !clientRef.current ||
        local.playerID !== playerID ||
        local.roomId !== currentRoomId ||
        local.debug !== showBgDebug;

      if (!needsReinit) return;

      // We only inject 4p on the FIRST creation. The state will immediately sync to whatever the remote room or local storage dictates.
      const clientConfig = {
        game: Trenchess,
        numPlayers: 4,
        debug: showBgDebug,
        playerID,
      } as unknown as Parameters<typeof BaseClient>[0];

      if (multiplayer.roomId && multiplayer.playerCredentials) {
        clientConfig.multiplayer = SocketIO({ server: getServerUrl() });
        clientConfig.matchID = multiplayer.roomId;
        clientConfig.credentials = multiplayer.playerCredentials;
      }

      if (clientRef.current) {
        clientRef.current.stop();
      }

      const newClient = BaseClient(clientConfig) as unknown as BgioClient;
      clientRef.current = newClient;

      Promise.resolve().then(() => setClientInstance(newClient));
      newClient.start();

      lastClientParamsRef.current = {
        playerID,
        roomId: currentRoomId,
        debug: showBgDebug,
      };
    },
    [],
  );

  const lastBgioStateRef = useRef<string>("");

  useEffect(() => {
    const isClientAvailable = !!clientInstance;
    if (!isClientAvailable) return;

    const onStateUpdate = (state: { G: TrenchessState; ctx: Ctx } | null) => {
      if (!state) return;
      const stringified = JSON.stringify({ G: state.G, ctx: state.ctx });
      if (stringified !== lastBgioStateRef.current) {
        lastBgioStateRef.current = stringified;
        setBgioState(state);
      }
    };

    const unsubscribe = clientInstance!.subscribe(onStateUpdate);
    return unsubscribe;
  }, [clientInstance]);

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.stop();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      bgioState,
      clientRef,
      isEngineActive: !!bgioState,
      initializeEngine,
    }),
    [bgioState, initializeEngine],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
