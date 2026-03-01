import { useCallback } from "react";
import * as SetupLogic from "@/app/core/setup";
import { TERRAIN_TYPES } from "@constants";
import type { BoardPiece, TerrainType, GameMode } from "@tc.types/game";
import type {
  PlacementManager,
  BgioClient,
  GameConfigState,
  PieceType,
} from "@tc.types";

interface SetupInteractionProps {
  localPlayer: string;
  mode: GameMode;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  configState: GameConfigState;
  placementManager: PlacementManager;
  bgioClientRef?: React.RefObject<BgioClient | undefined>;
  onPlacePiece?: (row: number, col: number, type: PieceType | null) => void;
  onPlaceTerrain?: (row: number, col: number, type: TerrainType) => void;
}

export function useSetupBoardInteraction({
  localPlayer,
  mode,
  board,
  terrain,
  configState,
  placementManager,
  bgioClientRef,
  onPlacePiece,
  onPlaceTerrain,
}: SetupInteractionProps) {
  const {
    setHoveredCell,
    setPreviewMoves,
    placementPiece,
    placementTerrain,
    getValidMovesForPiece,
  } = placementManager;

  const handleSetupHover = useCallback(
    (row: number, col: number) => {
      if (!placementPiece && !placementTerrain) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }

      const myCells = SetupLogic.getPlayerCells(localPlayer, mode);
      const isMyTerritory = myCells.some(([r, c]) => r === row && c === col);

      const canHover = isMyTerritory && !board[row][col];

      if (!canHover) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }

      const isTerrainMode = configState.setupMode === "terrain";

      if (isTerrainMode && placementTerrain) {
        setHoveredCell([row, col]);
      } else if (
        placementPiece &&
        SetupLogic.canPlaceUnit(placementPiece, terrain[row][col])
      ) {
        setHoveredCell([row, col]);
        setPreviewMoves(
          getValidMovesForPiece(
            row,
            col,
            { type: placementPiece, player: localPlayer },
            localPlayer,
            0,
            true,
          ),
        );
      }
    },
    [
      placementPiece,
      placementTerrain,
      localPlayer,
      mode,
      board,
      configState.setupMode,
      terrain,
      setHoveredCell,
      setPreviewMoves,
      getValidMovesForPiece,
    ],
  );

  const handleSetupClick = useCallback(
    (row: number, col: number) => {
      const myCells = SetupLogic.getPlayerCells(localPlayer, mode);
      const isMyTerritory = myCells.some(([r, c]) => r === row && c === col);

      if (!isMyTerritory) return;

      const isTerrainMode = configState.setupMode === "terrain";

      if (isTerrainMode) {
        const currentTerrain = terrain[row][col];
        const isNotFlat = currentTerrain !== TERRAIN_TYPES.FLAT;

        if (isNotFlat) {
          if (onPlaceTerrain) {
            onPlaceTerrain(row, col, TERRAIN_TYPES.FLAT as TerrainType);
          } else if (bgioClientRef?.current) {
            bgioClientRef.current.moves.placeTerrain(
              row,
              col,
              TERRAIN_TYPES.FLAT,
              localPlayer,
            );
          }
        } else if (placementTerrain && !board[row][col]) {
          if (onPlaceTerrain) {
            onPlaceTerrain(row, col, placementTerrain);
          } else if (bgioClientRef?.current) {
            bgioClientRef.current.moves.placeTerrain(
              row,
              col,
              placementTerrain,
              localPlayer,
            );
          }
        }
      } else {
        const pieceAtCell = board[row][col];
        const isMyPiece = pieceAtCell?.player === localPlayer;

        if (placementPiece) {
          if (onPlacePiece) {
            onPlacePiece(row, col, placementPiece);
          } else if (bgioClientRef?.current) {
            bgioClientRef.current.moves.placePiece(
              row,
              col,
              placementPiece,
              localPlayer,
            );
          }
        } else if (isMyPiece) {
          if (onPlacePiece) {
            onPlacePiece(row, col, null);
          } else if (bgioClientRef?.current) {
            bgioClientRef.current.moves.placePiece(row, col, null, localPlayer);
          }
        }
      }
    },
    [
      onPlacePiece,
      onPlaceTerrain,
      bgioClientRef,
      localPlayer,
      mode,
      configState.setupMode,
      terrain,
      placementTerrain,
      board,
      placementPiece,
    ],
  );

  return { handleSetupHover, handleSetupClick };
}
