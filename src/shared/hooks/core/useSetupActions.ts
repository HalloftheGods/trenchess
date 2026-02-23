import { useCallback } from "react";
import * as SetupLogic from "@/core/setup/setupLogic";
import type {
  GameMode,
  TerrainType,
  BoardPiece,
  PieceType,
} from "@/core/types/game";
import { INITIAL_ARMY } from "@/core/configs/unitDetails";
import { TERRAIN_TYPES } from "@/core/configs/terrainDetails";
import { deserializeGame, adaptSeedToMode } from "@utils/gameUrl";
import type { GameCore } from "./useGameLifecycle";

export interface SetupActions {
  initGame: (selectedMode: GameMode) => void;
  initGameWithPreset: (
    selectedMode: GameMode,
    preset: string | null,
    newPlayerTypes?: Record<string, "human" | "computer">,
    seed?: string,
  ) => void;
  randomizeTerrain: () => void;
  generateElementalTerrain: () => void;
  randomizeUnits: () => void;
  setClassicalFormation: () => void;
  mirrorBoard: () => void;
  resetTerrain: () => void;
  resetUnits: () => void;
}

export function useSetupActions(
  core: GameCore,
  setPlacementPiece: React.Dispatch<React.SetStateAction<PieceType | null>>,
  setPlacementTerrain: React.Dispatch<React.SetStateAction<TerrainType | null>>,
  setPreviewMoves: React.Dispatch<React.SetStateAction<number[][]>>,
): SetupActions {
  const { boardState, configState, turnState } = core;
  const {
    board,
    terrain,
    inventory,
    terrainInventory,
    setBoard,
    setTerrain,
    setInventory,
    setTerrainInventory,
    setCapturedBy,
  } = boardState;
  const { mode, setMode, setGameState } = configState;
  const { turn, setTurn, setActivePlayers, setPlayerTypes } = turnState;

  const initGame = useCallback(
    (selectedMode: GameMode) => {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("seed");
        window.history.pushState({}, "", url.toString());
      }
      const players = SetupLogic.getPlayersForMode(selectedMode);
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
      setCapturedBy({ red: [], yellow: [], green: [], blue: [] });
    },
    [
      setActivePlayers,
      setBoard,
      setCapturedBy,
      setGameState,
      setInventory,
      setMode,
      setPlacementPiece,
      setPlacementTerrain,
      setTerrain,
      setTerrainInventory,
      setTurn,
    ],
  );

  const initGameWithPreset = useCallback(
    (
      selectedMode: GameMode,
      preset: string | null,
      newPlayerTypes?: Record<string, "human" | "computer">,
      seed?: string,
    ) => {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("seed");
        window.history.pushState({}, "", url.toString());
      }
      const players = SetupLogic.getPlayersForMode(selectedMode);
      if (newPlayerTypes)
        setPlayerTypes((prev: Record<string, "human" | "computer">) => ({
          ...prev,
          ...newPlayerTypes,
        }));
      else
        setPlayerTypes({
          red: "human",
          yellow: "human",
          green: "human",
          blue: "human",
        });

      const state = SetupLogic.createInitialState(selectedMode, players);

      if (preset === "quick") {
        const tr = SetupLogic.randomizeTerrain(
          state.terrain,
          state.board,
          state.terrainInventory,
          players,
          selectedMode,
        );
        state.terrain = tr.terrain;
        state.terrainInventory = tr.terrainInventory;
        const ur = SetupLogic.randomizeUnits(
          state.board,
          state.terrain,
          state.inventory,
          players,
          selectedMode,
        );
        state.board = ur.board;
        state.inventory = ur.inventory;
        setGameState("play");
      } else if (preset === "classic") {
        const tr = SetupLogic.generateElementalTerrain(
          state.terrain,
          state.board,
          state.terrainInventory,
          players,
          selectedMode,
        );
        state.terrain = tr.terrain;
        state.terrainInventory = tr.terrainInventory;
        const fr = SetupLogic.applyClassicalFormation(
          state.board,
          state.terrain,
          state.inventory,
          state.terrainInventory,
          players,
          selectedMode,
        );
        state.board = fr.board;
        state.terrain = fr.terrain;
        state.inventory = fr.inventory;
        state.terrainInventory = fr.terrainInventory;
        setGameState("play");
      } else if (preset === "terrainiffic") {
        const tr = SetupLogic.randomizeTerrain(
          state.terrain,
          state.board,
          state.terrainInventory,
          players,
          selectedMode,
        );
        state.terrain = tr.terrain;
        state.terrainInventory = tr.terrainInventory;
        setGameState("setup");
        if (seed) {
          const sd = deserializeGame(seed);
          if (sd) {
            const adapted = adaptSeedToMode(sd, selectedMode);
            if (adapted.terrain) state.terrain = adapted.terrain;
            if (adapted.board) state.board = adapted.board;
          }
        }
      } else if (preset === "zen-garden") {
        state.terrain = state.terrain.map((row) =>
          row.map(() => TERRAIN_TYPES.FLAT as TerrainType),
        );
        state.board = state.board.map((row) => row.map(() => null));
        state.terrainInventory = {};
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
      setCapturedBy({ red: [], yellow: [], green: [], blue: [] });
    },
    [
      setActivePlayers,
      setBoard,
      setCapturedBy,
      setGameState,
      setInventory,
      setMode,
      setPlacementPiece,
      setPlacementTerrain,
      setPlayerTypes,
      setTerrain,
      setTerrainInventory,
      setTurn,
    ],
  );

  const randomizeTerrain = useCallback(() => {
    if (configState.gameState !== "setup") return;
    const result = SetupLogic.randomizeTerrain(
      terrain,
      board,
      terrainInventory,
      [turn],
      mode,
    );
    setTerrain(result.terrain);
    setTerrainInventory(result.terrainInventory);
    setPlacementTerrain(null);
  }, [
    board,
    configState.gameState,
    mode,
    setPlacementTerrain,
    setTerrain,
    setTerrainInventory,
    terrain,
    terrainInventory,
    turn,
  ]);

  const generateElementalTerrain = useCallback(() => {
    if (configState.gameState !== "setup") return;
    const result = SetupLogic.generateElementalTerrain(
      terrain,
      board,
      terrainInventory,
      [turn],
      mode,
    );
    setTerrain(result.terrain);
    setTerrainInventory(result.terrainInventory);
    setPlacementTerrain(null);
  }, [
    board,
    configState.gameState,
    mode,
    setPlacementTerrain,
    setTerrain,
    setTerrainInventory,
    terrain,
    terrainInventory,
    turn,
  ]);

  const randomizeUnits = useCallback(() => {
    if (configState.gameState !== "setup") return;
    const result = SetupLogic.randomizeUnits(
      board,
      terrain,
      inventory,
      [turn],
      mode,
    );
    setBoard(result.board);
    setInventory(result.inventory);
    setPlacementPiece(null);
    setPreviewMoves([]);
  }, [
    board,
    configState.gameState,
    inventory,
    mode,
    setBoard,
    setInventory,
    setPlacementPiece,
    setPreviewMoves,
    terrain,
    turn,
  ]);

  const setClassicalFormation = useCallback(() => {
    if (configState.gameState !== "setup") return;
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
    configState.gameState,
    inventory,
    mode,
    setBoard,
    setInventory,
    setPlacementPiece,
    setPreviewMoves,
    setTerrain,
    setTerrainInventory,
    terrain,
    terrainInventory,
    turn,
  ]);

  const mirrorBoard = useCallback(() => {
    const source = turn;
    let target = "";
    if (mode === "2p-ns") target = source === "red" ? "blue" : "red";
    else if (mode === "2p-ew") target = source === "green" ? "yellow" : "green";
    else {
      if (source === "red") target = "blue";
      else if (source === "blue") target = "red";
      else if (source === "yellow") target = "green";
      else if (source === "green") target = "yellow";
    }
    if (!target) return;

    const nextBoard = board.map((row) => [...row]);
    const nextTerrain = terrain.map((row) => [...row]);
    const sourceCells = SetupLogic.getPlayerCells(source, mode);
    const targetCells = SetupLogic.getPlayerCells(target, mode);

    for (const [r, c] of targetCells) {
      nextBoard[r][c] = null;
      nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
    }

    for (const [r, c] of sourceCells) {
      const piece = board[r][c];
      const terr = terrain[r][c];
      const tr = 11 - r;
      const tc = 11 - c;
      if (tr >= 0 && tr < 12 && tc >= 0 && tc < 12) {
        nextTerrain[tr][tc] = terr;
        if (piece) nextBoard[tr][tc] = { ...piece, player: target };
      }
    }

    const updateInventoryForPlayer = (
      p: string,
      currentBoard: (BoardPiece | null)[][],
    ) => {
      const placedUnits: Record<string, number> = {};
      for (let r = 0; r < 12; r++) {
        for (let c = 0; c < 12; c++) {
          const piece = currentBoard[r][c];
          if (piece && piece.player === p)
            placedUnits[piece.type] = (placedUnits[piece.type] || 0) + 1;
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
    const newInventory = { ...inventory };
    newInventory[source] = updateInventoryForPlayer(source, nextBoard);
    newInventory[target] = updateInventoryForPlayer(target, nextBoard);
    setInventory(newInventory);
  }, [
    board,
    inventory,
    mode,
    setBoard,
    setInventory,
    setTerrain,
    terrain,
    turn,
  ]);

  const resetTerrain = useCallback(() => {
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
    mode,
    setPlacementTerrain,
    setTerrain,
    setTerrainInventory,
    terrain,
    terrainInventory,
    turn,
  ]);

  const resetUnits = useCallback(() => {
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
  }, [board, inventory, mode, setBoard, setInventory, setPlacementPiece, turn]);

  return {
    initGame,
    initGameWithPreset,
    randomizeTerrain,
    generateElementalTerrain,
    randomizeUnits,
    setClassicalFormation,
    mirrorBoard,
    resetTerrain,
    resetUnits,
  };
}
