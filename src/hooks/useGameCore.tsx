import { useState, useEffect, useCallback } from "react";
import { isPlayerInCheck, hasAnyValidMoves } from "../utils/gameLogic";
import { serializeGame, deserializeGame } from "../utils/gameUrl";
import type {
  GameMode,
  GameState as GameStateType,
  SetupMode,
  PieceType,
  TerrainType,
  BoardPiece,
} from "../types";
import {
  PLAYER_CONFIGS,
  INITIAL_ARMY,
  TERRAIN_TYPES,
  BOARD_SIZE,
  MAX_TERRAIN_PER_PLAYER,
} from "../constants";
import { getPlayerCells } from "../utils/setupLogic";

const getPlayersForMode = (m: GameMode) =>
  m === "2p-ns"
    ? ["player1", "player4"]
    : m === "2p-ew"
      ? ["player3", "player2"]
      : ["player1", "player2", "player3", "player4"];

export function useGameCore() {
  const [mode, setMode] = useState<GameMode>("2p-ns");
  const [gameState, setGameState] = useState<GameStateType>("menu");
  const [turn, setTurn] = useState("player1");
  const [setupMode, setSetupMode] = useState<SetupMode>("terrain");
  const [board, setBoard] = useState<(BoardPiece | null)[][]>([]);
  const [terrain, setTerrain] = useState<TerrainType[][]>([]);

  // Inventory logic is also core state
  const [inventory, setInventory] = useState<Record<string, PieceType[]>>({});
  const [terrainInventory, setTerrainInventory] = useState<
    Record<string, TerrainType[]>
  >({});

  const [winner, setWinner] = useState<string | null>(null);
  const [activePlayers, setActivePlayers] = useState(["player1", "player2"]);
  const [capturedBy, setCapturedBy] = useState<Record<string, BoardPiece[]>>({
    player1: [],
    player2: [],
    player3: [],
    player4: [],
  });

  const [inCheck, setInCheck] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [layoutName, setLayoutName] = useState("Zen Garden Layout");
  const [playerTypes, setPlayerTypes] = useState<
    Record<string, "human" | "computer">
  >({
    player1: "human",
    player2: "human",
    player3: "human",
    player4: "human",
  });

  const getPlayerDisplayName = useCallback(
    (pid: string) => {
      if (mode === "2p-ns") {
        if (pid === "player1") return "NORTH";
        if (pid === "player4") return "SOUTH";
      }
      if (mode === "2p-ew") {
        if (pid === "player3") return "WEST";
        if (pid === "player2") return "EAST";
      }
      return PLAYER_CONFIGS[pid]?.name || pid;
    },
    [mode],
  );

  const isAllPlaced = activePlayers.every((p) => {
    // 0. Safety check
    if (!terrain || terrain.length === 0) return false;

    // 1. Check Units (Inventory must be empty)
    const unitsPlaced = (inventory[p] || []).length === 0;

    // 2. Check Terrain (Must reach max placement)
    const maxTerrain =
      activePlayers.length === 2
        ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
        : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
    const myCells = getPlayerCells(p, mode);
    let terrainCount = 0;
    for (const [r, c] of myCells) {
      if (terrain[r][c] !== TERRAIN_TYPES.FLAT) terrainCount++;
    }
    const terrainPlaced = terrainCount >= maxTerrain;

    return unitsPlaced && terrainPlaced;
  });

  // --- Turn Logic: Check & Skip ---
  useEffect(() => {
    if (gameState !== "play") return;
    if (!board.length || !terrain.length) return;

    // Check if current player is in check
    const isCheck = isPlayerInCheck(turn, board, terrain, mode);
    setInCheck(isCheck);

    // Check if current player has moves
    const hasMoves = hasAnyValidMoves(turn, board, terrain, mode);

    if (!hasMoves) {
      // FROZEN: Skip Turn
      const nextIdx = (activePlayers.indexOf(turn) + 1) % activePlayers.length;
      const timer = setTimeout(() => {
        setTurn(activePlayers[nextIdx]);
      }, 1000); // 1s delay to "feel" the skip
      return () => clearTimeout(timer);
    }

    // Auto-flip logic
    if (autoFlip) {
      if (mode === "2p-ns") {
        setIsFlipped(turn === "player1");
      } else if (mode === "2p-ew") {
        setIsFlipped(turn === "player3");
      } else if (mode === "4p") {
        setIsFlipped(turn === "player1" || turn === "player2");
      }
    }
  }, [turn, gameState, board, terrain, mode, activePlayers, autoFlip]);

  // --- Seed Link Logic ---
  const publishSeed = useCallback(() => {
    if (typeof window === "undefined") return;
    const seed = serializeGame(mode, board, terrain, layoutName);
    const url = new URL(window.location.href);
    url.searchParams.set("seed", seed);
    window.history.pushState({}, "", url);
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

    if (changed) {
      window.history.pushState({}, "", url.toString());
    }
  }, []);

  // 1. Core Initialization from Seed
  const initFromSeed = useCallback(
    (seed: string, targetState?: GameStateType) => {
      const data = deserializeGame(seed);
      if (data) {
        setMode(data.mode);
        const loadedBoard = data.board;
        setBoard(loadedBoard);
        const loadedTerrain = data.terrain;
        setTerrain(loadedTerrain);
        if (data.layoutName) setLayoutName(data.layoutName);

        const players = getPlayersForMode(data.mode);
        setActivePlayers(players);
        setTurn(players[0]);

        // --- Calculate Inventory & Validation ---
        const newInventory: Record<string, PieceType[]> = {};
        const newTerrainInventory: Record<string, TerrainType[]> = {};
        const handSize = players.length === 2 ? 24 : 12;
        const maxTerrain =
          players.length === 2
            ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
            : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

        let allReady = true;

        players.forEach((p) => {
          // A. Restore Unit Inventory
          const placedUnits: Record<string, number> = {};
          // Count units on board for this player
          for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
              const piece = loadedBoard[r][c];
              if (piece && piece.player === p) {
                placedUnits[piece.type] = (placedUnits[piece.type] || 0) + 1;
              }
            }
          }

          const missingUnits: PieceType[] = [];
          INITIAL_ARMY.forEach((u) => {
            const count = placedUnits[u.type] || 0;
            const missing = u.count - count;
            if (missing > 0) {
              for (let i = 0; i < missing; i++) missingUnits.push(u.type);
            }
          });
          newInventory[p] = missingUnits;
          if (missingUnits.length > 0) allReady = false;

          // B. Restore Terrain Inventory
          const myCells = getPlayerCells(p, data.mode);
          let terrainCount = 0;
          for (const [r, c] of myCells) {
            if (loadedTerrain[r][c] !== TERRAIN_TYPES.FLAT) terrainCount++;
          }

          if (terrainCount < maxTerrain) allReady = false;

          // Fill invalid/remaining terrain slots with random content so they can finish setup
          const cardsNeeded = handSize - terrainCount;
          const newTerrainCards: TerrainType[] = [];

          if (cardsNeeded > 0) {
            const types = [
              TERRAIN_TYPES.TREES,
              TERRAIN_TYPES.PONDS,
              TERRAIN_TYPES.RUBBLE,
              TERRAIN_TYPES.DESERT,
            ];
            for (let i = 0; i < cardsNeeded; i++) {
              newTerrainCards.push(
                types[Math.floor(Math.random() * types.length)],
              );
            }
          }
          newTerrainInventory[p] = newTerrainCards;
        });

        setInventory(newInventory);
        setTerrainInventory(newTerrainInventory);
        setCapturedBy({
          player1: [],
          player2: [],
          player3: [],
          player4: [],
        });

        // If everything is placed, start playing. Otherwise, go to setup.
        // If targetState is provided (e.g. 'zen-garden'), use it instead of auto-logic.
        setGameState(targetState || (allReady ? "play" : "setup"));
        return true;
      }
      return false;
    },
    [],
  );

  // 1. On Mount: Check for seed/view
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
  }, [initFromSeed]);

  // 2. Handle Back/Forward Navigation
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
  }, [initFromSeed]);

  // 3. Sync State to URL
  useEffect(() => {
    if (gameState === "play" || gameState === "setup") return;

    if (["how-to-play", "library", "zen-garden"].includes(gameState)) {
      updateUrl({ v: gameState, seed: null });
    } else if (gameState === "menu") {
      updateUrl({ v: null, seed: null });
    }
  }, [gameState, updateUrl]);

  // 4. Publish Seed on Game Start
  useEffect(() => {
    if (gameState === "play") {
      const params = new URLSearchParams(window.location.search);
      if (!params.has("seed")) {
        publishSeed();
      }
    }
  }, [gameState, publishSeed]);

  return {
    mode,
    setMode,
    gameState,
    setGameState,
    turn,
    setTurn,
    setupMode,
    setSetupMode,
    board,
    setBoard,
    terrain,
    setTerrain,
    inventory,
    setInventory,
    terrainInventory,
    setTerrainInventory,
    winner,
    setWinner,
    activePlayers,
    setActivePlayers,
    capturedBy,
    setCapturedBy,
    inCheck,
    isFlipped,
    setIsFlipped,
    autoFlip,
    setAutoFlip,
    getPlayerDisplayName,
    getPlayersForMode, // Helper needed for initialization
    isAllPlaced,
    layoutName,
    setLayoutName,
    initFromSeed,
    playerTypes,
    setPlayerTypes,
  };
}
