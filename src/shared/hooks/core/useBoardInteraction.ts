import { useCallback } from "react";
import { canPlaceUnit, getPlayerCells } from "@setup/setupLogic";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import type { TerrainType, PieceType } from "@engineTypes/game";
import type { MultiplayerState } from "@hooks/useMultiplayer";
import type { GameCore, BgioClient } from "./useGameLifecycle";
import type { PlacementManager } from "./usePlacementManager";
import { MAX_TERRAIN_PER_PLAYER } from "@constants/terrain.constants";

export interface BoardInteraction {
  handleCellHover: (r: number, c: number, overrideTurn?: string) => void;
  handleCellClick: (r: number, c: number, overrideTurn?: string) => void;
}

export function useBoardInteraction(
  core: GameCore,
  placementManager: PlacementManager,
  executeMove: (
    fromR: number,
    fromC: number,
    toR: number,
    toC: number,
    isAiMove?: boolean,
  ) => void,
  multiplayer?: MultiplayerState,
  bgioClientRef?: React.MutableRefObject<BgioClient | undefined>,
): BoardInteraction {
  const { boardState, turnState, configState } = core;
  const {
    board,
    setBoard,
    terrain,
    setTerrain,
    inventory,
    setInventory,
    terrainInventory,
    setTerrainInventory,
  } = boardState;
  const { turn, activePlayers, localPlayerName } = turnState;
  const { gameState, mode, setupMode } = configState;

  const {
    selectedCell,
    setSelectedCell,
    setHoveredCell,
    validMoves,
    setValidMoves,
    setPreviewMoves,
    placementPiece,
    placementTerrain,
    setPlacementTerrain,
    getValidMovesForPiece,
  } = placementManager;

  const handleCellHover = useCallback(
    (r: number, c: number, overrideTurn?: string) => {
      const startTurn = overrideTurn || turn;
      if (
        gameState === "setup" &&
        multiplayer?.socketId &&
        multiplayer.readyPlayers[multiplayer.socketId]
      ) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }

      if (gameState === "zen-garden") {
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
        return;
      }

      if (gameState !== "setup" || (!placementPiece && !placementTerrain)) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }

      const perspectiveTurn =
        gameState === "setup" && localPlayerName ? localPlayerName : startTurn;
      const myCells = getPlayerCells(perspectiveTurn, mode);
      const isMyArea = myCells.some(([cr, cc]) => cr === r && cc === c);

      if (!isMyArea || board[r][c]) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }

      if (setupMode === "terrain" && placementTerrain) {
        setHoveredCell([r, c]);
        setPreviewMoves([]);
        return;
      }

      if (placementPiece && canPlaceUnit(placementPiece, terrain[r][c])) {
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
    },
    [
      board,
      getValidMovesForPiece,
      gameState,
      inventory,
      localPlayerName,
      mode,
      multiplayer,
      placementPiece,
      placementTerrain,
      setHoveredCell,
      setPreviewMoves,
      terrain,
      turn,
      setupMode,
    ],
  );

  const handleCellClick = useCallback(
    (r: number, c: number, overrideTurn?: string) => {
      const startTurn = overrideTurn || turn;
      if (
        gameState === "setup" &&
        multiplayer?.socketId &&
        multiplayer.readyPlayers[multiplayer.socketId]
      )
        return;

      if (gameState === "zen-garden") {
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
        return;
      }

      if (gameState === "setup") {
        const perspectiveTurn =
          gameState === "setup" && localPlayerName
            ? localPlayerName
            : startTurn;
        const myCells = getPlayerCells(perspectiveTurn, mode);
        if (!myCells.some(([cr, cc]) => cr === r && cc === c)) return;

        if (setupMode === "terrain") {
          const current = terrain[r][c];
          const bgioClient = bgioClientRef?.current;
          if (current !== TERRAIN_TYPES.FLAT) {
            if (bgioClient)
              bgioClient.moves.placeTerrain(r, c, TERRAIN_TYPES.FLAT);
            else {
              const nt = terrain.map((row) => [...row]);
              nt[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
              setTerrain(nt);
              setTerrainInventory((prev) => ({
                ...prev,
                [perspectiveTurn]: [...(prev[perspectiveTurn] || []), current],
              }));
            }
          } else if (placementTerrain && !board[r][c]) {
            const max =
              activePlayers.length === 2
                ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
                : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
            let count = 0;
            for (const [pr, pc] of myCells)
              if (terrain[pr][pc] !== TERRAIN_TYPES.FLAT) count++;
            if (count >= max) return;

            if (bgioClient) {
              bgioClient.moves.placeTerrain(r, c, placementTerrain);
              const remaining = (
                terrainInventory[perspectiveTurn] || []
              ).filter((t: TerrainType) => t === placementTerrain).length;
              if (remaining <= 1) setPlacementTerrain(null);
            } else {
              const nt = terrain.map((row) => [...row]);
              nt[r][c] = placementTerrain;
              setTerrain(nt);
              setTerrainInventory((prev) => {
                const nti = { ...prev };
                const idx = (nti[perspectiveTurn] || []).indexOf(
                  placementTerrain,
                );
                if (idx !== -1) {
                  const list = [...nti[perspectiveTurn]];
                  list.splice(idx, 1);
                  nti[perspectiveTurn] = list;
                }
                return nti;
              });
            }
          }
          return;
        }

        if (placementPiece) {
          if (!board[r][c] && canPlaceUnit(placementPiece, terrain[r][c])) {
            const bgioClient = bgioClientRef?.current;
            if (bgioClient) bgioClient.moves.placePiece(r, c, placementPiece);
            else {
              const nb = board.map((row) => [...row]);
              nb[r][c] = { type: placementPiece, player: perspectiveTurn };
              setBoard(nb);
              setInventory((prev) => {
                const ni = { ...prev };
                const idx = (ni[perspectiveTurn] || []).indexOf(placementPiece);
                if (idx !== -1) {
                  const list = [...ni[perspectiveTurn]];
                  list.splice(idx, 1);
                  ni[perspectiveTurn] = list;
                }
                return ni;
              });
            }
          }
        } else if (board[r][c] && board[r][c]!.player === perspectiveTurn) {
          const bgioClient = bgioClientRef?.current;
          if (bgioClient) bgioClient.moves.placePiece(r, c, null);
          else {
            const piece = board[r][c]!.type;
            const nb = board.map((row) => [...row]);
            nb[r][c] = null;
            setBoard(nb);
            setInventory((prev) => ({
              ...prev,
              [perspectiveTurn]: [...(prev[perspectiveTurn] || []), piece],
            }));
          }
        }
        return;
      }

      if (selectedCell) {
        const [sr, sc] = selectedCell;
        if (validMoves.some(([vr, vc]) => vr === r && vc === c)) {
          executeMove(sr, sc, r, c);
        } else {
          setSelectedCell(null);
          setValidMoves([]);
        }
      } else {
        const piece = board[r][c];
        if (piece && piece.player === turn) {
          setSelectedCell([r, c]);
          setValidMoves(getValidMovesForPiece(r, c, piece, turn));
        }
      }
    },
    [
      activePlayers.length,
      bgioClientRef,
      board,
      executeMove,
      getValidMovesForPiece,
      gameState,
      localPlayerName,
      mode,
      multiplayer,
      placementPiece,
      placementTerrain,
      selectedCell,
      setBoard,
      setInventory,
      setPlacementTerrain,
      setSelectedCell,
      setTerrain,
      setTerrainInventory,
      setValidMoves,
      setupMode,
      terrain,
      terrainInventory,
      turn,
      validMoves,
    ],
  );

  return { handleCellHover, handleCellClick };
}
