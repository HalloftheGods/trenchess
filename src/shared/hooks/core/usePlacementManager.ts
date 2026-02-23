import { useState, useCallback } from "react";
import { getValidMoves } from "@/core/rules/gameLogic";
import type {
  PlacementManager,
  GameCore,
  PieceType,
  TerrainType,
  BoardPiece,
} from "@/types";
import type { TrenchGameState } from "@/types/game";
import type { Ctx } from "boardgame.io";

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
