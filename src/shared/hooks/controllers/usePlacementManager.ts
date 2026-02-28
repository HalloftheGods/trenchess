import { useState, useCallback } from "react";
import { getValidMoves } from "@/app/core/mechanics";
import type {
  PlacementManager,
  GameCore,
  PieceType,
  TerrainType,
  BoardPiece,
} from "@tc.types";
import type { TrenchessState } from "@tc.types/game";
import type { Ctx } from "boardgame.io";

export function usePlacementManager(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
  core: GameCore,
): PlacementManager {
  const { configState: _unusedConfigState } = core;

  // Derived inline for zero-lag synchronization with engine state
  const board =
    bgioState?.G?.board ||
    Array(12)
      .fill(null)
      .map(() => Array(12).fill(null));
  const terrain =
    bgioState?.G?.terrain ||
    Array(12)
      .fill(null)
      .map(() => Array(12).fill("flat"));
  const mode = bgioState?.G?.mode || core.mode;

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
      skipCheck = false,
    ): number[][] => {
      return getValidMoves(
        r,
        c,
        piece,
        player,
        board,
        terrain,
        mode,
        depth,
        skipCheck,
      );
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
