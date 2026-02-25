import { useEffect, useCallback } from "react";
import { isPlayerInCheck } from "@/core/mechanics/gameLogic";
import { serializeGame } from "@utils/gameUrl";
import type {
  BoardPiece,
  TerrainType,
  BoardState,
  TurnState,
  GameConfigState,
  GameCore,
} from "@/shared/types";
import {
  getQuota,
  isPlayerReadyToPlay,
} from "@/core/setup/coreHelpers";
import { getPlayersForMode } from "@/core/setup/territory";
import { useUrlSync } from "./useUrlSync";

export function useGameLifecycle(
  boardState: BoardState,
  turnState: TurnState,
  configState: GameConfigState,
  syncedBoard: (BoardPiece | null)[][],
  syncedTerrain: TerrainType[][],
): GameCore {
  const {
    board: _localBoard,
    terrain: _localTerrain,
    inventory,
    setBoard,
    setTerrain,
    setInventory,
    setTerrainInventory,
    setCapturedBy,
  } = boardState;

  // Use synced values for internal logic
  const board = syncedBoard;
  const terrain = syncedTerrain;

  const {
    turn,
    setTurn,
    activePlayers,
    setActivePlayers,
    setInCheck,
    setLocalPlayerName,
    readyPlayers,
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

  // Derived state for placement (requires explicit ready-up from all players)
  const isAllPlaced =
    activePlayers.length > 0 && activePlayers.every((p) => readyPlayers[p]);

  // In-Check and Auto-flip (UI only)
  useEffect(() => {
    if (gameState !== "play") return;
    if (!board.length || !terrain.length) return;

    const isCheck = isPlayerInCheck(turn, board, terrain, mode);
    setInCheck(isCheck);

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
    autoFlip,
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
