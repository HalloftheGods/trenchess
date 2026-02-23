import { useCallback } from "react";
import { canPlaceUnit, getPlayerCells } from "@/core/setup/setupLogic";
import { TERRAIN_TYPES } from "@/core/data/terrainDetails";
import type {
  BoardInteraction,
  MultiplayerState,
  GameCore,
  BgioClient,
  PlacementManager,
} from "@/shared/types";
import type { TrenchGameState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";
import { MAX_TERRAIN_PER_PLAYER } from "@/core/constants/terrain.constants";

export function useBoardInteraction(
  bgioState: { G: TrenchGameState; ctx: Ctx } | null,
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
  playerID?: string,
): BoardInteraction {
  const { boardState, turnState, configState } = core;

  // Authoritative state from engine
  const board = bgioState?.G?.board ?? boardState.board;
  const terrain = bgioState?.G?.terrain ?? boardState.terrain;
  const turn =
    bgioState?.G?.playerMap && bgioState?.ctx
      ? bgioState.G.playerMap[bgioState.ctx.currentPlayer] || turnState.turn
      : turnState.turn;
  const activePlayers = bgioState?.G?.activePlayers ?? turnState.activePlayers;
  const localPlayerName =
    bgioState?.G?.playerMap && playerID
      ? bgioState.G.playerMap[playerID]
      : turnState.localPlayerName;

  const gameState =
    bgioState?.ctx?.phase === "setup"
      ? "setup"
      : bgioState?.ctx?.phase === "play"
        ? "play"
        : configState.gameState;
  const { mode, setupMode } = configState;

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
      const bgioClient = bgioClientRef?.current;

      if (
        gameState === "setup" &&
        multiplayer?.socketId &&
        multiplayer.readyPlayers[multiplayer.socketId]
      )
        return;

      if (gameState === "setup") {
        const perspectiveTurn =
          gameState === "setup" && localPlayerName
            ? localPlayerName
            : startTurn;
        const myCells = getPlayerCells(perspectiveTurn, mode);
        if (!myCells.some(([cr, cc]) => cr === r && cc === c)) return;

        if (setupMode === "terrain") {
          const current = terrain[r][c];
          if (current !== TERRAIN_TYPES.FLAT) {
            if (bgioClient)
              bgioClient.moves.placeTerrain(
                r,
                c,
                TERRAIN_TYPES.FLAT,
                perspectiveTurn,
              );
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
              bgioClient.moves.placeTerrain(
                r,
                c,
                placementTerrain,
                perspectiveTurn,
              );

              // Let boardgame.io handle inventory decrement. The client resets state via subscription.
              // We just handle local UI state like clearing selected if empty.
              const inventoryCount =
                boardState.terrainInventory?.[perspectiveTurn]?.filter(
                  (t) => t === placementTerrain,
                ).length || 0;
              if (inventoryCount <= 1) {
                setPlacementTerrain(null);
              }
            }
          }
          return;
        }

        if (placementPiece) {
          if (!board[r][c] && canPlaceUnit(placementPiece, terrain[r][c])) {
            if (bgioClient) {
              bgioClient.moves.placePiece(
                r,
                c,
                placementPiece,
                perspectiveTurn,
              );
              // Clear selected if it was the last one
              const inventoryCount =
                boardState.inventory?.[perspectiveTurn]?.filter(
                  (p) => p === placementPiece,
                ).length || 0;
              if (inventoryCount <= 1) {
                setPlacementPiece(null);
              }
            }
          }
        } else if (board[r][c] && board[r][c]!.player === perspectiveTurn) {
          if (bgioClient)
            bgioClient.moves.placePiece(r, c, null, perspectiveTurn);
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
      boardState.terrainInventory,
      boardState.inventory,
      executeMove,
      getValidMovesForPiece,
      gameState,
      localPlayerName,
      mode,
      multiplayer,
      placementPiece,
      placementTerrain,
      selectedCell,
      setPlacementTerrain,
      setPlacementPiece,
      setSelectedCell,
      setValidMoves,
      setupMode,
      terrain,
      turn,
      validMoves,
    ],
  );

  return { handleCellHover, handleCellClick };
}
