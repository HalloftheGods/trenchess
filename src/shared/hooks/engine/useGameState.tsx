import { useEffect } from "react";
import { useGameTheme } from "../interface/useGameTheme";
import { useMultiplayer } from "./useMultiplayer";
import { useComputerOpponent } from "../bot/useComputerOpponent";
import { useGameEngineContext } from "@/shared/context/useGameEngineContext";
import { useGameLifecycle } from "./useGameLifecycle";
import { usePlayerRole } from "./usePlayerRole";
import { useEngineMoves } from "./useEngineMoves";
import { useEngineDerivations } from "./useEngineDerivations";
import { usePlacementManager } from "../controls/usePlacementManager";
import { useMoveExecution } from "../controls/useMoveExecution";
import { useBoardInteraction } from "../controls/useBoardInteraction";
import { useZenGardenInteraction } from "../controls/useZenGardenInteraction";
import { useSetupActions } from "../controls/useSetupActions";
import { useGameConfig } from "../interface/useGameConfig";
import { useTerminal } from "@/shared/context/TerminalContext";
import { useCommandDispatcher } from "../interface/useCommandDispatcher";
import { analytics } from "@/shared/utils/analytics";
import { PHASES } from "@constants/game";
import type { GameStateHook } from "@/shared/types";

export function useGameState(): GameStateHook {
  const theme = useGameTheme();
  const multiplayer = useMultiplayer();
  const config = useGameConfig();
  const { addLog } = useTerminal();
  const { bgioState, clientRef, initializeEngine } = useGameEngineContext();

  useEffect(() => {
    initializeEngine(multiplayer, config.showBgDebug);
  }, [multiplayer, config.showBgDebug, initializeEngine]);

  const playerID = multiplayer.roomId
    ? String(multiplayer.playerIndex ?? 0)
    : undefined;
  const { currentTurn, localPlayer } = usePlayerRole(bgioState, playerID);
  const derivations = useEngineDerivations(bgioState);
  const engineMoves = useEngineMoves(clientRef);

  const {
    board,
    terrain,
    inventory,
    terrainInventory,
    capturedBy,
    activePlayers,
    readyPlayers,
    lastMove,
    mode,
    winner,
    winnerReason,
    gameState,
    activeMode,
  } = derivations;

  useEffect(() => {
    addLog("game", `PHASE: ${gameState.toUpperCase()}`);
    if (mode) addLog("game", `MODE: ${mode.toUpperCase()}`);
    if (currentTurn) addLog("game", `TURN: ${currentTurn.toUpperCase()}`);
    if (winner)
      addLog(
        "info",
        `GAME OVER: ${winner.toUpperCase()} WON! (${winnerReason})`,
      );
  }, [gameState, mode, currentTurn, winner, winnerReason, addLog]);

  const core = useGameLifecycle(
    {
      ...config,
      mode,
      gameState,
      setMode: engineMoves.setMode,
      setGameState: engineMoves.setPhase as (phase: string) => void,
    },
    board,
    terrain,
    currentTurn,
  );
  const placementManager = usePlacementManager(bgioState, core);

  const handleMoveAnalytics = (move: {
    from: [number, number];
    to: [number, number];
  }) => {
    const attacker = board[move.from[0]]?.[move.from[1]];
    const victim = board[move.to[0]]?.[move.to[1]];
    const moveLog = victim
      ? `${attacker?.type.toUpperCase()} CAPTURES ${victim.type.toUpperCase()} AT [${move.to}]`
      : `${attacker?.type.toUpperCase()} MOVES TO [${move.to}]`;

    addLog("game", moveLog);
    if (victim)
      analytics.trackEvent(
        "Game",
        "Capture",
        `${attacker?.type} takes ${victim.type}`,
      );
    analytics.trackEvent(
      "Game-Move",
      "Move",
      `${attacker?.type} to ${move.to}`,
    );
  };

  const moveExecution = useMoveExecution(core, clientRef, handleMoveAnalytics);
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

  const gameContext = {
    ...theme,
    ...config,
    ...core,
    ...core.turnState,
    ...placementManager,
    ...moveExecution,
    ...boardInteraction,
    ...zenGardenInteraction,
    ...setupActions,
    ...engineMoves,
    setPhase: engineMoves.setPhase,
    setGameState: engineMoves.setPhase,
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
    mode,
    activeMode,
    lastMove,
    isStarted: true,
    startGame: () => {},
    multiplayer: {
      ...multiplayer,
      readyPlayers,
      toggleReady: engineMoves.toggleReady,
    },
  } as unknown as GameStateHook;

  const { dispatch } = useCommandDispatcher(gameContext);

  useComputerOpponent({
    gameState,
    turn: currentTurn,
    board,
    terrain,
    mode,
    playerTypes: core.turnState.playerTypes,
    executeMove: moveExecution.executeMove,
    winner,
    setIsThinking: core.turnState.setIsThinking,
  });

  useEffect(() => {
    if (gameState === PHASES.COMBAT) analytics.trackEvent("Game", "Start", activeMode);
    if (winner)
      analytics.trackEvent("Game", "End", `${winner} won: ${winnerReason}`);
  }, [gameState, winner, winnerReason, activeMode]);

  return { ...gameContext, dispatch } as GameStateHook;
}
