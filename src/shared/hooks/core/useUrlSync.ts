import { useCallback, useEffect } from "react";
import { serializeGame, deserializeGame } from "@utils/gameUrl";
import { getPlayerCells } from "@/core/setup/setupLogic";
import { BOARD_SIZE } from "@/shared/constants/core.constants";
import { TERRAIN_TYPES } from "@/core/data/terrainDetails";
import { INITIAL_ARMY } from "@/core/data/unitDetails";
import type {
  GameMode,
  GameState as GameStateType,
  PieceType,
  TerrainType,
  BoardPiece,
} from "@/shared/types/game";

interface UrlSyncDeps {
  mode: GameMode;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  layoutName: string;
  gameState: GameStateType;
  getQuota: (m: GameMode) => number;
  getPlayersForMode: (m: GameMode) => string[];
  setMode: (m: GameMode) => void;
  setBoard: (b: (BoardPiece | null)[][]) => void;
  setTerrain: (t: TerrainType[][]) => void;
  setLayoutName: (n: string) => void;
  setActivePlayers: (ps: string[]) => void;
  setTurn: (p: string) => void;
  setInventory: (inv: Record<string, PieceType[]>) => void;
  setTerrainInventory: (inv: Record<string, TerrainType[]>) => void;
  setReadyPlayers: (r: Record<string, boolean>) => void;
  setCapturedBy: (c: Record<string, BoardPiece[]>) => void;
  setGameState: (s: GameStateType) => void;
  setLocalPlayerName: (n: string) => void;
}

export interface UrlSync {
  initFromSeed: (seed: string, targetState?: GameStateType) => boolean;
  publishSeed: () => void;
  updateUrl: (updates: Record<string, string | null>) => void;
}

export function useUrlSync(deps: UrlSyncDeps): UrlSync {
  const {
    mode,
    board,
    terrain,
    layoutName,
    gameState,
    getQuota,
    getPlayersForMode,
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
  } = deps;

  const publishSeed = useCallback(() => {
    if (typeof window === "undefined") return;
    const seed = serializeGame(mode, board, terrain, layoutName);
    const url = new URL(window.location.href);
    url.searchParams.set("seed", seed);
    window.history.pushState({}, "", url.toString());
  }, [mode, board, terrain, layoutName]);

  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    let changed = false;
    Object.entries(updates).forEach(([key, value]) => {
      const current = url.searchParams.get(key);
      if (value === null) {
        if (url.searchParams.has(key)) {
          url.searchParams.delete(key);
          changed = true;
        }
      } else if (current !== value) {
        url.searchParams.set(key, value);
        changed = true;
      }
    });
    if (changed) window.history.pushState({}, "", url.toString());
  }, []);

  const initFromSeed = useCallback(
    (seed: string, targetState?: GameStateType) => {
      const data = deserializeGame(seed);
      if (!data) return false;

      setMode(data.mode);
      setLocalPlayerName("");
      setBoard(data.board);
      setTerrain(data.terrain);
      if (data.layoutName) setLayoutName(data.layoutName);

      const players = getPlayersForMode(data.mode);
      setActivePlayers(players);
      setTurn(players[0]);

      const newInventory: Record<string, PieceType[]> = {};
      const newTerrainInventory: Record<string, TerrainType[]> = {};
      const quota = getQuota(data.mode);
      let allReady = true;

      players.forEach((p) => {
        const placedUnits: Record<string, number> = {};
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            const piece = data.board[r][c];
            if (piece && piece.player === p) {
              placedUnits[piece.type] = (placedUnits[piece.type] || 0) + 1;
            }
          }
        }
        const missingUnits: PieceType[] = [];
        INITIAL_ARMY.forEach((u) => {
          const missing = u.count - (placedUnits[u.type] || 0);
          for (let i = 0; i < missing; i++) missingUnits.push(u.type);
        });
        newInventory[p] = missingUnits;
        if (missingUnits.length > 0) allReady = false;

        const myCells = getPlayerCells(p, data.mode);
        let terrainCount = 0;
        for (const [r, c] of myCells) {
          if (data.terrain[r][c] !== TERRAIN_TYPES.FLAT) terrainCount++;
        }
        if (terrainCount < quota) {
          allReady = false;
          newTerrainInventory[p] = [
            ...Array(quota).fill(TERRAIN_TYPES.TREES),
            ...Array(quota).fill(TERRAIN_TYPES.PONDS),
            ...Array(quota).fill(TERRAIN_TYPES.RUBBLE),
            ...Array(quota).fill(TERRAIN_TYPES.DESERT),
          ] as TerrainType[];
        } else {
          newTerrainInventory[p] = [];
        }
      });

      setInventory(newInventory);
      setTerrainInventory(newTerrainInventory);
      setReadyPlayers({});
      setCapturedBy({ red: [], yellow: [], green: [], blue: [] });
      setGameState(targetState || (allReady ? "play" : "setup"));
      return true;
    },
    [
      getQuota,
      getPlayersForMode,
      setMode,
      setLocalPlayerName,
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
    ],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const seed = params.get("seed");
    const view = params.get("v");
    if (seed) {
      initFromSeed(seed);
    } else if (
      view &&
      ["how-to-play", "library", "zen-garden"].includes(view)
    ) {
      setGameState(view as GameStateType);
    }
  }, [initFromSeed, setGameState]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const seed = params.get("seed");
      const view = params.get("v");
      if (seed) {
        initFromSeed(seed);
      } else if (
        view &&
        ["how-to-play", "library", "zen-garden"].includes(view)
      ) {
        setGameState(view as GameStateType);
      } else {
        setGameState("menu");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initFromSeed, setGameState]);

  useEffect(() => {
    if (gameState === "play" || gameState === "setup") return;
    if (["how-to-play", "library", "zen-garden"].includes(gameState)) {
      updateUrl({ v: gameState, seed: null });
    } else if (gameState === "menu") {
      updateUrl({ v: null, seed: null });
    }
  }, [gameState, updateUrl]);

  useEffect(() => {
    if (gameState === "play") {
      const params = new URLSearchParams(window.location.search);
      if (!params.has("seed")) publishSeed();
    }
  }, [gameState, publishSeed]);

  return { initFromSeed, publishSeed, updateUrl };
}
