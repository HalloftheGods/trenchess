import { useMemo, useEffect } from "react";
import { useGameTheme } from "../interface/useGameTheme";
import { useMultiplayer } from "./useMultiplayer";
import { useComputerOpponent } from "../bot/useComputerOpponent";

// Engine-specific logic
import { useGameEngine } from "./useGameEngine";
import { useGameLifecycle } from "./useGameLifecycle";
import { usePlayerRole } from "./usePlayerRole";

// Interaction & Actions (Controls)
import { usePlacementManager } from "../controls/usePlacementManager";
import { useMoveExecution } from "../controls/useMoveExecution";
import { useBoardInteraction } from "../controls/useBoardInteraction";
import { useZenGardenInteraction } from "../controls/useZenGardenInteraction";
import { useSetupActions } from "../controls/useSetupActions";

// Configuration & UI (Interface)
import { useGameConfig } from "../interface/useGameConfig";
import { useTerminal } from "@/shared/context/TerminalContext";
import { useCommandDispatcher } from "../interface/useCommandDispatcher";

import { analytics } from "@/shared/utils/analytics";
import { createInitialState, getPlayersForMode } from "@/core/setup/setupLogic";

import type { GameStateHook, GameState, TrenchessState } from "@/shared/types";

/**
 * useGameState — The Authoritative Game Hook.
 * Now strictly 1-to-1 with boardgame.io state. No more mirroring.
 */
export function useGameState(): GameStateHook {
  const theme = useGameTheme();
  const multiplayer = useMultiplayer();
  const config = useGameConfig();

  const { mode, showBgDebug } = config;

  const playerID = multiplayer.roomId
    ? multiplayer.playerIndex !== null
      ? String(multiplayer.playerIndex)
      : "0"
    : undefined;

  // 1. Authoritative Engine Instance (Always On)
  const { bgioState, clientRef } = useGameEngine({
    mode,
    showBgDebug,
    multiplayer,
  });

  const { addLog } = useTerminal();
  const { currentTurn, localPlayer } = usePlayerRole(bgioState, playerID);

  // Derived Values from Engine (G/ctx)
  const G =
    bgioState?.G ||
    createInitialState(mode || "4p", getPlayersForMode(mode || "4p"));
  const ctx = bgioState?.ctx;

  const board = G.board;
  const terrain = G.terrain;
  const inventory = G.inventory;
  const terrainInventory = G.terrainInventory;
  const capturedBy = G.capturedBy;
  const activePlayers = G.activePlayers;
  const readyPlayers = G.readyPlayers;
  const lastMove = G.lastMove;

  const winner = ctx?.gameover?.winner ?? null;
  const winnerReason = ctx?.gameover?.reason ?? null;
  const gameState = (ctx?.phase as GameState) || "menu";

  // Logging Effects
  useEffect(() => {
    addLog("game", `PHASE CHANGED: ${gameState.toUpperCase()}`);
  }, [gameState, addLog]);

  useEffect(() => {
    if (G.mode) addLog("game", `MODE CHANGED: ${G.mode.toUpperCase()}`);
  }, [G.mode, addLog]);

  useEffect(() => {
    if (currentTurn) addLog("game", `TURN: ${currentTurn.toUpperCase()}`);
  }, [currentTurn, addLog]);

  useEffect(() => {
    if (winner)
      addLog(
        "info",
        `GAME OVER: ${winner.toUpperCase()} WON! (${winnerReason})`,
      );
  }, [winner, winnerReason, addLog]);

  // 2. Lifecycle Orchestrator (Handles UI-only state like player names/types)
  const core = useGameLifecycle(config, board, terrain, currentTurn);

  // 3. Action Managers
  const placementManager = usePlacementManager(bgioState, core);
  const moveExecution = useMoveExecution(
    core,
    clientRef,
    (move: { from: [number, number]; to: [number, number] }) => {
      const attacker = board[move.from[0]]?.[move.from[1]];
      const victim = board[move.to[0]]?.[move.to[1]];

      const moveText = victim
        ? `${attacker?.type.toUpperCase()} CAPTURES ${victim.type.toUpperCase()} AT [${move.to}]`
        : `${attacker?.type.toUpperCase()} MOVES TO [${move.to}]`;

      addLog("game", moveText);

      if (victim)
        analytics.trackEvent(
          "Game",
          "Capture",
          `${attacker?.type} takes ${victim.type}`,
        );
      analytics.trackEvent("Game", "Move", `${attacker?.type} to ${move.to}`);
    },
  );

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
    clientRef,
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

  const { dispatch } = useCommandDispatcher({
    ...theme,
    ...config,
    ...core,
    ...core.turnState,
    ...placementManager,
    ...moveExecution,
    ...boardInteraction,
    ...zenGardenInteraction,
    ...setupActions,
    bgioState,
    board,
    terrain,
    inventory,
    terrainInventory,
    capturedBy,
    turn: currentTurn,
    localPlayerName: localPlayer,
    activePlayers,
    readyPlayers,
    winner,
    winnerReason,
    gameState,
    mode: G.mode,
    lastMove,
    isStarted: true,
    ready: (pid?: string) => {
      if (clientRef.current) clientRef.current.moves.ready(pid);
    },
    startGame: () => {},
    finishGamemaster: () => {
      if (clientRef.current) clientRef.current.moves.finishGamemaster();
    },
    forfeit: (pid?: string) => {
      if (clientRef.current) clientRef.current.moves.forfeit(pid);
    },
    multiplayer: {
      ...multiplayer,
      readyPlayers,
      toggleReady: () => {
        if (clientRef.current) clientRef.current.moves.ready();
      },
    },
  } as unknown as GameStateHook);

  // 4. AI Integration
  useComputerOpponent({
    gameState,
    turn: currentTurn,
    board,
    terrain,
    mode: G.mode,
    playerTypes: core.turnState.playerTypes,
    executeMove: moveExecution.executeMove,
    winner,
    setIsThinking: core.turnState.setIsThinking,
  });

  // 5. Analytics
  useEffect(() => {
    if (gameState === "play")
      analytics.trackEvent("Game", "Start", mode || "unknown");
  }, [gameState, mode]);

  useEffect(() => {
    if (winner)
      analytics.trackEvent("Game", "End", `${winner} won by ${winnerReason}`);
  }, [winner, winnerReason]);

  return useMemo(
    () =>
      ({
        ...theme,
        ...config,
        ...core,
        ...core.turnState,
        ...placementManager,
        ...moveExecution,
        ...boardInteraction,
        ...zenGardenInteraction,
        ...setupActions,
        bgioState,

        // Authority Overrides
        board,
        terrain,
        inventory,
        terrainInventory,
        capturedBy,
        turn: currentTurn,
        localPlayerName: localPlayer,
        activePlayers,
        readyPlayers,
        winner,
        winnerReason,
        gameState,
        setGameState: (phase: string) => {
          if (clientRef.current) clientRef.current.moves.setPhase(phase);
        },
        mode: G.mode,
        lastMove,
        isStarted: true,
        dispatch,

        patchG: (patch: Partial<TrenchessState>) => {
          if (clientRef.current) clientRef.current.moves.patchG(patch);
        },

        ready: (pid?: string) => {
          if (clientRef.current) clientRef.current.moves.ready(pid);
        },
        startGame: () => {},
        finishGamemaster: () => {
          if (clientRef.current) clientRef.current.moves.finishGamemaster();
        },
        setTurn: (pid: string) => {
          if (clientRef.current) clientRef.current.moves.setTurn(pid);
        },
        forfeit: (pid?: string) => {
          if (clientRef.current) clientRef.current.moves.forfeit(pid);
        },
        multiplayer: {
          ...multiplayer,
          readyPlayers,
          toggleReady: () => {
            if (clientRef.current) clientRef.current.moves.ready();
          },
        },
      }) as GameStateHook,
    [
      theme,
      config,
      core,
      placementManager,
      moveExecution,
      boardInteraction,
      zenGardenInteraction,
      setupActions,
      bgioState,
      board,
      terrain,
      inventory,
      terrainInventory,
      capturedBy,
      currentTurn,
      localPlayer,
      activePlayers,
      readyPlayers,
      winner,
      winnerReason,
      gameState,
      lastMove,
      multiplayer,
      clientRef,
      G.mode,
      config.showRules,
      config.setShowRules,
    ],
  );
}
