import { useEffect, useCallback } from "react";
import { isPlayerInCheck, hasAnyValidMoves } from "@logic/gameLogic";
import { serializeGame } from "@utils/gameUrl";
import type { GameState } from "@engineTypes/game";
import type { TrenchGameState } from "@game/Game";
import type { Ctx } from "boardgame.io";
import {
  getPlayersForMode,
  getQuota,
  isPlayerReadyToPlay,
} from "@setup/logic/coreHelpers";
import type { BoardState } from "./useBoardState";
import type { TurnState } from "./useTurnState";
import type { GameConfigState } from "./useGameConfig";
import { useUrlSync } from "./useUrlSync";

export interface BgioClient {
  moves: Record<string, (...args: unknown[]) => void>;
  stop: () => void;
  start: () => void;
  subscribe: (
    cb: (state: { G: TrenchGameState; ctx: Ctx } | null) => void,
  ) => () => void;
  playerID: string | null;
  matchID: string | null;
}

export interface GameCore {
  boardState: BoardState;
  turnState: TurnState;
  configState: GameConfigState;
  isAllPlaced: boolean;
  isPlayerReady: (p: string) => boolean;
  initFromSeed: (seed: string, targetState?: GameState) => boolean;
}

export function useGameLifecycle(
  boardState: BoardState,
  turnState: TurnState,
  configState: GameConfigState,
): GameCore {
  const {
    board,
    terrain,
    inventory,
    setBoard,
    setTerrain,
    setInventory,
    setTerrainInventory,
    setCapturedBy,
  } = boardState;
  const {
    turn,
    setTurn,
    activePlayers,
    setActivePlayers,
    setInCheck,
    setLocalPlayerName,
    setReadyPlayers,
  } = turnState;
  const {
    mode,
    setMode,
    gameState,
    autoFlip,
    setIsFlipped,
    layoutName,
    setLayoutName,
    setGameState,
  } = configState;

  const isPlayerReady = useCallback(
    (p: string) => isPlayerReadyToPlay(p, mode, terrain, inventory),
    [inventory, terrain, mode],
  );

  const isAllPlaced =
    activePlayers.length > 0 && activePlayers.every((p) => isPlayerReady(p));

  // Turn Logic: Check & Skip & Auto-flip
  useEffect(() => {
    if (gameState !== "play") return;
    if (!board.length || !terrain.length) return;

    const isCheck = isPlayerInCheck(turn, board, terrain, mode);
    setInCheck(isCheck);

    const hasMoves = hasAnyValidMoves(turn, board, terrain, mode);
    if (!hasMoves) {
      const anyPlayerHasMoves = activePlayers.some((p) =>
        hasAnyValidMoves(p, board, terrain, mode),
      );
      if (!anyPlayerHasMoves) return;

      const nextIdx = (activePlayers.indexOf(turn) + 1) % activePlayers.length;
      const timer = setTimeout(() => setTurn(activePlayers[nextIdx]), 1000);
      return () => clearTimeout(timer);
    }

    if (autoFlip) {
      if (mode === "2p-ns") setIsFlipped(turn === "red");
      else if (mode === "2p-ew") setIsFlipped(turn === "green");
      else if (mode === "4p") setIsFlipped(turn === "red" || turn === "yellow");
    }
  }, [
    turn,
    gameState,
    board,
    terrain,
    mode,
    activePlayers,
    autoFlip,
    setTurn,
    setInCheck,
    setIsFlipped,
  ]);

  const { initFromSeed } = useUrlSync({
    mode,
    board,
    terrain,
    layoutName,
    gameState,
    getQuota,
    setMode,
    setBoard,
    setTerrain,
    setLayoutName,
    setActivePlayers,
    setTurn,
    setInventory,
    setTerrainInventory,
    setReadyPlayers,
    setCapturedBy,
    setGameState,
    setLocalPlayerName,
    getPlayersForMode,
  });

  // Publish Seed on Game Start
  const publishSeed = useCallback(() => {
    if (typeof window === "undefined") return;
    const seed = serializeGame(mode, board, terrain, layoutName);
    const url = new URL(window.location.href);
    url.searchParams.set("seed", seed);
    window.history.pushState({}, "", url.toString());
  }, [mode, board, terrain, layoutName]);

  useEffect(() => {
    if (gameState === "play") {
      const params = new URLSearchParams(window.location.search);
      if (!params.has("seed")) publishSeed();
    }
  }, [gameState, publishSeed]);

  return {
    boardState,
    turnState,
    configState,
    isAllPlaced,
    isPlayerReady,
    initFromSeed,
  };
}
