import { useRef, useEffect, useCallback, useState } from "react";
import { useGameTheme, type GameTheme } from "@hooks/useGameTheme";
import {
  useMultiplayer,
  getServerUrl,
  type MultiplayerState,
} from "@hooks/useMultiplayer";
import { useComputerOpponent } from "@hooks/useComputerOpponent";

// Core State Atoms
import { useBoardState, type BoardState } from "./core/useBoardState";
import { useTurnState, type TurnState } from "./core/useTurnState";
import { useGameConfig, type GameConfigState } from "./core/useGameConfig";

// Logic Directors
import {
  useGameLifecycle,
  type GameCore,
  type BgioClient,
} from "./core/useGameLifecycle";
import {
  usePlacementManager,
  type PlacementManager,
} from "./core/usePlacementManager";
import { useMoveExecution, type MoveExecution } from "./core/useMoveExecution";
import {
  useBoardInteraction,
  type BoardInteraction,
} from "./core/useBoardInteraction";
import { useSetupActions, type SetupActions } from "./core/useSetupActions";
import { useBgioSync } from "./core/useBgioSync";

import { Client } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { TrenchGame, type TrenchGameState } from "@game/Game";
import type { Ctx } from "boardgame.io";

export interface GameStateHook
  extends
    GameTheme,
    BoardState,
    TurnState,
    GameConfigState,
    GameCore,
    PlacementManager,
    MoveExecution,
    BoardInteraction,
    SetupActions {
  bgioState: { G: TrenchGameState; ctx: Ctx } | null;
  ready: () => void;
  startGame: () => void;
  multiplayer: MultiplayerState;
}

export function useGameState(): GameStateHook {
  const theme = useGameTheme();
  const multiplayer = useMultiplayer();

  // 1. Core State
  const boardState = useBoardState();
  const turnState = useTurnState();
  const configState = useGameConfig();

  // 2. Lifecycle Orchestrator
  const core = useGameLifecycle(boardState, turnState, configState);

  // 3. Client initialization
  const [bgioState, _setBgioState] = useState<{
    G: TrenchGameState;
    ctx: Ctx;
  } | null>(null);
  const clientRef = useRef<BgioClient | undefined>(undefined);
  const lastClientParamsRef = useRef<{
    playerID?: string;
    roomId?: string;
    debug?: boolean;
    gameState?: string;
  }>({});

  const initClient = useCallback(() => {
    const numPlayers = core.configState.mode === "4p" ? 4 : 2;
    const playerID =
      multiplayer.playerIndex !== null ? String(multiplayer.playerIndex) : "0";

    const clientConfig = {
      game: TrenchGame,
      numPlayers,
      debug: core.configState.showBgDebug,
      playerID,
      setupData: {
        mode: core.configState.mode,
        board: core.boardState.board,
        terrain: core.boardState.terrain,
        inventory: core.boardState.inventory,
        terrainInventory: core.boardState.terrainInventory,
      },
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
      gameState: core.configState.gameState,
    };
  }, [
    core.configState.mode,
    core.configState.showBgDebug,
    core.configState.gameState,
    core.boardState.board,
    core.boardState.terrain,
    core.boardState.inventory,
    core.boardState.terrainInventory,
    multiplayer.playerIndex,
    multiplayer.roomId,
    multiplayer.playerCredentials,
  ]);

  useEffect(() => {
    const playerID =
      multiplayer.playerIndex !== null ? String(multiplayer.playerIndex) : "0";
    const local = lastClientParamsRef.current;

    if (
      local.playerID !== playerID ||
      local.roomId !== multiplayer.roomId ||
      local.debug !== core.configState.showBgDebug
    ) {
      initClient();
    }
  }, [
    multiplayer.playerIndex,
    multiplayer.roomId,
    core.configState.showBgDebug,
    initClient,
  ]);

  // 4. Sync State
  useBgioSync(core, clientRef);

  // 5. Action Managers
  const placementManager = usePlacementManager(core);
  const moveExecution = useMoveExecution(core, clientRef);
  const boardInteraction = useBoardInteraction(
    core,
    placementManager,
    moveExecution.executeMove,
    multiplayer,
    clientRef,
  );

  const setupActions = useSetupActions(
    core,
    placementManager.setPlacementPiece,
    placementManager.setPlacementTerrain,
    placementManager.setPreviewMoves,
  );

  // 6. Computer Opponent
  useComputerOpponent({
    gameState: core.configState.gameState,
    turn: core.turnState.turn,
    board: core.boardState.board,
    terrain: core.boardState.terrain,
    mode: core.configState.mode,
    playerTypes: core.turnState.playerTypes,
    executeMove: moveExecution.executeMove,
    winner: core.turnState.winner,
    setIsThinking: core.turnState.setIsThinking,
  });

  return {
    ...theme,
    ...boardState,
    ...turnState,
    ...configState,
    ...core,
    ...placementManager,
    ...moveExecution,
    ...boardInteraction,
    ...setupActions,
    bgioState,
    ready: () => {
      if (multiplayer.roomId) {
        if (clientRef.current) clientRef.current.moves.ready();
      } else {
        configState.setGameState("play");
      }
    },
    startGame: () => configState.setGameState("play"),
    multiplayer: {
      ...multiplayer,
      toggleReady: (_isReady: boolean) => {
        if (clientRef.current) clientRef.current.moves.ready();
      },
    },
  };
}
