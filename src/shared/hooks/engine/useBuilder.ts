import { useState, useCallback, useEffect, useRef } from "react";
import {
  applyPiecePlacement,
  applyTerrainPlacement,
} from "@/app/core/setup/placement";
import { createInitialState } from "@/app/core/setup/initialization";
import { PHASES } from "@constants/game";
import type {
  BoardPiece,
  TerrainType,
  PieceType,
  GameMode,
  BgioClient,
  MultiplayerState,
} from "@tc.types";

import {
  randomizeTerrain as randomizeTerrainLogic,
  randomizeUnits as randomizeUnitsLogic,
} from "@/app/core/setup/randomization";
import { applyClassicalFormation as applyClassicalFormationLogic } from "@/app/core/setup/formations";

export interface BuilderHook {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  placePiece: (
    row: number,
    col: number,
    type: PieceType | null,
    pid: string,
    isGM?: boolean,
  ) => void;
  placeTerrain: (
    row: number,
    col: number,
    type: TerrainType,
    pid: string,
    isGM?: boolean,
  ) => void;
  randomizeTerrain: (pids: string[]) => void;
  randomizeUnits: (pids: string[]) => void;
  setClassicalFormation: (pids: string[]) => void;
  syncToEngine: () => void;
  reset: () => void;
  saveConfig: () => void;
  loadConfig: () => boolean;
}

export function useBuilder(
  gameState: string,
  mode: GameMode | null,
  activePlayers: string[],
  isMercenary: boolean,
  multiplayer: MultiplayerState,
  clientRef?: React.RefObject<BgioClient | undefined>,
): BuilderHook {
  const [board, setBoard] = useState<(BoardPiece | null)[][]>([]);
  const [terrain, setTerrain] = useState<TerrainType[][]>([]);
  const [inventory, setInventory] = useState<Record<string, PieceType[]>>({});
  const [terrainInventory, setTerrainInventory] = useState<
    Record<string, TerrainType[]>
  >({});

  const isInitializedRef = useRef(false);

  // Initialize local state when mode is set and we are in GENESIS
  useEffect(() => {
    if (gameState === PHASES.GENESIS && mode && !isInitializedRef.current) {
      queueMicrotask(() => {
        const initial = createInitialState(mode, activePlayers, isMercenary);
        setBoard(initial.board);
        setTerrain(initial.terrain);
        setInventory(initial.inventory);
        setTerrainInventory(initial.terrainInventory);
        isInitializedRef.current = true;
      });
    } else if (gameState !== PHASES.GENESIS) {
      isInitializedRef.current = false;
    }
  }, [gameState, mode, activePlayers, isMercenary]);

  const syncToEngine = useCallback(() => {
    if (clientRef?.current && gameState === PHASES.GENESIS) {
      clientRef.current.moves.syncLayout({
        board,
        terrain,
        inventory,
        terrainInventory,
      });
    }
  }, [clientRef, gameState, board, terrain, inventory, terrainInventory]);

  // Periodic sync in multiplayer
  useEffect(() => {
    if (multiplayer.roomId && gameState === PHASES.GENESIS) {
      const interval = setInterval(syncToEngine, 5000); // Sync every 5 seconds
      return () => clearInterval(interval);
    }
  }, [multiplayer.roomId, gameState, syncToEngine]);

  const placePiece = useCallback(
    (
      row: number,
      col: number,
      type: PieceType | null,
      pid: string,
      isGM: boolean = false,
    ) => {
      if (!mode) return;
      const next = applyPiecePlacement(
        { board, terrain, inventory, terrainInventory, isMercenary },
        pid,
        row,
        col,
        type,
        mode,
        isGM,
      );
      setBoard(next.board);
      setInventory(next.inventory);
    },
    [board, terrain, inventory, terrainInventory, isMercenary, mode],
  );

  const placeTerrain = useCallback(
    (
      row: number,
      col: number,
      type: TerrainType,
      pid: string,
      isGM: boolean = false,
    ) => {
      if (!mode) return;
      const next = applyTerrainPlacement(
        { board, terrain, inventory, terrainInventory, isMercenary },
        pid,
        row,
        col,
        type,
        mode,
        isGM,
      );
      setTerrain(next.terrain);
      setTerrainInventory(next.terrainInventory);
    },
    [board, terrain, inventory, terrainInventory, isMercenary, mode],
  );

  const randomizeTerrain = useCallback(
    (pids: string[]) => {
      if (!mode) return;
      const result = randomizeTerrainLogic(
        terrain,
        board,
        terrainInventory,
        pids,
        mode,
      );
      setTerrain(result.terrain);
      setTerrainInventory(result.terrainInventory);
    },
    [terrain, board, terrainInventory, mode],
  );

  const randomizeUnits = useCallback(
    (pids: string[]) => {
      if (!mode) return;
      const result = randomizeUnitsLogic(board, terrain, inventory, pids, mode);
      setBoard(result.board);
      setInventory(result.inventory);
    },
    [board, terrain, inventory, mode],
  );

  const setClassicalFormation = useCallback(
    (pids: string[]) => {
      if (!mode) return;
      const terrainResult = randomizeTerrainLogic(
        terrain,
        board,
        terrainInventory,
        pids,
        mode,
        16,
      );
      const result = applyClassicalFormationLogic(
        board,
        terrainResult.terrain,
        inventory,
        terrainResult.terrainInventory,
        pids,
        mode,
        "classical",
      );
      setBoard(result.board);
      setTerrain(result.terrain);
      setInventory(result.inventory);
      setTerrainInventory(result.terrainInventory);
    },
    [board, terrain, inventory, terrainInventory, mode],
  );

  const reset = useCallback(() => {
    if (!mode) return;
    const initial = createInitialState(mode, activePlayers, isMercenary);
    setBoard(initial.board);
    setTerrain(initial.terrain);
    setInventory(initial.inventory);
    setTerrainInventory(initial.terrainInventory);
  }, [mode, activePlayers, isMercenary]);

  const saveConfig = useCallback(() => {
    const config = {
      board,
      terrain,
      inventory,
      terrainInventory,
      mode,
    };
    localStorage.setItem("trenchess_board_config", JSON.stringify(config));
  }, [board, terrain, inventory, terrainInventory, mode]);

  const loadConfig = useCallback(() => {
    const stored = localStorage.getItem("trenchess_board_config");
    if (!stored) return false;
    try {
      const config = JSON.parse(stored);
      // We should probably check if mode matches, but for now let's just apply it
      // if it's the same mode or if user wants it.
      if (config.mode !== mode) {
        console.warn("Stored config mode mismatch", config.mode, mode);
        // return false; // Maybe still allow loading if they are compatible?
      }

      setBoard(config.board);
      setTerrain(config.terrain);
      setInventory(config.inventory);
      setTerrainInventory(config.terrainInventory);
      return true;
    } catch (e) {
      console.error("Failed to load board config", e);
      return false;
    }
  }, [mode]);

  return {
    board,
    terrain,
    inventory,
    terrainInventory,
    placePiece,
    placeTerrain,
    randomizeTerrain,
    randomizeUnits,
    setClassicalFormation,
    syncToEngine,
    reset,
    saveConfig,
    loadConfig,
  };
}
