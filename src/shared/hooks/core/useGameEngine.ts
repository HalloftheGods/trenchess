import { useRef, useEffect, useCallback, useState } from "react";
import { Client } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { Trenchess } from "@/core/Trenchess";
import { createInitialState, getPlayersForMode } from "@/core/setup/setupLogic";
import { getServerUrl } from "@hooks/useMultiplayer";
import type { Ctx } from "boardgame.io";
import type { TrenchessState, TrenchessSetupData } from "@/shared/types/game";
import type { BgioClient, GameMode, MultiplayerState } from "@/shared/types";

interface UseGameEngineProps {
  mode: GameMode;
  showBgDebug: boolean;
  multiplayer: MultiplayerState;
  isStarted: boolean;
  setupData?: TrenchessSetupData;
}

/**
 * useGameEngine — Micro-artifact for managing the boardgame.io client lifecycle.
 */
export function useGameEngine({
  mode,
  showBgDebug,
  multiplayer,
  isStarted,
  setupData,
}: UseGameEngineProps) {
  const [bgioState, setBgioState] = useState<{
    G: TrenchessState;
    ctx: Ctx;
  } | null>(null);

  // We keep a ref for immediate access in moves, but also state to trigger effects
  const clientRef = useRef<BgioClient | undefined>(undefined);
  const [clientInstance, setClientInstance] = useState<BgioClient | null>(null);

  const lastClientParamsRef = useRef<{
    playerID?: string;
    roomId?: string;
    debug?: boolean;
    setupData?: TrenchessSetupData;
  }>({});

  const initClient = useCallback(() => {
    const isOnline = !!multiplayer.roomId;
    const numPlayers = mode === "4p" ? 4 : 2;

    const playerID = isOnline
      ? multiplayer.playerIndex !== null
        ? String(multiplayer.playerIndex)
        : "0"
      : undefined;

    const clientConfig = {
      game: Trenchess,
      numPlayers,
      debug: showBgDebug,
      playerID,
      setupData: setupData || createInitialState(mode, getPlayersForMode(mode)),
    } as unknown as Parameters<typeof Client>[0];

    if (multiplayer.roomId && multiplayer.playerCredentials) {
      clientConfig.multiplayer = SocketIO({ server: getServerUrl() });
      clientConfig.matchID = multiplayer.roomId;
      clientConfig.credentials = multiplayer.playerCredentials;
    }

    if (clientRef.current) {
      clientRef.current.stop();
    }

    const newClient = Client(clientConfig) as unknown as BgioClient;
    clientRef.current = newClient;
    setClientInstance(newClient);
    newClient.start();

    lastClientParamsRef.current = {
      playerID,
      roomId: multiplayer.roomId || undefined,
      debug: showBgDebug,
      setupData,
    };
  }, [
    mode,
    showBgDebug,
    multiplayer.playerIndex,
    multiplayer.roomId,
    multiplayer.playerCredentials,
    setupData,
  ]);

  useEffect(() => {
    const isOnline = !!multiplayer.roomId;
    const playerID = isOnline
      ? multiplayer.playerIndex !== null
        ? String(multiplayer.playerIndex)
        : "0"
      : undefined;
    const local = lastClientParamsRef.current;

    const shouldStart = isStarted || !!multiplayer.roomId;

    const currentRoomId = multiplayer.roomId || undefined;

    const hasClient = !!clientRef.current;
    const hasPlayerChanged = local.playerID !== playerID;
    const hasRoomChanged = local.roomId !== currentRoomId;
    const hasDebugChanged = local.debug !== showBgDebug;
    const hasSetupDataChanged = JSON.stringify(local.setupData) !== JSON.stringify(setupData);

    const needsReinit =
      !hasClient ||
      hasPlayerChanged ||
      hasRoomChanged ||
      hasDebugChanged ||
      hasSetupDataChanged;

    if (shouldStart && needsReinit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      initClient();
    }
  }, [
    multiplayer.playerIndex,
    multiplayer.roomId,
    mode,
    showBgDebug,
    initClient,
    isStarted,
    setupData,
  ]);

  const lastBgioStateRef = useRef<string>("");

  // Authorization: Unified Sync Logic
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

  // Authorization: Final Cleanup
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.stop();
      }
    };
  }, []);

  return {
    bgioState,
    clientRef,
    isEngineActive: !!bgioState,
  };
}
