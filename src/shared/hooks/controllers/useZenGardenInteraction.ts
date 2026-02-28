import React, { useCallback } from "react";
import { canPlaceUnit } from "@/app/core/setup/setupLogic";
import { TERRAIN_TYPES, PHASES } from "@constants";
import { analytics } from "@/shared/utilities/analytics";
import type {
  ZenGardenInteraction,
  GameCore,
  PlacementManager,
  PieceType,
  BgioClient,
  BoardPiece,
  TerrainType,
} from "@tc.types";
import type { TrenchessState } from "@tc.types/game";
import type { Ctx } from "boardgame.io";

const EMPTY_BOARD: (BoardPiece | null)[][] = [];
const EMPTY_TERRAIN: TerrainType[][] = [];

/**
 * useZenGardenInteraction — Orchestrates input for Gamemaster and Zen Garden modes.
 * strictly derived from boardgame.io state.
 */
export function useZenGardenInteraction(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
  core: GameCore,
  placementManager: PlacementManager,
  clientRef?: React.RefObject<BgioClient | undefined>,
): ZenGardenInteraction {
  const G = bgioState?.G;
  const ctx = bgioState?.ctx;

  const board = G?.board || EMPTY_BOARD;
  const terrain = G?.terrain || EMPTY_TERRAIN;
  const turn = G && ctx ? G.playerMap[ctx.currentPlayer] : "red";

  const {
    setHoveredCell,
    setPreviewMoves,
    placementPiece,
    placementTerrain,
    getValidMovesForPiece,
  } = placementManager;

  const handleZenGardenHover = useCallback(
    (r: number, c: number, overrideTurn?: string) => {
      const startTurn = overrideTurn || turn;

      if (placementPiece === ("TRASH" as unknown as PieceType)) {
        setHoveredCell(board[r][c] ? [r, c] : null);
        return;
      }
      if (placementTerrain === TERRAIN_TYPES.FLAT) {
        setHoveredCell(terrain[r][c] !== TERRAIN_TYPES.FLAT ? [r, c] : null);
        return;
      }
      if (placementPiece) {
        if (!board[r][c] && canPlaceUnit(placementPiece, terrain[r][c])) {
          setHoveredCell([r, c]);
          setPreviewMoves(
            getValidMovesForPiece(
              r,
              c,
              { type: placementPiece, player: startTurn },
              startTurn,
            ),
          );
        } else {
          setHoveredCell(null);
          setPreviewMoves([]);
        }
        return;
      }
      if (placementTerrain) {
        setHoveredCell(!board[r][c] ? [r, c] : null);
        return;
      }
    },
    [
      board,
      getValidMovesForPiece,
      placementPiece,
      placementTerrain,
      setHoveredCell,
      setPreviewMoves,
      terrain,
      turn,
    ],
  );

  const handleZenGardenClick = useCallback(
    (r: number, c: number, overrideTurn?: string) => {
      const client = clientRef?.current;
      if (!client) return;

      const startTurn = overrideTurn || turn;
      const isGamemaster = core.gameState === PHASES.GAMEMASTER;

      if (placementPiece === ("TRASH" as unknown as PieceType)) {
        if (board[r][c]) {
          client.moves.placePiece(
            r,
            c,
            null,
            board[r][c]!.player,
            isGamemaster,
          );
        }
        return;
      }
      if (placementTerrain === TERRAIN_TYPES.FLAT) {
        if (terrain[r][c] !== TERRAIN_TYPES.FLAT) {
          client.moves.placeTerrain(
            r,
            c,
            TERRAIN_TYPES.FLAT,
            undefined,
            isGamemaster,
          );
        }
        return;
      }
      if (placementPiece) {
        client.moves.placePiece(r, c, placementPiece, startTurn, isGamemaster);
        analytics.trackEvent(
          isGamemaster ? "Gamemaster" : "ZenGarden",
          "Place Piece",
          placementPiece,
        );
        return;
      }
      if (placementTerrain) {
        client.moves.placeTerrain(
          r,
          c,
          placementTerrain,
          startTurn,
          isGamemaster,
        );
        analytics.trackEvent(
          isGamemaster ? "Gamemaster" : "ZenGarden",
          "Place Terrain",
          placementTerrain,
        );
        return;
      }
    },
    [
      board,
      placementPiece,
      placementTerrain,
      terrain,
      turn,
      clientRef,
      core.gameState,
    ],
  );

  return { handleZenGardenHover, handleZenGardenClick };
}
