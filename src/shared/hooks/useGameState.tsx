import { useState, useMemo } from "react";
import { useGameTheme } from "@hooks/useGameTheme";
import { useMultiplayer } from "@hooks/useMultiplayer";
import { useComputerOpponent } from "@/client/game/shared/hooks/useComputerOpponent";

// Core State Atoms (Fallback/Transient)
import { useBoardState } from "./core/useBoardState";
import { useTurnState } from "./core/useTurnState";
import { useGameConfig } from "./core/useGameConfig";

// Logic Directors & Micro-Artifacts
import { useGameEngine } from "./core/useGameEngine";
import { useGameLifecycle } from "./core/useGameLifecycle";
import { usePlacementManager } from "./core/usePlacementManager";
import { useMoveExecution } from "./core/useMoveExecution";
import { useBoardInteraction } from "./core/useBoardInteraction";
import { useZenGardenInteraction } from "./core/useZenGardenInteraction";
import { useSetupActions } from "./core/useSetupActions";

import type { GameStateHook } from "@/shared/types";

/**
 * useGameState — The Grand Architect's Primary Hook.
 * Orchestrates the boardgame.io engine and provides a unified,
 * single-source-of-truth interface for the entire UI.
 */
export function useGameState(): GameStateHook {
  const theme = useGameTheme();
  const multiplayer = useMultiplayer();

  // 1. Fallback states used before the engine is initialized
  const boardState = useBoardState();
  const turnState = useTurnState();
  const configState = useGameConfig();

  // 2. Transient UI states
  const [isStarted, setIsStarted] = useState(false);

  const {
    board: fallbackBoard,
    terrain: fallbackTerrain,
    inventory: fallbackInventory,
    terrainInventory: fallbackTerrainInventory,
  } = boardState;
  const { mode, showBgDebug } = configState;

  const setupData = useMemo(
    () => ({
      mode,
      board: fallbackBoard,
      terrain: fallbackTerrain,
      inventory: fallbackInventory,
      terrainInventory: fallbackTerrainInventory,
    }),
    [
      mode,
      fallbackBoard,
      fallbackTerrain,
      fallbackInventory,
      fallbackTerrainInventory,
    ],
  );

  // 3. Authoritative Engine Instance
  const { bgioState, clientRef, isEngineActive } = useGameEngine({
    mode,
    showBgDebug,
    multiplayer,
    isStarted,
    setupData,
  });

  // 4. Derive authoritative values from engine (G/ctx)
  const board = isEngineActive ? bgioState!.G.board : fallbackBoard;
  const terrain = isEngineActive ? bgioState!.G.terrain : fallbackTerrain;
  const inventory = isEngineActive ? bgioState!.G.inventory : fallbackInventory;
  const terrainInventory = isEngineActive
    ? bgioState!.G.terrainInventory
    : fallbackTerrainInventory;
  const capturedBy = isEngineActive
    ? bgioState!.G.capturedBy
    : boardState.capturedBy;

  const isOnline = !!multiplayer.roomId;

  const turn =
    isEngineActive && bgioState!.G.playerMap && bgioState!.ctx
      ? isOnline || bgioState!.ctx.phase !== "setup"
        ? bgioState!.G.playerMap[bgioState!.ctx.currentPlayer] || turnState.turn
        : turnState.turn
      : turnState.turn;

  const activePlayers = isEngineActive
    ? bgioState!.G.activePlayers
    : turnState.activePlayers;
  const readyPlayers = isEngineActive
    ? bgioState!.G.readyPlayers
    : turnState.readyPlayers;
  const winner = isEngineActive
    ? (bgioState!.ctx.gameover?.winner ?? null)
    : turnState.winner;

  const gameState = isEngineActive
    ? (bgioState!.ctx.phase as "setup" | "play")
    : isStarted
      ? configState.gameState
      : "menu";

  // 5. Lifecycle Orchestrator
  const core = useGameLifecycle(
    boardState,
    turnState,
    configState,
    board,
    terrain,
  );

  // 6. Action Managers
  const placementManager = usePlacementManager(bgioState, core);
  const moveExecution = useMoveExecution(core, clientRef);

  const playerID = isOnline
    ? multiplayer.playerIndex !== null
      ? String(multiplayer.playerIndex)
      : "0"
    : undefined;

  const boardInteraction = useBoardInteraction(
    bgioState,
    core,
    placementManager,
    moveExecution.executeMove,
    multiplayer,
    clientRef,
    playerID,
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
    clientRef,
    board,
    terrain,
  );

  // 7. AI Integration
  useComputerOpponent({
    gameState,
    turn,
    board,
    terrain,
    mode: isEngineActive ? bgioState!.G.mode : configState.mode,
    playerTypes: core.turnState.playerTypes,
    executeMove: moveExecution.executeMove,
    winner,
    setIsThinking: core.turnState.setIsThinking,
  });

  return {
    ...theme,
    ...boardState,
    ...turnState,
    ...configState,

    // Authority Overrides
    board,
    terrain,
    inventory,
    terrainInventory,
    capturedBy,
    turn,
    activePlayers,
    readyPlayers,
    winner,
    gameState,

    ...core,
    ...placementManager,
    ...moveExecution,
    ...boardInteraction,
    ...zenGardenInteraction,
    ...setupActions,
    bgioState,

    ready: (pid?: string) => {
      if (multiplayer.roomId) {
        if (clientRef.current) clientRef.current.moves.ready();
      } else {
        if (clientRef.current) {
          if (pid) {
            clientRef.current.moves.ready(pid);

            // Auto-switch perspective to the next player who isn't ready
            const nextNonReadyPlayer = activePlayers.find(
              (p) => p !== pid && !readyPlayers[p],
            );
            if (nextNonReadyPlayer) {
              turnState.setTurn(nextNonReadyPlayer);
            }
          } else {
            // Fallback: ready everyone if no PID provided
            activePlayers.forEach((p) => {
              clientRef.current!.moves.ready(p);
            });
          }
        } else {
          // Fallback: update local state if no client exists (pre-engine setup)
          if (pid) {
            turnState.setReadyPlayers((prev) => ({ ...prev, [pid]: true }));

            const nextNonReadyPlayer = activePlayers.find(
              (p) => p !== pid && !readyPlayers[p],
            );
            if (nextNonReadyPlayer) {
              turnState.setTurn(nextNonReadyPlayer);
            }
          } else {
            const allReady: Record<string, boolean> = {};
            activePlayers.forEach((p) => {
              allReady[p] = true;
            });
            turnState.setReadyPlayers(allReady);
          }
        }
      }
    },
    startGame: () => setIsStarted(true),
    multiplayer: {
      ...multiplayer,
      readyPlayers,
      toggleReady: (_isReady: boolean) => {
        if (clientRef.current) clientRef.current.moves.ready();
      },
    },
  };
}
