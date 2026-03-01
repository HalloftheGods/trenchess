import { useEffect } from "react";
import {
  useGameTheme,
  useGameConfig,
  useCommandDispatcher,
} from "@hooks/interface";
import { useTerminal } from "@shared/context/TerminalContext";
import {
  useMultiplayer,
  useGameLifecycle,
  usePlayerRole,
  useEngineMoves,
  useEngineDerivations,
  useBuilder,
} from "@hooks/engine";
import { useComputerOpponent } from "@hooks/bot";
import { useGameEngineContext } from "@shared/context/useGameEngineContext";
import {
  usePlacementManager,
  useMoveExecution,
  useBoardInteraction,
  useZenGardenInteraction,
  useSetupActions,
} from "@controllers";
import { analytics } from "@/shared/utilities/analytics";
import { PHASES } from "@constants/game";
import type { GameStateHook, PieceType, TerrainType } from "@tc.types";

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
    board: bgioBoard,
    terrain: bgioTerrain,
    inventory: bgioInventory,
    terrainInventory: bgioTerrainInventory,
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

  const builder = useBuilder(
    gameState,
    mode,
    activePlayers,
    !!config.isMercenary,
    multiplayer,
    clientRef,
  );

  const isGenesis = gameState === PHASES.GENESIS;

  const board = isGenesis ? builder.board : bgioBoard;
  const terrain = isGenesis ? builder.terrain : bgioTerrain;
  const inventory = isGenesis ? builder.inventory : bgioInventory;
  const terrainInventory = isGenesis
    ? builder.terrainInventory
    : bgioTerrainInventory;

  const core = useGameLifecycle(
    {
      ...config,
      mode,
      gameState,
      setMode: engineMoves.setMode,
      setGameState: engineMoves.setPhase as (phase: string) => void,
      readyPlayers,
      inventory,
      activePlayers,
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

  const onPlacePiece = isGenesis
    ? (row: number, col: number, type: PieceType | null) =>
        builder.placePiece(row, col, type, localPlayer)
    : undefined;

  const onPlaceTerrain = isGenesis
    ? (row: number, col: number, type: TerrainType) =>
        builder.placeTerrain(row, col, type, localPlayer)
    : undefined;

  const boardInteraction = useBoardInteraction(
    bgioState,
    core,
    placementManager,
    moveExecution.executeMove,
    multiplayer,
    clientRef,
    playerID,
    onPlacePiece,
    onPlaceTerrain,
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

  const overriddenSetupActions = isGenesis
    ? {
        ...setupActions,
        randomizeTerrain: () => builder.randomizeTerrain(activePlayers),
        randomizeUnits: () => builder.randomizeUnits(activePlayers),
        setClassicalFormation: () =>
          builder.setClassicalFormation(activePlayers),
        resetTerrain: () => builder.reset(), // Basic reset for now
        resetUnits: () => builder.reset(),
      }
    : setupActions;

  const gameContext = {
    ...theme,
    ...config,
    ...core,
    ...core.turnState,
    ...placementManager,
    ...moveExecution,
    ...boardInteraction,
    ...zenGardenInteraction,
    ...overriddenSetupActions,
    ...engineMoves,
    ...builder,
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
    isStarted: gameState !== PHASES.MENU,
    startGame: () => engineMoves.setPhase(PHASES.GENESIS),
    multiplayer: {
      ...multiplayer,
      readyPlayers,
      toggleReady: () => {
        if (isGenesis) builder.syncToEngine();
        engineMoves.toggleReady();
      },
    },
    ready: (pid?: string) => {
      if (isGenesis) builder.syncToEngine();
      engineMoves.toggleReady(pid);
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
    if (gameState === PHASES.COMBAT)
      analytics.trackEvent("Game", "Start", activeMode);
    if (winner)
      analytics.trackEvent("Game", "End", `${winner} won: ${winnerReason}`);
  }, [gameState, winner, winnerReason, activeMode]);

  return { ...gameContext, dispatch } as GameStateHook;
}
