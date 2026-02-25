import { useCallback } from "react";
import * as SetupLogic from "@/core/setup";
import type {
  SetupActions,
  GameCore,
  GameMode,
  TerrainType,
  BoardPiece,
  PieceType,
  BgioClient,
} from "@/shared/types";
import { INITIAL_ARMY } from "@/constants";
import { DEFAULT_SEEDS } from "@/core/setup/seeds";
import { deserializeGame, adaptSeedToMode } from "@utils/gameUrl";

/**
 * useSetupActions — Hook for managing pre-game setup maneuvers.
 * Refactored to support both local fallback state and authoritative engine moves.
 */
export function useSetupActions(
  core: GameCore,
  setPlacementPiece: React.Dispatch<React.SetStateAction<PieceType | null>>,
  setPlacementTerrain: React.Dispatch<React.SetStateAction<TerrainType | null>>,
  setPreviewMoves: React.Dispatch<React.SetStateAction<number[][]>>,
  bgioClientRef?: React.MutableRefObject<BgioClient | undefined>,
  authoritativeBoard?: (BoardPiece | null)[][],
  authoritativeTerrain?: TerrainType[][],
): SetupActions {
  const { boardState, configState, turnState } = core;
  const {
    inventory,
    terrainInventory,
    setBoard,
    setTerrain,
    setInventory,
    setTerrainInventory,
    setCapturedBy,
  } = boardState;
  const { mode, setMode, setGameState } = configState;
  const { turn, setActivePlayers, setPlayerTypes } = turnState;

  // Source of truth for local calculations (fallback to boardState if no authoritative data)
  const currentBoard = authoritativeBoard || boardState.board;
  const currentTerrain = authoritativeTerrain || boardState.terrain;

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
      turnState.setTurn(players[0]);
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
      turnState,
    ],
  );

  const initGameWithPreset = useCallback(
    (
      selectedMode: GameMode,
      preset: string | null,
      newPlayerTypes?: Record<string, "human" | "computer">,
      seed?: string,
    ) => {
      const isBrowser = typeof window !== "undefined";
      if (isBrowser) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("seed");
        window.history.pushState({}, "", currentUrl.toString());
      }

      const activePlayersForMatch = SetupLogic.getPlayersForMode(selectedMode);

      if (newPlayerTypes) {
        setPlayerTypes(
          (currentTypes: Record<string, "human" | "computer">) => ({
            ...currentTypes,
            ...newPlayerTypes,
          }),
        );
      } else {
        setPlayerTypes({
          red: "human",
          yellow: "human",
          green: "human",
          blue: "human",
        });
      }

      const matchState = SetupLogic.createInitialState(
        selectedMode,
        activePlayersForMatch,
      );

      const isAlphaMode = preset === "quick";
      const isPiMode = preset === "classic";
      const isChiMode = preset === "terrainiffic";
      const isZenGardenMode = preset === "zen-garden";

      if (isAlphaMode) {
        const terrainResult = SetupLogic.randomizeTerrain(
          matchState.terrain,
          matchState.board,
          matchState.terrainInventory,
          activePlayersForMatch,
          selectedMode,
        );
        matchState.terrain = terrainResult.terrain;
        matchState.terrainInventory = terrainResult.terrainInventory;

        const unitsResult = SetupLogic.randomizeUnits(
          matchState.board,
          matchState.terrain,
          matchState.inventory,
          activePlayersForMatch,
          selectedMode,
        );
        matchState.board = unitsResult.board;
        matchState.inventory = unitsResult.inventory;

        setGameState("play");
      } else if (isPiMode) {
        let layoutSeed = seed;
        const isNoSeedProvided = !layoutSeed;

        if (isNoSeedProvided) {
          const randomIndex = Math.floor(Math.random() * DEFAULT_SEEDS.length);
          layoutSeed = DEFAULT_SEEDS[randomIndex].seed;
        }

        const decodedLayout = deserializeGame(layoutSeed!);
        if (decodedLayout) {
          const adaptedLayout = adaptSeedToMode(decodedLayout!, selectedMode);
          matchState.terrain = adaptedLayout.terrain;
          matchState.terrainInventory = {};
        }

        const formationResult = SetupLogic.applyClassicalFormation(
          matchState.board,
          matchState.terrain,
          matchState.inventory,
          matchState.terrainInventory,
          activePlayersForMatch,
          selectedMode,
        );
        matchState.board = formationResult.board;
        matchState.terrain = formationResult.terrain;
        matchState.inventory = formationResult.inventory;
        matchState.terrainInventory = formationResult.terrainInventory;

        setGameState("play");
      } else if (isChiMode) {
        let layoutSeed = seed;
        const isNoSeedProvided = !layoutSeed;

        if (isNoSeedProvided) {
          const modeSeeds = DEFAULT_SEEDS.filter((s) => s.mode === selectedMode);
          const randomIndex = Math.floor(Math.random() * modeSeeds.length);
          layoutSeed = modeSeeds[randomIndex]?.seed || DEFAULT_SEEDS[0].seed;
        }

        const decodedLayout = deserializeGame(layoutSeed);
        if (decodedLayout) {
          const adaptedLayout = adaptSeedToMode(decodedLayout, selectedMode);
          matchState.terrain = adaptedLayout.terrain;
          matchState.board = adaptedLayout.board;

          // Check if seed has units
          let seedHasUnits = false;
          for (let r = 0; r < 12; r++) {
            for (let c = 0; c < 12; c++) {
              if (adaptedLayout.board[r][c]) {
                seedHasUnits = true;
                break;
              }
            }
          }

          if (seedHasUnits) {
            // Seed has units, clear inventory for all active players
            activePlayersForMatch.forEach((pid) => {
              matchState.inventory[pid] = [];
            });
          } else {
            // Apply classical formation if no units in seed
            const formationResult = SetupLogic.applyClassicalFormation(
              matchState.board,
              matchState.terrain,
              matchState.inventory,
              matchState.terrainInventory,
              activePlayersForMatch,
              selectedMode,
              "classical",
            );
            matchState.board = formationResult.board;
            matchState.terrain = formationResult.terrain;
            matchState.inventory = formationResult.inventory;
            matchState.terrainInventory = formationResult.terrainInventory;
          }
        }
        setGameState("play");
      } else if (isZenGardenMode) {
        matchState.terrain = matchState.terrain.map((row) =>
          row.map(() => "flat" as TerrainType),
        );
        matchState.board = matchState.board.map((row) => row.map(() => null));
        // Keep terrainInventory from createInitialState
        setGameState("gamemaster");
      } else {
        setGameState("setup");
      }

      setBoard(matchState.board);
      setTerrain(matchState.terrain);
      setInventory(matchState.inventory);
      setTerrainInventory(matchState.terrainInventory);
      setActivePlayers(activePlayersForMatch);
      turnState.setTurn(activePlayersForMatch[0]);
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
      turnState,
    ],
  );

  const randomizeTerrain = useCallback(() => {
    const bgioClient = bgioClientRef?.current;
    if (bgioClient) {
      bgioClient.moves.randomizeTerrain(turn);
    } else {
      const result = SetupLogic.randomizeTerrain(
        currentTerrain,
        currentBoard,
        terrainInventory,
        [turn],
        mode,
      );
      setTerrain(result.terrain);
      setTerrainInventory(result.terrainInventory);
    }
    setPlacementTerrain(null);
  }, [
    currentBoard,
    currentTerrain,
    bgioClientRef,
    mode,
    setPlacementTerrain,
    setTerrain,
    setTerrainInventory,
    terrainInventory,
    turn,
  ]);

  const generateElementalTerrain = useCallback(() => {
    const bgioClient = bgioClientRef?.current;
    if (bgioClient) {
      bgioClient.moves.applyChiGarden(turn);
    } else {
      const result = SetupLogic.generateElementalTerrain(
        currentTerrain,
        currentBoard,
        terrainInventory,
        [turn],
        mode,
      );
      setTerrain(result.terrain);
      setTerrainInventory(result.terrainInventory);
    }
    setPlacementTerrain(null);
  }, [
    currentBoard,
    currentTerrain,
    bgioClientRef,
    mode,
    setPlacementTerrain,
    setTerrain,
    setTerrainInventory,
    terrainInventory,
    turn,
  ]);

  const randomizeUnits = useCallback(() => {
    const bgioClient = bgioClientRef?.current;
    if (bgioClient) {
      bgioClient.moves.randomizeUnits(turn);
    } else {
      const result = SetupLogic.randomizeUnits(
        currentBoard,
        currentTerrain,
        inventory,
        [turn],
        mode,
      );
      setBoard(result.board);
      setInventory(result.inventory);
    }
    setPlacementPiece(null);
    setPreviewMoves([]);
  }, [
    currentBoard,
    currentTerrain,
    bgioClientRef,
    inventory,
    mode,
    setBoard,
    setInventory,
    setPlacementPiece,
    setPreviewMoves,
    turn,
  ]);

  const setClassicalFormation = useCallback(() => {
    const bgioClient = bgioClientRef?.current;
    if (bgioClient) {
      bgioClient.moves.setClassicalFormation(turn);
    } else {
      // Pi Mode: Standard formation + ALWAYS 16 terrain tiles
      const terrainResult = SetupLogic.randomizeTerrain(
        currentTerrain,
        currentBoard,
        terrainInventory,
        [turn],
        mode,
        16,
      );
      const result = SetupLogic.applyClassicalFormation(
        currentBoard,
        terrainResult.terrain,
        inventory,
        terrainResult.terrainInventory,
        [turn],
        mode,
        "classical",
      );
      setBoard(result.board);
      setTerrain(result.terrain);
      setInventory(result.inventory);
      setTerrainInventory(result.terrainInventory);
    }
    setPlacementPiece(null);
    setPreviewMoves([]);
  }, [
    currentBoard,
    currentTerrain,
    bgioClientRef,
    inventory,
    mode,
    setBoard,
    setInventory,
    setPlacementPiece,
    setPreviewMoves,
    setTerrain,
    setTerrainInventory,
    terrainInventory,
    turn,
  ]);

  const applyChiGarden = useCallback(() => {
    const bgioClient = bgioClientRef?.current;
    if (bgioClient) {
      bgioClient.moves.applyChiGarden(turn);
    } else {
      const gardenSeeds = DEFAULT_SEEDS.filter((s) => s.mode === mode);
      const seedToUse =
        gardenSeeds.length > 0
          ? gardenSeeds[Math.floor(Math.random() * gardenSeeds.length)].seed
          : DEFAULT_SEEDS[0].seed;

      const decoded = deserializeGame(seedToUse);
      if (decoded) {
        const adapted = adaptSeedToMode(decoded, mode);
        const myCells = SetupLogic.getPlayerCells(turn, mode);
        const nextTerrain = currentTerrain.map((r) => [...r]);

        // Garden Logic: Only apply terrain, respect existing pieces
        for (const [r, c] of myCells) {
          const newTerrain = adapted.terrain[r][c];
          const existingPiece = currentBoard[r][c];
          
          if (existingPiece && !SetupLogic.canPlaceUnit(existingPiece.type, newTerrain)) {
            nextTerrain[r][c] = "flat" as TerrainType;
          } else {
            nextTerrain[r][c] = newTerrain;
          }
        }

        setTerrain(nextTerrain);
        const newTerrainInventory = { ...terrainInventory };
        newTerrainInventory[turn] = [];
        setTerrainInventory(newTerrainInventory);
      }
    }
    setPlacementPiece(null);
    setPlacementTerrain(null);
    setPreviewMoves([]);
  }, [
    bgioClientRef,
    mode,
    setPlacementPiece,
    setPlacementTerrain,
    setPreviewMoves,
    setTerrain,
    setTerrainInventory,
    terrainInventory,
    turn,
    currentBoard,
    currentTerrain,
  ]);

  const resetToOmega = useCallback(() => {
    const bgioClient = bgioClientRef?.current;
    if (bgioClient) {
      bgioClient.moves.resetToOmega(turn);
    } else {
      const players = SetupLogic.getPlayersForMode(mode);
      const state = SetupLogic.createInitialState(mode, players);

      setBoard(state.board);
      setTerrain(state.terrain);
      setInventory(state.inventory);
      setTerrainInventory(state.terrainInventory);
      setCapturedBy({ red: [], yellow: [], green: [], blue: [] });
    }
    setPlacementPiece(null);
    setPlacementTerrain(null);
    setPreviewMoves([]);
  }, [
    bgioClientRef,
    mode,
    setBoard,
    setCapturedBy,
    setInventory,
    setPlacementPiece,
    setPlacementTerrain,
    setPreviewMoves,
    setTerrain,
    setTerrainInventory,
    turn,
  ]);

  const resetTerrain = useCallback(() => {
    const bgioClient = bgioClientRef?.current;
    if (bgioClient) {
      bgioClient.moves.resetTerrain(turn);
    } else {
      const nextTerrain = currentTerrain.map((row) => [...row]);
      const nextTInv = { ...terrainInventory };
      const myCells = SetupLogic.getPlayerCells(turn, mode);
      const reclaimed: TerrainType[] = [];
      for (const [r, c] of myCells) {
        if (nextTerrain[r][c] !== "flat") {
          reclaimed.push(nextTerrain[r][c]);
          nextTerrain[r][c] = "flat" as TerrainType;
        }
      }
      nextTInv[turn] = [...(nextTInv[turn] || []), ...reclaimed];
      setTerrain(nextTerrain);
      setTerrainInventory(nextTInv);
    }
    setPlacementTerrain(null);
  }, [
    bgioClientRef,
    currentTerrain,
    mode,
    setPlacementTerrain,
    setTerrain,
    setTerrainInventory,
    terrainInventory,
    turn,
  ]);

  const resetUnits = useCallback(() => {
    const bgioClient = bgioClientRef?.current;
    if (bgioClient) {
      bgioClient.moves.resetUnits(turn);
    } else {
      const nextBoard = currentBoard.map((row) => [...row]);
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
    }
    setPlacementPiece(null);
  }, [
    bgioClientRef,
    currentBoard,
    inventory,
    mode,
    setBoard,
    setInventory,
    setPlacementPiece,
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

    const nextBoard = currentBoard.map((row) => [...row]);
    const nextTerrain = currentTerrain.map((row) => [...row]);
    const sourceCells = SetupLogic.getPlayerCells(source, mode);
    const targetCells = SetupLogic.getPlayerCells(target, mode);

    for (const [r, c] of targetCells) {
      nextBoard[r][c] = null;
      nextTerrain[r][c] = "flat" as TerrainType;
    }

    for (const [r, c] of sourceCells) {
      const piece = currentBoard[r][c];
      const terr = currentTerrain[r][c];
      const tr = 11 - r;
      const tc = 11 - c;
      if (tr >= 0 && tr < 12 && tc >= 0 && tc < 12) {
        nextTerrain[tr][tc] = terr;
        if (piece) nextBoard[tr][tc] = { ...piece, player: target };
      }
    }

    const updateInventoryForPlayer = (
      p: string,
      cBoard: (BoardPiece | null)[][],
    ) => {
      const placedUnits: Record<string, number> = {};
      for (let r = 0; r < 12; r++) {
        for (let c = 0; c < 12; c++) {
          const piece = cBoard[r][c];
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
    currentBoard,
    currentTerrain,
    inventory,
    mode,
    setBoard,
    setInventory,
    setTerrain,
    turn,
  ]);

  return {
    initGame,
    initGameWithPreset,
    randomizeTerrain,
    generateElementalTerrain,
    randomizeUnits,
    setClassicalFormation,
    applyChiGarden,
    resetToOmega,
    mirrorBoard,
    resetTerrain,
    resetUnits,
  };
}
