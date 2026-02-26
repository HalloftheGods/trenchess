import { useCallback, useMemo } from "react";
import * as SetupLogic from "@/core/setup";
import { TERRAIN_TYPES } from "@constants";
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
 * useBoardInteraction — Direct board input orchestrator.
 * strictly derived from boardgame.io state.
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
  const G = bgioState?.G;
  const ctx = bgioState?.ctx;
  const board = G?.board || EMPTY_BOARD;
  const terrain = G?.terrain || EMPTY_TERRAIN;
  const mode = G?.mode || configState.mode;

  const currentTurn = G && ctx ? G.playerMap[ctx.currentPlayer] : "red";

  // Perspective: Who is the local user?
  const localPlayer = useMemo(() => {
    if (playerID && G?.playerMap[playerID]) return G.playerMap[playerID];
    return currentTurn;
  }, [playerID, G?.playerMap, currentTurn]);

  const currentPhase = ctx?.phase || "menu";
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
  } = placementManager;

  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (!isSetupPhase || (!placementPiece && !placementTerrain)) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }

      // Territory check for placement
      const myCells = SetupLogic.getPlayerCells(localPlayer, mode);
      const isMyTerritory = myCells.some(([r, c]) => r === row && c === col);

      if (!isMyTerritory || board[row][col]) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }

      if (configState.setupMode === "terrain" && placementTerrain) {
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
      isSetupPhase,
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

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const client = bgioClientRef?.current;
      if (!client) return;

      if (isSetupPhase) {
        const myCells = SetupLogic.getPlayerCells(localPlayer, mode);
        const isMyTerritory = myCells.some(([r, c]) => r === row && c === col);
        if (!isMyTerritory) return;

        if (configState.setupMode === "terrain") {
          const currentTerrain = terrain[row][col];
          if (currentTerrain !== TERRAIN_TYPES.FLAT) {
            client.moves.placeTerrain(
              row,
              col,
              TERRAIN_TYPES.FLAT,
              localPlayer,
            );
          } else if (placementTerrain && !board[row][col]) {
            client.moves.placeTerrain(row, col, placementTerrain, localPlayer);
          }
        } else {
          if (placementPiece) {
            client.moves.placePiece(row, col, placementPiece, localPlayer);
          } else if (board[row][col]?.player === localPlayer) {
            client.moves.placePiece(row, col, null, localPlayer);
          }
        }
        return;
      }

      // Play Phase
      if (selectedCell) {
        const isTargetValid = validMoves.some(
          ([vr, vc]) => vr === row && vc === col,
        );
        if (isTargetValid) {
          executeMove(selectedCell[0], selectedCell[1], row, col);
        }
        setSelectedCell(null);
        setValidMoves([]);
      } else {
        const piece = board[row][col];
        if (piece && piece.player === currentTurn) {
          setSelectedCell([row, col]);
          setValidMoves(getValidMovesForPiece(row, col, piece, currentTurn));
        }
      }
    },
    [
      bgioClientRef,
      isSetupPhase,
      localPlayer,
      mode,
      configState.setupMode,
      terrain,
      placementTerrain,
      board,
      placementPiece,
      selectedCell,
      validMoves,
      executeMove,
      setSelectedCell,
      setValidMoves,
      currentTurn,
      getValidMovesForPiece,
    ],
  );

  return useMemo(
    () => ({ handleCellHover, handleCellClick }),
    [handleCellHover, handleCellClick],
  );
}
