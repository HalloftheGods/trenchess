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
import type { BgioClient, MultiplayerState, ChatMessage } from "@tc.types";
import { Client as BaseClient } from "boardgame.io/client";

import { useTerminal } from "./TerminalContext";
import { useEngineDerivations, usePlayerRole } from "@/shared/hooks/engine";
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
  const [isConnected, setIsConnected] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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
    const hasWinnerChanged =
      winner && lastLoggedStateRef.current.winner !== winner;

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
        : undefined;

      const currentRoomId = multiplayer.roomId || undefined;
      const local = lastClientParamsRef.current;

      const needsReinit =
        !clientRef.current ||
        local.playerID !== playerID ||
        local.roomId !== currentRoomId ||
        local.debug !== showBgDebug;

      if (!needsReinit) return;

      const clientConfig: Record<string, unknown> = {
        game: Trenchess,
        numPlayers: 4,
        debug: showBgDebug,
      };

      if (playerID !== undefined) {
        clientConfig.playerID = playerID;
      }

      if (isOnline && multiplayer.playerCredentials) {
        setIsOnline(true);
        clientConfig.multiplayer = SocketIO({ server: getServerUrl() });
        clientConfig.matchID = multiplayer.roomId;
        clientConfig.credentials = multiplayer.playerCredentials;
      } else {
        setIsOnline(false);
        setIsConnected(true);
      }

      if (clientRef.current) {
        clientRef.current.stop();
      }

      const newClient = BaseClient(
        clientConfig as unknown as Parameters<typeof BaseClient>[0],
      ) as unknown as BgioClient;
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

    const onStateUpdate = (
      state: { G: TrenchessState; ctx: Ctx; isConnected?: boolean } | null,
    ) => {
      if (!state) return;
      console.log(
        `[ENGINE_UPDATE] Phase: ${state.ctx.phase}. Turn: ${state.ctx.turn}. Mode: ${state.G.mode}. Active Players: ${state.G.activePlayers.length}`,
      );
      if (state.isConnected !== undefined) {
        setIsConnected(state.isConnected);
      }
      if (clientInstance.chatMessages) {
        setChatMessages((prev) => {
          if (clientInstance.chatMessages!.length !== prev.length) {
            return clientInstance.chatMessages!.map(
              (msg: {
                id?: string;
                sender?: string;
                senderId?: string;
                playerIndex?: number;
                payload?: unknown;
                text?: string;
                timestamp?: number;
              }) => {
                const payloadText =
                  typeof msg.payload === "object" && msg.payload !== null
                    ? (msg.payload as { text?: string }).text
                    : typeof msg.payload === "string"
                      ? msg.payload
                      : msg.text || "";

                return {
                  id: msg.id || String(Math.random()),
                  senderId: msg.sender || msg.senderId || "0",
                  playerIndex:
                    msg.playerIndex !== undefined
                      ? msg.playerIndex
                      : Number(msg.sender || 0),
                  text: payloadText || "",
                  timestamp: msg.timestamp || Date.now(),
                };
              },
            );
          }
          return prev;
        });
      }
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

  const sendChatMessage = useCallback(
    (text: string) => {
      if (!isOnline) {
        // Simulate local reflection for offline hotseat since boardgame.io's DummyTransport discards chat
        const id = String(Math.random());
        const sender = lastClientParamsRef.current.playerID || "0";
        setChatMessages((prev) => [
          ...prev,
          {
            id,
            senderId: sender,
            playerIndex: Number(sender),
            text,
            timestamp: Date.now(),
          },
        ]);
        return;
      }

      if (clientInstance && clientInstance.sendChatMessage) {
        if (typeof clientInstance.sendChatMessage === "function") {
          // boardgame.io client.sendChatMessage takes a single `payload` argument.
          clientInstance.sendChatMessage({ text });
        }
      }
    },
    [clientInstance, isOnline],
  );

  const value = useMemo(
    () => ({
      bgioState,
      clientRef,
      isEngineActive: !!bgioState,
      isConnected,
      isOnline,
      initializeEngine,
      chatMessages,
      sendChatMessage,
    }),
    [
      bgioState,
      isConnected,
      isOnline,
      initializeEngine,
      chatMessages,
      sendChatMessage,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
