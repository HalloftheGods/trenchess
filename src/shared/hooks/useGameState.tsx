import { useState } from "react";
import { useGameTheme } from "@hooks/useGameTheme";
import { useMultiplayer } from "@hooks/useMultiplayer";
import { useComputerOpponent } from "@hooks/useComputerOpponent";

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

  // 3. Authoritative Engine Instance
  const { bgioState, clientRef, isEngineActive } = useGameEngine({
    mode: configState.mode,
    showBgDebug: configState.showBgDebug,
    multiplayer,
    isStarted,
  });

  // 4. Derive authoritative values from engine (G/ctx)
  const board = isEngineActive ? bgioState!.G.board : boardState.board;
  const terrain = isEngineActive ? bgioState!.G.terrain : boardState.terrain;
  const inventory = isEngineActive ? bgioState!.G.inventory : boardState.inventory;
  const terrainInventory = isEngineActive ? bgioState!.G.terrainInventory : boardState.terrainInventory;
  const capturedBy = isEngineActive ? bgioState!.G.capturedBy : boardState.capturedBy;

  const turn = isEngineActive && bgioState!.G.playerMap && bgioState!.ctx
    ? bgioState!.G.playerMap[bgioState!.ctx.currentPlayer] || turnState.turn
    : turnState.turn;
    
  const activePlayers = isEngineActive ? bgioState!.G.activePlayers : turnState.activePlayers;
  const readyPlayers = isEngineActive ? bgioState!.G.readyPlayers : turnState.readyPlayers;
  const winner = isEngineActive ? (bgioState!.ctx.gameover?.winner ?? null) : turnState.winner;

  const gameState = isEngineActive
    ? (bgioState!.ctx.phase as "setup" | "play")
    : isStarted ? "setup" : "menu";

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
  
  const isOnline = !!multiplayer.roomId;
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
    
    ready: () => {
      if (multiplayer.roomId) {
        if (clientRef.current) clientRef.current.moves.ready();
      } else {
        if (clientRef.current) {
          activePlayers.forEach((p) => {
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
