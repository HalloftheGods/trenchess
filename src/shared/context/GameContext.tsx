import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Trenchess } from "@/app/core/Trenchess";
import { getServerUrl } from "@/shared/utilities/env";

import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "@tc.types/game";
import type { BgioClient, MultiplayerState } from "@tc.types";
import { Client as BaseClient } from "boardgame.io/client";

import { useTerminal } from "./TerminalContext";
import {
  useEngineDerivations,
  usePlayerRole,
} from "@/shared/hooks/engine";
import { GameContext } from "./GameContextDef";

interface GameProviderProps {
  children: React.ReactNode;
}

/**
 * GameProvider — The absolute source of truth and anchor for the Engine.
 * It mounts once and holds the boardgame.io Client instance persistently.
 */
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { addLog } = useTerminal();
  const [bgioState, setBgioState] = useState<{
    G: TrenchessState;
    ctx: Ctx;
  } | null>(null);

  const derivations = useEngineDerivations(bgioState);
  const { currentTurn } = usePlayerRole(bgioState);

  const { gameState, mode, winner, winnerReason } = derivations;

  const lastLoggedStateRef = useRef({
    phase: "",
    mode: "",
    turn: "",
    winner: null as string | null,
  });

  useEffect(() => {
    if (!bgioState) return;

    const hasPhaseChanged = lastLoggedStateRef.current.phase !== gameState;
    const hasModeChanged = mode && lastLoggedStateRef.current.mode !== mode;
    const hasTurnChanged =
      currentTurn && lastLoggedStateRef.current.turn !== currentTurn;
    const hasWinnerChanged = winner && lastLoggedStateRef.current.winner !== winner;

    if (hasPhaseChanged) {
      addLog("game", `PHASE: ${gameState.toUpperCase()}`);
      lastLoggedStateRef.current.phase = gameState;
    }

    if (hasModeChanged) {
      addLog("game", `MODE: ${mode.toUpperCase()}`);
      lastLoggedStateRef.current.mode = mode;
    }

    if (hasTurnChanged) {
      addLog("game", `TURN: ${currentTurn.toUpperCase()}`);
      lastLoggedStateRef.current.turn = currentTurn;
    }

    if (hasWinnerChanged) {
      addLog(
        "info",
        `GAME OVER: ${winner.toUpperCase()} WON! (${winnerReason})`,
      );
      lastLoggedStateRef.current.winner = winner;
    }
  }, [bgioState, gameState, mode, currentTurn, winner, winnerReason, addLog]);

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
      console.log(`[ENGINE_UPDATE] Phase: ${state.ctx.phase}. Turn: ${state.ctx.turn}. Mode: ${state.G.mode}. Active Players: ${state.G.activePlayers.length}`);
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
