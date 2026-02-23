import { useCallback } from "react";
import { canPlaceUnit } from "@/core/setup/setupLogic";
import { TERRAIN_TYPES } from "@/core/data/terrainDetails";
import type {
  ZenGardenInteraction,
  GameCore,
  PlacementManager,
  TerrainType,
  PieceType,
} from "@/shared/types";
import type { TrenchGameState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export function useZenGardenInteraction(
  bgioState: { G: TrenchGameState; ctx: Ctx } | null,
  core: GameCore,
  placementManager: PlacementManager,
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
      const startTurn = overrideTurn || turn;

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
