import { useCallback, useEffect } from "react";
import { serializeGame, deserializeGame } from "@/shared/utilities/gameUrl";
import { useUrlState } from "./useUrlState";
import { PHASES } from "@constants/game";
import type {
  GameMode,
  GameState as GameStateType,
  TerrainType,
  BoardPiece,
} from "@tc.types/game";

interface UrlSyncDeps {
  mode: GameMode;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  layoutName: string;
  gameState: GameStateType;
  setMode: (m: GameMode) => void;
  setLayoutName: (n: string) => void;
  setGameState: (s: GameStateType) => void;
  setLocalPlayerName: (n: string) => void;
}

export interface UrlSync {
  initFromSeed: (seed: string, targetState?: GameStateType) => boolean;
  publishSeed: () => void;
}

/**
 * useUrlSync — Synchronizes game state with URL parameters.
 */
export function useUrlSync(deps: UrlSyncDeps): UrlSync {
  const {
    mode,
    board,
    terrain,
    layoutName,
    gameState,
    setMode,
    setLayoutName,
    setGameState,
    setLocalPlayerName,
  } = deps;

  const { seed: urlSeed, view: urlView, updateParams } = useUrlState();

  const publishSeed = useCallback(() => {
    const seed = serializeGame(mode, board, terrain, layoutName);
    updateParams({ seed });
  }, [mode, board, terrain, layoutName, updateParams]);

  const initFromSeed = useCallback(
    (seed: string, targetState?: GameStateType) => {
      const data = deserializeGame(seed);
      if (!data) return false;

      setMode(data.mode);
      setLocalPlayerName("");
      if (data.layoutName) setLayoutName(data.layoutName);
      setGameState(targetState || PHASES.MAIN);
      return true;
    },
    [setMode, setLocalPlayerName, setLayoutName, setGameState],
  );

  // Sync from URL on Mount
  useEffect(() => {
    if (urlSeed) {
      initFromSeed(urlSeed);
    } else if (
      urlView &&
      (
        [PHASES.HOW_TO_PLAY, PHASES.LIBRARY, PHASES.ZEN_GARDEN] as string[]
      ).includes(urlView as string)
    ) {
      setGameState(urlView as GameStateType);
    }
  }, [urlSeed, urlView, initFromSeed, setGameState]);

  // Sync to URL from State
  useEffect(() => {
    if (
      gameState === PHASES.COMBAT ||
      gameState === PHASES.MAIN ||
      gameState === PHASES.GENESIS
    )
      return;
    if (
      (
        [PHASES.HOW_TO_PLAY, PHASES.LIBRARY, PHASES.ZEN_GARDEN] as string[]
      ).includes(gameState as string)
    ) {
      updateParams({ v: gameState, seed: null });
    } else if (gameState === PHASES.MENU) {
      updateParams({ v: null, seed: null });
    }
  }, [gameState, updateParams]);

  useEffect(() => {
    if (gameState === PHASES.COMBAT) {
      if (!urlSeed) publishSeed();
    }
  }, [gameState, urlSeed, publishSeed]);

  return { initFromSeed, publishSeed };
}
