import { useRef, useEffect, useCallback, useState } from "react";
import { Client } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { Trenchess } from "@/core/Trenchess";
import { createInitialState, getPlayersForMode } from "@/core/setup/setupLogic";
import { getServerUrl } from "@hooks/useMultiplayer";
import { useBgioSync } from "./useBgioSync";
import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "@/shared/types/game";
import type { BgioClient, GameMode, MultiplayerState } from "@/shared/types";

interface UseGameEngineProps {
  mode: GameMode;
  showBgDebug: boolean;
  multiplayer: MultiplayerState;
  isStarted: boolean;
}

/**
 * useGameEngine — Micro-artifact for managing the boardgame.io client lifecycle.
 */
export function useGameEngine({
  mode,
  showBgDebug,
  multiplayer,
  isStarted,
}: UseGameEngineProps) {
  const [bgioState, setBgioState] = useState<{
    G: TrenchessState;
    ctx: Ctx;
  } | null>(null);

  const clientRef = useRef<BgioClient | undefined>(undefined);
  const lastClientParamsRef = useRef<{
    playerID?: string;
    roomId?: string;
    debug?: boolean;
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
      setupData: createInitialState(mode, getPlayersForMode(mode)),
    } as Parameters<typeof Client>[0];

    if (multiplayer.roomId && multiplayer.playerCredentials) {
      clientConfig.multiplayer = SocketIO({ server: getServerUrl() });
      clientConfig.matchID = multiplayer.roomId;
      clientConfig.credentials = multiplayer.playerCredentials;
    }

    if (clientRef.current) {
      clientRef.current.stop();
    }

    clientRef.current = Client(clientConfig) as unknown as BgioClient;
    clientRef.current?.start();

    lastClientParamsRef.current = {
      playerID,
      roomId: multiplayer.roomId || undefined,
      debug: showBgDebug,
    };
  }, [mode, showBgDebug, multiplayer.playerIndex, multiplayer.roomId, multiplayer.playerCredentials]);

  useEffect(() => {
    const isOnline = !!multiplayer.roomId;
    const playerID = isOnline
      ? multiplayer.playerIndex !== null
        ? String(multiplayer.playerIndex)
        : "0"
      : undefined;
    const local = lastClientParamsRef.current;

    const shouldStart = isStarted || !!multiplayer.roomId;

    if (
      shouldStart &&
      (local.playerID !== playerID ||
        local.roomId !== multiplayer.roomId ||
        local.debug !== showBgDebug)
    ) {
      initClient();
    }
  }, [multiplayer.playerIndex, multiplayer.roomId, mode, showBgDebug, initClient, isStarted]);

  useBgioSync(clientRef, setBgioState);

  return {
    bgioState,
    clientRef,
    isEngineActive: !!bgioState,
  };
}
