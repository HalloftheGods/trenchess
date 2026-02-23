import { useState, useCallback } from "react";
import { getValidMoves } from "@/core/logic/gameLogic";
import type { PieceType, TerrainType, BoardPiece } from "@/core/types/game";
import type { GameCore } from "./useGameLifecycle";
import type { TrenchGameState } from "@/client/game/Game";
import type { Ctx } from "boardgame.io";

export interface PlacementManager {
  selectedCell: [number, number] | null;
  setSelectedCell: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
  hoveredCell: [number, number] | null;
  setHoveredCell: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  validMoves: number[][];
  setValidMoves: React.Dispatch<React.SetStateAction<number[][]>>;
  previewMoves: number[][];
  setPreviewMoves: React.Dispatch<React.SetStateAction<number[][]>>;
  placementPiece: PieceType | null;
  setPlacementPiece: React.Dispatch<React.SetStateAction<PieceType | null>>;
  placementTerrain: TerrainType | null;
  setPlacementTerrain: React.Dispatch<React.SetStateAction<TerrainType | null>>;
  getValidMovesForPiece: (
    r: number,
    c: number,
    piece: BoardPiece,
    player: string,
    depth?: number,
  ) => number[][];
}

export function usePlacementManager(
  bgioState: { G: TrenchGameState; ctx: Ctx } | null,
  core: GameCore,
): PlacementManager {
  const { boardState, configState } = core;

  // Authoritative state from engine
  const board = bgioState?.G?.board ?? boardState.board;
  const terrain = bgioState?.G?.terrain ?? boardState.terrain;
  const mode = bgioState?.G?.mode ?? configState.mode;

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null,
  );
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<number[][]>([]);
  const [previewMoves, setPreviewMoves] = useState<number[][]>([]);
  const [placementPiece, setPlacementPiece] = useState<PieceType | null>(null);
  const [placementTerrain, setPlacementTerrain] = useState<TerrainType | null>(
    null,
  );

  const getValidMovesForPiece = useCallback(
    (
      r: number,
      c: number,
      piece: BoardPiece,
      player: string,
      depth = 0,
    ): number[][] => {
      return getValidMoves(r, c, piece, player, board, terrain, mode, depth);
    },
    [board, terrain, mode],
  );

  return {
    selectedCell,
    setSelectedCell,
    hoveredCell,
    setHoveredCell,
    validMoves,
    setValidMoves,
    previewMoves,
    setPreviewMoves,
    placementPiece,
    setPlacementPiece,
    placementTerrain,
    setPlacementTerrain,
    getValidMovesForPiece,
  };
}
