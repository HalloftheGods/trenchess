import { useRef, useEffect, useCallback, useState } from "react";
import { Client } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { Trenchess } from "@/core/Trenchess";
import { createInitialState, getPlayersForMode } from "@/core/setup/setupLogic";
import { getServerUrl } from "./useMultiplayer";
import type { Ctx } from "boardgame.io";
import type { TrenchessState, TrenchessSetupData } from "@/shared/types/game";
import type { BgioClient, GameMode, MultiplayerState } from "@/shared/types";

interface UseGameEngineProps {
  mode: GameMode;
  showBgDebug: boolean;
  multiplayer: MultiplayerState;
  setupData?: TrenchessSetupData;
}

/**
 * useGameEngine — Authoritative engine instance manager.
 * Initializes immediately and persists across the application lifecycle.
 */
export function useGameEngine({
  mode,
  showBgDebug,
  multiplayer,
  setupData,
}: UseGameEngineProps) {
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
    mode?: GameMode;
  }>({});

  const initClient = useCallback(() => {
    const isOnline = !!multiplayer.roomId;
    const playerID = isOnline
      ? multiplayer.playerIndex !== null
        ? String(multiplayer.playerIndex)
        : "0"
      : undefined;

    const clientConfig = {
      game: Trenchess,
      numPlayers: 4, // Always init with 4 to support all modes
      debug: showBgDebug,
      playerID,
      setupData:
        setupData ||
        createInitialState(mode || "4p", getPlayersForMode(mode || "4p")),
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
    Promise.resolve().then(() => setClientInstance(newClient));
    newClient.start();

    lastClientParamsRef.current = {
      playerID,
      roomId: multiplayer.roomId || undefined,
      debug: showBgDebug,
      mode: mode,
    };
  }, [
    mode,
    showBgDebug,
    multiplayer.playerIndex,
    multiplayer.roomId,
    multiplayer.playerCredentials,
    setupData,
  ]);

  // Initial and Re-init logic
  useEffect(() => {
    const isOnline = !!multiplayer.roomId;
    const playerID = isOnline
      ? multiplayer.playerIndex !== null
        ? String(multiplayer.playerIndex)
        : "0"
      : undefined;

    const local = lastClientParamsRef.current;
    const currentRoomId = multiplayer.roomId || undefined;

    const needsReinit =
      !clientRef.current ||
      local.playerID !== playerID ||
      local.roomId !== currentRoomId ||
      local.debug !== showBgDebug ||
      local.mode !== mode;

    if (needsReinit) {
      initClient();
    }
  }, [
    multiplayer.playerIndex,
    multiplayer.roomId,
    showBgDebug,
    mode,
    initClient,
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
