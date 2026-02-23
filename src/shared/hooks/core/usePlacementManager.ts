import { useState, useCallback } from "react";
import { getValidMoves } from "@/core/mechanics/movement/movementLogic";
import type {
  PlacementManager,
  GameCore,
  PieceType,
  TerrainType,
  BoardPiece,
} from "@/shared/types";
import type { TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export function usePlacementManager(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
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
