import { useState, useEffect, useCallback, useMemo } from "react";
import { isPlayerInCheck } from "@/core/mechanics/gameLogic";
import { serializeGame } from "@utils/gameUrl";
import { PLAYER_CONFIGS } from "@constants";
import type {
  BoardPiece,
  TerrainType,
  GameConfigState,
  GameCore,
} from "@/shared/types";
import { useUrlSync } from "../navigation/useUrlSync";

/**
 * useGameLifecycle — UI-side lifecycle management.
 * Handles in-check detection, perspective flipping, and URL synchronization.
 */
export function useGameLifecycle(
  configState: GameConfigState,
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

  const inCheck = useMemo(() => {
    if (gameState !== "play") return false;
    if (!board.length || !terrain.length) return false;
    return isPlayerInCheck(turn, board, terrain, mode);
  }, [gameState, board, terrain, turn, mode]);

  const getPlayerDisplayName = useCallback((pid: string) => {
    return PLAYER_CONFIGS[pid]?.name.toUpperCase() || pid.toUpperCase();
  }, []);

  const isPlayerReady = useCallback(
    (_p: string) => true, // Simplification: actual readiness is in G.readyPlayers
    [],
  );

  const isAllPlaced = false; // Placeholder for UI compatibility

  useEffect(() => {
    if (!autoFlip || gameState !== "play") return;

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
    if (gameState === "play") {
      const params = new URLSearchParams(window.location.search);
      if (!params.has("seed")) publishSeed();
    }
  }, [gameState, publishSeed]);

  const turnState = useMemo(
    () => ({
      playerTypes,
      setPlayerTypes,
      isThinking,
      setIsThinking,
      localPlayerName,
      setLocalPlayerName,
      getPlayerDisplayName,
      inCheck,
    }),
    [playerTypes, isThinking, localPlayerName, getPlayerDisplayName, inCheck],
  );

  return {
    configState,
    turnState,
    isAllPlaced,
    isPlayerReady,
    initFromSeed,
  };
}
