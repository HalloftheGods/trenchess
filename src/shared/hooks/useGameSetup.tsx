import { useCallback } from "react";
import * as SetupLogic from "@setup/setupLogic";
import type { useGameCore } from "@hooks/useGameCore";
import type { useGameInteraction } from "@hooks/useGameInteraction";
import type {
  GameMode,
  TerrainType,
  BoardPiece,
  PieceType,
} from "@engineTypes/game";
import { INITIAL_ARMY } from "@engineConfigs/unitDetails";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import { deserializeGame, adaptSeedToMode } from "@utils/gameUrl";

type GameCore = ReturnType<typeof useGameCore>;
type GameInteraction = ReturnType<typeof useGameInteraction>;

export function useGameSetup(
  core: GameCore,
  interaction: GameInteraction,
  bgioClient?: any,
) {
  const {
    gameState,
    mode,
    setMode,
    setBoard,
    setTerrain,
    setInventory,
    setTerrainInventory,
    setActivePlayers,
    setTurn,
    setGameState,
    setCapturedBy,
    turn,
    inventory,
    terrainInventory,
    board,
    terrain,
  } = core;

  const { setPlacementPiece, setPlacementTerrain, setPreviewMoves } =
    interaction;

  // --- Initialize Game ---
  const initGame = (selectedMode: GameMode) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("seed");
      window.history.pushState({}, "", url.toString());
    }
    const players = core.getPlayersForMode(selectedMode); // Helper from core

    const state = SetupLogic.createInitialState(selectedMode, players);

    setBoard(state.board);
    setTerrain(state.terrain);
    setInventory(state.inventory);
    setTerrainInventory(state.terrainInventory);
    setActivePlayers(players);
    setTurn(players[0]);
    setMode(selectedMode);
    setGameState("setup");
    setPlacementPiece(null);
    setPlacementTerrain(null);
    setCapturedBy({
      player1: [],
      player2: [],
      player3: [],
      player4: [],
    });
  };

  const initGameWithPreset = (
    selectedMode: GameMode,
    preset: "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden",
    playerTypes?: Record<string, "human" | "computer">, // Optional config
    seed?: string,
  ) => {
    // 1. Initial State
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("seed");
      window.history.pushState({}, "", url.toString());
    }
    const players = core.getPlayersForMode(selectedMode);

    // Apply Player Config if provided, otherwise default to human
    if (playerTypes) {
      // Ensure we only set for active players? Or just set all?
      // Set all is safer for switching modes later if we supported that.
      core.setPlayerTypes((prev) => ({ ...prev, ...playerTypes }));
    } else {
      // Reset to all human if not specified (or keep previous? Reset is safer for "New Game")
      core.setPlayerTypes({
        player1: "human",
        player2: "human",
        player3: "human",
        player4: "human",
      });
    }

    const state = SetupLogic.createInitialState(selectedMode, players);

    // 2. Apply Presets
    if (preset === "quick") {
      const terrainResult = SetupLogic.randomizeTerrain(
        state.terrain,
        state.board,
        state.terrainInventory,
        players, // All players
        selectedMode,
      );
      state.terrain = terrainResult.terrain;
      state.terrainInventory = terrainResult.terrainInventory;

      const unitResult = SetupLogic.randomizeUnits(
        state.board,
        state.terrain,
        state.inventory,
        players, // All players
        selectedMode,
      );
      state.board = unitResult.board;
      state.inventory = unitResult.inventory;

      setGameState("play");
    } else if (preset === "classic") {
      // Classic: Random Terrain + Classical Formation
      const terrainResult = SetupLogic.generateElementalTerrain(
        state.terrain,
        state.board,
        state.terrainInventory,
        players,
        selectedMode,
      );
      state.terrain = terrainResult.terrain;
      state.terrainInventory = terrainResult.terrainInventory;

      const formationResult = SetupLogic.applyClassicalFormation(
        state.board,
        state.terrain,
        state.inventory,
        state.terrainInventory,
        players,
        selectedMode,
      );
      state.board = formationResult.board;
      state.terrain = formationResult.terrain; // Formation might clear incompatible terrain
      state.inventory = formationResult.inventory;
      state.terrainInventory = formationResult.terrainInventory;

      setGameState("play");
    } else if (preset === "terrainiffic") {
      // Terrainiffic: Random Terrain, Manual Units
      const terrainResult = SetupLogic.randomizeTerrain(
        state.terrain,
        state.board,
        state.terrainInventory,
        players,
        selectedMode,
      );
      state.terrain = terrainResult.terrain;
      state.terrainInventory = terrainResult.terrainInventory;
      setGameState("setup");

      // Override with seed if provided
      if (seed) {
        const seedData = deserializeGame(seed);
        if (seedData) {
          // Adapt seed to current selected mode (e.g. rotate if needed)
          const adapted = adaptSeedToMode(seedData, selectedMode);

          if (adapted.terrain) state.terrain = adapted.terrain;
          // We might want to set board too if the seed has units (e.g. from Zen)
          // But Terrainiffic is usually just terrain.
          // If the seed has a board, we should probably respect it?
          // The "Chi" mode previews show units, so yes.
          if (adapted.board) state.board = adapted.board;
        }
      }
    } else if (preset === "zen-garden") {
      // Zen Garden: Clean slate, Editor Mode
      state.terrain = state.terrain.map((row) =>
        row.map(() => TERRAIN_TYPES.FLAT as TerrainType),
      );
      state.board = state.board.map((row) => row.map(() => null));
      // state.inventory = {}; // Infinite inventory in editor

      state.terrainInventory = {}; // Infinite terrain
      setGameState("zen-garden");
    } else {
      setGameState("setup");
    }

    setBoard(state.board);
    setTerrain(state.terrain);
    setInventory(state.inventory);
    setTerrainInventory(state.terrainInventory);
    setActivePlayers(players);
    setTurn(players[0]);
    setMode(selectedMode);
    setPlacementPiece(null);
    setPlacementTerrain(null);
    setCapturedBy({
      player1: [],
      player2: [],
      player3: [],
      player4: [],
    });
  };

  // --- Action Wrappers ---
  const randomizeTerrain = useCallback(() => {
    if (gameState !== "setup") return;
    const result = SetupLogic.randomizeTerrain(
      terrain,
      board,
      terrainInventory,
      [turn], // Only current player
      mode,
    );
    setTerrain(result.terrain);
    setTerrainInventory(result.terrainInventory);
    setPlacementTerrain(null);
  }, [
    terrain,
    board,
    terrainInventory,
    turn,
    mode,
    gameState,
    setTerrain,
    setTerrainInventory,
    setPlacementTerrain,
  ]);

  const generateElementalTerrain = useCallback(() => {
    if (gameState !== "setup") return;
    const result = SetupLogic.generateElementalTerrain(
      terrain,
      board,
      terrainInventory,
      [turn], // Only current player
      mode,
    );
    setTerrain(result.terrain);
    setTerrainInventory(result.terrainInventory);
    setPlacementTerrain(null);
  }, [
    terrain,
    board,
    terrainInventory,
    turn,
    mode,
    gameState,
    setTerrain,
    setTerrainInventory,
    setPlacementTerrain,
  ]);

  const randomizeUnits = useCallback(() => {
    if (gameState !== "setup") return;
    const result = SetupLogic.randomizeUnits(
      board,
      terrain,
      inventory,
      [turn], // Only current player
      mode,
    );
    setBoard(result.board);
    setInventory(result.inventory);
    setPlacementPiece(null);
    setPreviewMoves([]);
  }, [
    board,
    terrain,
    inventory,
    turn,
    mode,
    gameState,
    setBoard,
    setInventory,
    setPlacementPiece,
    setPreviewMoves,
  ]);

  const setClassicalFormation = useCallback(() => {
    if (gameState !== "setup") return;
    const result = SetupLogic.applyClassicalFormation(
      board,
      terrain,
      inventory,
      terrainInventory,
      [turn],
      mode,
    );
    setBoard(result.board);
    setTerrain(result.terrain);
    setInventory(result.inventory);
    setTerrainInventory(result.terrainInventory);
    setPlacementPiece(null);
    setPreviewMoves([]);
  }, [
    board,
    terrain,
    inventory,
    terrainInventory,
    turn,
    mode,
    gameState,
    setBoard,
    setTerrain,
    setInventory,
    setTerrainInventory,
    setPlacementPiece,
    setPreviewMoves,
  ]);

  const mirrorBoard = useCallback(() => {
    // 1. Identify source and target players
    const source = turn;
    let target = "";

    if (mode === "2p-ns") {
      target = source === "player1" ? "player4" : "player1";
    } else if (mode === "2p-ew") {
      target = source === "player3" ? "player2" : "player3";
    } else {
      // 4p: Diagonal mirror
      if (source === "player1") target = "player4";
      else if (source === "player4") target = "player1";
      else if (source === "player2") target = "player3";
      else if (source === "player3") target = "player2";
    }

    if (!target) return;

    const nextBoard = board.map((row) => [...row]);
    const nextTerrain = terrain.map((row) => [...row]);

    // 2. Identify source and target cells
    const sourceCells = SetupLogic.getPlayerCells(source, mode);
    const targetCells = SetupLogic.getPlayerCells(target, mode);

    // 3. Clear target territory
    for (const [r, c] of targetCells) {
      nextBoard[r][c] = null;
      nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
    }

    // 4. Copy and transform (180 degree rotation)
    for (const [r, c] of sourceCells) {
      const piece = board[r][c];
      const terr = terrain[r][c];

      const tr = 11 - r;
      const tc = 11 - c;

      if (tr >= 0 && tr < 12 && tc >= 0 && tc < 12) {
        nextTerrain[tr][tc] = terr;
        if (piece) {
          nextBoard[tr][tc] = { ...piece, player: target };
        }
      }
    }

    // 5. Update inventories
    const updateInventoryForPlayer = (
      p: string,
      currentBoard: (BoardPiece | null)[][],
    ) => {
      const placedUnits: Record<string, number> = {};
      for (let r = 0; r < 12; r++) {
        for (let c = 0; c < 12; c++) {
          const piece = currentBoard[r][c];
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
      return missingUnits;
    };

    setBoard(nextBoard);
    setTerrain(nextTerrain);

    // Update inventories for ALL players to be safe, but especially target
    const newInventory = { ...inventory };
    newInventory[source] = updateInventoryForPlayer(source, nextBoard);
    newInventory[target] = updateInventoryForPlayer(target, nextBoard);
    setInventory(newInventory);
  }, [
    board,
    terrain,
    turn,
    mode,
    setBoard,
    setTerrain,
    setInventory,
    inventory,
  ]);

  return {
    initGame,
    initGameWithPreset,
    randomizeTerrain,
    generateElementalTerrain,
    randomizeUnits,
    setClassicalFormation,
    mirrorBoard,
    resetTerrain: useCallback(() => {
      const nextTerrain = terrain.map((row) => [...row]);
      const nextTInv = { ...terrainInventory };
      const myCells = SetupLogic.getPlayerCells(turn, mode);
      const reclaimed: TerrainType[] = [];

      for (const [r, c] of myCells) {
        if (nextTerrain[r][c] !== TERRAIN_TYPES.FLAT) {
          reclaimed.push(nextTerrain[r][c]);
          nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
        }
      }

      nextTInv[turn] = [...(nextTInv[turn] || []), ...reclaimed];
      setTerrain(nextTerrain);
      setTerrainInventory(nextTInv);
      setPlacementTerrain(null);
    }, [
      terrain,
      terrainInventory,
      turn,
      mode,
      setTerrain,
      setTerrainInventory,
      setPlacementTerrain,
    ]),
    resetUnits: useCallback(() => {
      const nextBoard = board.map((row) => [...row]);
      const nextInv = { ...inventory };
      const myCells = SetupLogic.getPlayerCells(turn, mode);
      const reclaimed: PieceType[] = [];

      for (const [r, c] of myCells) {
        if (nextBoard[r][c] && nextBoard[r][c]?.player === turn) {
          reclaimed.push(nextBoard[r][c]!.type);
          nextBoard[r][c] = null;
        }
      }

      nextInv[turn] = [...(inventory[turn] || []), ...reclaimed];
      setBoard(nextBoard);
      setInventory(nextInv);
      setPlacementPiece(null);
    }, [
      board,
      inventory,
      turn,
      mode,
      setBoard,
      setInventory,
      setPlacementPiece,
    ]),

    // boardgame.io helpers
    ready: useCallback(() => {
      if (bgioClient) {
        bgioClient.moves.ready();
      }
    }, [bgioClient]),
  };
}
