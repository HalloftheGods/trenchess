import { useRef, useEffect, useCallback, useState } from "react";
import { useGameTheme } from "@hooks/useGameTheme";
import { useMultiplayer, getServerUrl } from "@hooks/useMultiplayer";
import { useComputerOpponent } from "@hooks/useComputerOpponent";

// Core State Atoms
import { useBoardState } from "./core/useBoardState";
import { useTurnState } from "./core/useTurnState";
import { useGameConfig } from "./core/useGameConfig";

// Logic Directors
import { useGameLifecycle } from "./core/useGameLifecycle";
import { usePlacementManager } from "./core/usePlacementManager";
import { useMoveExecution } from "./core/useMoveExecution";
import { useBoardInteraction } from "./core/useBoardInteraction";
import { useZenGardenInteraction } from "./core/useZenGardenInteraction";
import { useSetupActions } from "./core/useSetupActions";
import { useBgioSync } from "./core/useBgioSync";

import { Client } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { TrenchGame } from "@/core/TrenchGame";
import type { TrenchGameState } from "@/types/game";
import { createInitialState, getPlayersForMode } from "@/core/setup/setupLogic";
import type { Ctx } from "boardgame.io";
import type {
  GameStateHook,
  BoardState,
  TurnState,
  GameConfigState,
  GameCore,
  PlacementManager,
  MoveExecution,
  BoardInteraction,
  ZenGardenInteraction,
  SetupActions,
  BgioClient,
  MultiplayerState,
} from "@/types";

export function useGameState(): GameStateHook {
  const theme = useGameTheme();
  const multiplayer = useMultiplayer();

  // 1. Core State
  const boardState = useBoardState();
  const turnState = useTurnState();
  const configState = useGameConfig();

  // 2. BGIO Sync State
  const [bgioState, setBgioState] = useState<{
    G: TrenchGameState;
    ctx: Ctx;
  } | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  // 3. Calculated master values for sync
  const syncedGameState =
    bgioState?.ctx?.phase === "setup"
      ? "setup"
      : bgioState?.ctx?.phase === "play"
        ? "play"
        : isStarted
          ? "setup"
          : "menu";
  const syncedBoard = bgioState?.G?.board ?? boardState.board;
  const syncedTerrain = bgioState?.G?.terrain ?? boardState.terrain;

  // 4. Lifecycle Orchestrator
  const core = useGameLifecycle(
    boardState,
    turnState,
    configState,
    syncedBoard,
    syncedTerrain,
  );

  const clientRef = useRef<BgioClient | undefined>(undefined);
  const lastClientParamsRef = useRef<{
    playerID?: string;
    roomId?: string;
    debug?: boolean;
  }>({});

  const initClient = useCallback(() => {
    const isOnline = !!multiplayer.roomId;
    const numPlayers = core.configState.mode === "4p" ? 4 : 2;

    const playerID = isOnline
      ? multiplayer.playerIndex !== null
        ? String(multiplayer.playerIndex)
        : "0"
      : undefined;

    const clientConfig = {
      game: TrenchGame,
      numPlayers,
      debug: core.configState.showBgDebug,
      playerID,
      setupData: createInitialState(
        core.configState.mode,
        getPlayersForMode(core.configState.mode),
      ),
    } as Parameters<typeof Client>[0];

    if (multiplayer.roomId && multiplayer.playerCredentials) {
      clientConfig.multiplayer = SocketIO({ server: getServerUrl() });
      clientConfig.matchID = multiplayer.roomId;
      clientConfig.credentials = multiplayer.playerCredentials;
    }

    if (clientRef.current) {
      clientRef.current.stop();
    }

    clientRef.current = Client(
      clientConfig,
    ) as unknown as typeof clientRef.current;
    clientRef.current?.start();

    lastClientParamsRef.current = {
      playerID,
      roomId: multiplayer.roomId || undefined,
      debug: core.configState.showBgDebug,
    };
  }, [
    core.configState.mode,
    core.configState.showBgDebug,
    core.boardState.board,
    core.boardState.terrain,
    core.boardState.inventory,
    core.boardState.terrainInventory,
    multiplayer.playerIndex,
    multiplayer.roomId,
    multiplayer.playerCredentials,
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

    if (
      shouldStart &&
      (local.playerID !== playerID ||
        local.roomId !== multiplayer.roomId ||
        local.debug !== core.configState.showBgDebug)
    ) {
      initClient();
    }
  }, [
    multiplayer.playerIndex,
    multiplayer.roomId,
    core.configState.mode, // Added mode to dependencies
    core.configState.showBgDebug,
    initClient,
    isStarted,
  ]);

  // 4. Sync State
  useBgioSync(clientRef, setBgioState);

  // 5. Action Managers
  const placementManager = usePlacementManager(bgioState, core);
  const moveExecution = useMoveExecution(core, clientRef);
  const boardInteraction = useBoardInteraction(
    bgioState,
    core,
    placementManager,
    moveExecution.executeMove,
    multiplayer,
    clientRef,
  );
  const zenGardenInteraction = useZenGardenInteraction(
    bgioState,
    core,
    placementManager,
  );

  const setupActions = useSetupActions(
    core,
    placementManager.setPlacementPiece,
    placementManager.setPlacementTerrain,
    placementManager.setPreviewMoves,
  );

  // 6. Computer Opponent
  const syncedTurn =
    bgioState?.G?.playerMap && bgioState?.ctx
      ? bgioState.G.playerMap[bgioState.ctx.currentPlayer] || turnState.turn
      : turnState.turn;

  useComputerOpponent({
    gameState: syncedGameState,
    turn: syncedTurn,
    board: syncedBoard,
    terrain: syncedTerrain,
    mode: bgioState?.G?.mode ?? configState.mode,
    playerTypes: core.turnState.playerTypes,
    executeMove: moveExecution.executeMove,
    winner: bgioState?.ctx?.gameover?.winner ?? turnState.winner,
    setIsThinking: core.turnState.setIsThinking,
  });

  return {
    ...theme,
    ...boardState,
    ...turnState,
    ...configState,

    // Override getters with engine state if available
    board:
      bgioState?.G?.board ??
      createInitialState(configState.mode, getPlayersForMode(configState.mode))
        .board,
    terrain:
      bgioState?.G?.terrain ??
      createInitialState(configState.mode, getPlayersForMode(configState.mode))
        .terrain,
    inventory:
      bgioState?.G?.inventory ??
      createInitialState(configState.mode, getPlayersForMode(configState.mode))
        .inventory,
    terrainInventory:
      bgioState?.G?.terrainInventory ??
      createInitialState(configState.mode, getPlayersForMode(configState.mode))
        .terrainInventory,
    capturedBy: bgioState?.G?.capturedBy ?? boardState.capturedBy,

    turn:
      bgioState?.G?.playerMap && bgioState?.ctx
        ? bgioState.G.playerMap[bgioState.ctx.currentPlayer] || turnState.turn
        : turnState.turn,
    activePlayers: bgioState?.G?.activePlayers ?? turnState.activePlayers,
    readyPlayers: bgioState?.G?.readyPlayers ?? turnState.readyPlayers,
    winner: bgioState?.ctx?.gameover?.winner ?? turnState.winner,

    gameState:
      bgioState?.ctx?.phase === "setup"
        ? "setup"
        : bgioState?.ctx?.phase === "play"
          ? "play"
          : isStarted
            ? "setup"
            : "menu",

    ...core,
    ...placementManager,
    ...moveExecution,
    ...boardInteraction,
    ...zenGardenInteraction,
    ...setupActions,
    bgioState,
    ready: () => {
      if (multiplayer.roomId) {
        if (clientRef.current) clientRef.current.moves.ready();
      } else {
        if (clientRef.current) {
          core.turnState.activePlayers.forEach((p) => {
            clientRef.current!.moves.ready(p);
          });
        }
      }
    },
    startGame: () => setIsStarted(true),
    multiplayer: {
      ...multiplayer,
      toggleReady: (_isReady: boolean) => {
        if (clientRef.current) clientRef.current.moves.ready();
      },
    },
  };
}
