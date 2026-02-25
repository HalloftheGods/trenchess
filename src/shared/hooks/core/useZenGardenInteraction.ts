import { useCallback } from "react";
import { canPlaceUnit, getCellOwner } from "@/core/setup/setupLogic";
import { TERRAIN_TYPES } from "@/constants";
import type {
  ZenGardenInteraction,
  GameCore,
  PlacementManager,
  TerrainType,
  PieceType,
  BgioClient,
} from "@/shared/types";
import type { TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export function useZenGardenInteraction(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
  core: GameCore,
  placementManager: PlacementManager,
  clientRef?: React.MutableRefObject<BgioClient | undefined>,
): ZenGardenInteraction {
  const { boardState, turnState } = core;
  const { setBoard, setTerrain, setInventory, setTerrainInventory } =
    boardState;

  // Authoritative state from engine
  const board = bgioState?.G?.board ?? boardState.board;
  const terrain = bgioState?.G?.terrain ?? boardState.terrain;
  const inventory = bgioState?.G?.inventory ?? boardState.inventory;
  const turn =
    bgioState?.G?.playerMap && bgioState?.ctx
      ? bgioState.G.playerMap[bgioState.ctx.currentPlayer] || turnState.turn
      : turnState.turn;

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
        const availableCount = (inventory[startTurn] || []).filter(
          (p) => p === placementPiece,
        ).length;
        if (availableCount <= 0) {
          setHoveredCell(null);
          setPreviewMoves([]);
          return;
        }
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
      inventory,
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
      const isEngineActive = !!bgioState && !!clientRef?.current;
      const startTurn = overrideTurn || turn;
      const isGamemaster = core.configState.gameState === "gamemaster";

      if (isEngineActive) {
        const client = clientRef!.current!;
        if (placementPiece === ("TRASH" as unknown as PieceType)) {
          if (board[r][c]) {
            client.moves.placePiece(r, c, null, board[r][c]!.player, isGamemaster);
          }
          return;
        }
        if (placementTerrain === TERRAIN_TYPES.FLAT) {
          if (terrain[r][c] !== TERRAIN_TYPES.FLAT) {
            client.moves.placeTerrain(r, c, TERRAIN_TYPES.FLAT, undefined, isGamemaster);
          }
          return;
        }
        if (placementPiece) {
          client.moves.placePiece(r, c, placementPiece, startTurn, isGamemaster);
          return;
        }
        if (placementTerrain) {
          client.moves.placeTerrain(r, c, placementTerrain, startTurn, isGamemaster);
          return;
        }
        return;
      }

      // Fallback to local state (legacy Zen Garden behavior)
      if (placementPiece === ("TRASH" as unknown as PieceType)) {
        if (board[r][c]) {
          const removed = board[r][c]!;
          const newBoard = board.map((row) => [...row]);
          newBoard[r][c] = null;
          setBoard(newBoard);
          setInventory((prev) => ({
            ...prev,
            [removed.player]: [...(prev[removed.player] || []), removed.type],
          }));
        }
        return;
      }
      if (placementTerrain === TERRAIN_TYPES.FLAT) {
        if (terrain[r][c] !== TERRAIN_TYPES.FLAT) {
          const old = terrain[r][c];
          const newTerrain = terrain.map((row) => [...row]);
          newTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
          setTerrain(newTerrain);
          setTerrainInventory((prev) => ({
            ...prev,
            [startTurn]: [...(prev[startTurn] || []), old],
          }));
        }
        return;
      }
      if (placementPiece) {
        if (!board[r][c] && canPlaceUnit(placementPiece, terrain[r][c])) {
          setBoard((prev) => {
            const nb = prev.map((row) => [...row]);
            nb[r][c] = { type: placementPiece, player: startTurn };
            return nb;
          });
          setInventory((prev) => {
            const ni = { ...prev };
            const idx = (ni[startTurn] || []).indexOf(placementPiece);
            if (idx !== -1) {
              const list = [...ni[startTurn]];
              list.splice(idx, 1);
              ni[startTurn] = list;
            }
            return ni;
          });
        }
        return;
      }
      if (placementTerrain) {
        if (!board[r][c]) {
          const newTerrain = terrain.map((row) => [...row]);
          newTerrain[r][c] = placementTerrain;
          setTerrain(newTerrain);
        }
        return;
      }
    },
    [
      board,
      placementPiece,
      placementTerrain,
      setBoard,
      setInventory,
      setTerrain,
      setTerrainInventory,
      terrain,
      turn,
    ],
  );

  return { handleZenGardenHover, handleZenGardenClick };
}
