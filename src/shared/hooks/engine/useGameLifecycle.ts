import { useState, useEffect, useCallback } from "react";
import { isPlayerInCheck } from "@/app/core/mechanics";
import { serializeGame } from "@/shared/utilities/gameUrl";
import { PLAYER_CONFIGS } from "@constants";
import type {
  BoardPiece,
  TerrainType,
  GameConfigState,
  GameCore,
  GameMode,
  GameState,
} from "@tc.types";
import { useUrlSync } from "../navigation/useUrlSync";
import { PHASES } from "@constants/game";

/**
 * useGameLifecycle — UI-side lifecycle management.
 * Handles in-check detection, perspective flipping, and URL synchronization.
 */
export function useGameLifecycle(
  configState: GameConfigState & {
    mode: GameMode;
    gameState: GameState;
    setMode: (m: GameMode) => void;
    setGameState: (p: string) => void;
  },
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  turn: string,
): GameCore {
  const { mode, gameState, autoFlip, setIsFlipped, layoutName } = configState;

  // UI-only state (not managed by boardgame.io)
  const [playerTypes, setPlayerTypes] = useState<
    Record<string, "human" | "computer">
  >({
    red: "human",
    yellow: "human",
    green: "human",
    blue: "human",
  });
  const [isThinking, setIsThinking] = useState(false);
  const [localPlayerName, setLocalPlayerName] = useState("");

  // Derived inline for zero-lag synchronization with engine state
  const inCheck =
    gameState === PHASES.COMBAT && board.length && terrain.length
      ? isPlayerInCheck(turn, board, terrain, mode)
      : false;

  const getPlayerDisplayName = useCallback((pid: string) => {
    return PLAYER_CONFIGS[pid]?.name.toUpperCase() || pid.toUpperCase();
  }, []);

  const isPlayerReady = useCallback(
    (_p: string) => true, // Simplification: actual readiness is in G.readyPlayers
    [],
  );

  const isAllPlaced = false; // Placeholder for UI compatibility

  useEffect(() => {
    if (!autoFlip || gameState !== PHASES.COMBAT) return;

    if (mode === "2p-ns") setIsFlipped(turn === "red");
    else if (mode === "2p-ew") setIsFlipped(turn === "green");
    else if (mode === "4p") setIsFlipped(turn === "red" || turn === "yellow");
  }, [autoFlip, gameState, mode, turn, setIsFlipped]);

  const { initFromSeed } = useUrlSync({
    board,
    terrain,
    ...configState,
    setLocalPlayerName,
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
    if (gameState === PHASES.COMBAT) {
      const params = new URLSearchParams(window.location.search);
      if (!params.has("seed")) publishSeed();
    }
  }, [gameState, publishSeed]);

  const turnState = {
    playerTypes,
    setPlayerTypes,
    isThinking,
    setIsThinking,
    localPlayerName,
    setLocalPlayerName,
    getPlayerDisplayName,
    inCheck,
  };

  return {
    configState,
    turnState,
    isAllPlaced,
    isPlayerReady,
    initFromSeed,
    mode,
    gameState,
  };
}
