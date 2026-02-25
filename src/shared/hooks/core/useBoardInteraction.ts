import { useCallback, useMemo } from "react";
import * as SetupLogic from "@/core/setup";
import { TERRAIN_TYPES, MAX_TERRAIN_PER_PLAYER } from "@constants";
import { analytics } from "@/shared/utils/analytics";
import type {
  BoardInteraction,
  MultiplayerState,
  GameCore,
  BgioClient,
  PlacementManager,
} from "@/shared/types";
import type {
  TrenchessState,
  BoardPiece,
  TerrainType,
} from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

const EMPTY_BOARD: (BoardPiece | null)[][] = [];
const EMPTY_TERRAIN: TerrainType[][] = [];

/**
 * useBoardInteraction — Handles user input on the game board.
 * Refactored to rely on authoritative engine state and emit moves via bgioClient.
 */
export function useBoardInteraction(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
  core: GameCore,
  placementManager: PlacementManager,
  executeMove: (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    isAiMove?: boolean,
  ) => void,
  _multiplayer?: MultiplayerState,
  bgioClientRef?: React.MutableRefObject<BgioClient | undefined>,
  playerID?: string,
): BoardInteraction {
  const { configState } = core;

  // Derive Authoritative Truths
  const board = useMemo(
    () => bgioState?.G.board || EMPTY_BOARD,
    [bgioState?.G.board],
  );
  const terrain = useMemo(
    () => bgioState?.G.terrain || EMPTY_TERRAIN,
    [bgioState?.G.terrain],
  );
  const mode = bgioState?.G.mode || configState.mode;

  const currentPlayerName =
    bgioState?.G.playerMap && bgioState?.ctx
      ? bgioState.G.playerMap[bgioState.ctx.currentPlayer]
      : "red";

  const localPlayerName =
    bgioState?.G.playerMap && playerID
      ? bgioState.G.playerMap[playerID]
      : core.turnState.turn;

  const currentPhase = bgioState?.ctx.phase || "menu";
  const isSetupPhase = currentPhase === "setup";

  const {
    selectedCell,
    setSelectedCell,
    setHoveredCell,
    validMoves,
    setValidMoves,
    setPreviewMoves,
    placementPiece,
    placementTerrain,
    getValidMovesForPiece,
    setPlacementTerrain,
    setPlacementPiece,
  } = placementManager;

  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (!isSetupPhase || (!placementPiece && !placementTerrain)) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }

      // In setup, we only care about the local player's area
      const myCells = SetupLogic.getPlayerCells(localPlayerName, mode);
      const isWithinMyTerritory = myCells.some(
        ([r, c]) => r === row && c === col,
      );

      if (!isWithinMyTerritory || board[row][col]) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }

      if (configState.setupMode === "terrain" && placementTerrain) {
        setHoveredCell([row, col]);
        setPreviewMoves([]);
        return;
      }

      if (
        placementPiece &&
        SetupLogic.canPlaceUnit(placementPiece, terrain[row][col])
      ) {
        setHoveredCell([row, col]);
        setPreviewMoves(
          getValidMovesForPiece(
            row,
            col,
            { type: placementPiece, player: localPlayerName },
            localPlayerName,
            0,
            true,
          ),
        );
      } else {
        setHoveredCell(null);
        setPreviewMoves([]);
      }
    },
    [
      board,
      getValidMovesForPiece,
      isSetupPhase,
      localPlayerName,
      mode,
      placementPiece,
      placementTerrain,
      setHoveredCell,
      setPreviewMoves,
      terrain,
      configState.setupMode,
    ],
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const bgioClient = bgioClientRef?.current;
      if (!bgioClient) return;

      if (isSetupPhase) {
        const myCells = SetupLogic.getPlayerCells(localPlayerName, mode);
        const isWithinMyTerritory = myCells.some(
          ([r, c]) => r === row && c === col,
        );
        if (!isWithinMyTerritory) return;

        if (configState.setupMode === "terrain") {
          const currentTerrain = terrain[row][col];
          if (currentTerrain !== TERRAIN_TYPES.FLAT) {
            bgioClient.moves.placeTerrain(row, col, TERRAIN_TYPES.FLAT, localPlayerName);
          } else if (placementTerrain && !board[row][col]) {
            const maxQuota =
              bgioState?.G.activePlayers.length === 2
                ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
                : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

            let placedCount = 0;
            for (const [r, c] of myCells) {
              if (terrain[r][c] !== TERRAIN_TYPES.FLAT) placedCount++;
            }

            if (placedCount < maxQuota) {
              bgioClient.moves.placeTerrain(row, col, placementTerrain, localPlayerName);
              analytics.trackEvent("Setup", "Place Terrain", placementTerrain);

              const remainingInInventory =
                bgioState?.G.terrainInventory[localPlayerName]?.filter(
                  (t) => t === placementTerrain,
                ).length || 0;
              if (remainingInInventory <= 1) setPlacementTerrain(null);
            }
          }
          return;
        }

        if (placementPiece) {
          if (
            !board[row][col] &&
            SetupLogic.canPlaceUnit(placementPiece, terrain[row][col])
          ) {
            bgioClient.moves.placePiece(row, col, placementPiece, localPlayerName);
            analytics.trackEvent("Setup", "Place Piece", placementPiece);

            const remainingInInventory =
              bgioState?.G.inventory[localPlayerName]?.filter(
                (p) => p === placementPiece,
              ).length || 0;
            if (remainingInInventory <= 1) setPlacementPiece(null);
          }
        } else if (
          board[row][col] &&
          board[row][col]?.player === localPlayerName
        ) {
          bgioClient.moves.placePiece(row, col, null, localPlayerName);
        }
        return;
      }

      // Handle Play Phase Movement
      if (selectedCell) {
        const [srcRow, srcCol] = selectedCell;
        const isTargetValid = validMoves.some(
          ([vr, vc]) => vr === row && vc === col,
        );

        if (isTargetValid) {
          executeMove(srcRow, srcCol, row, col);
          setSelectedCell(null);
          setValidMoves([]);
        } else {
          setSelectedCell(null);
          setValidMoves([]);
        }
      } else {
        const piece = board[row][col];
        if (piece && piece.player === currentPlayerName) {
          setSelectedCell([row, col]);
          setValidMoves(
            getValidMovesForPiece(row, col, piece, currentPlayerName),
          );
        }
      }
    },
    [
      bgioClientRef,
      bgioState?.G.activePlayers.length,
      bgioState?.G.terrainInventory,
      bgioState?.G.inventory,
      board,
      executeMove,
      getValidMovesForPiece,
      isSetupPhase,
      localPlayerName,
      currentPlayerName,
      mode,
      placementPiece,
      placementTerrain,
      selectedCell,
      setPlacementTerrain,
      setPlacementPiece,
      setSelectedCell,
      setValidMoves,
      configState.setupMode,
      terrain,
      validMoves,
    ],
  );

  return useMemo(
    () => ({ handleCellHover, handleCellClick }),
    [handleCellHover, handleCellClick],
  );
}
