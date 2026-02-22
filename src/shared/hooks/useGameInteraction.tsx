import { BOARD_SIZE } from "@constants/core.constants";
import { useState, useCallback } from "react";
import { getValidMoves as getValidMovesUtil } from "@logic/gameLogic";
import { getPlayerCells, canPlaceUnit } from "@setup/setupLogic";
import type { useGameCore } from "@hooks/useGameCore";
import type { PieceType, TerrainType, BoardPiece } from "@engineTypes/game";
import { MAX_TERRAIN_PER_PLAYER } from "@constants/terrain.constants";
import { PIECES } from "@engineConfigs/unitDetails";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";

type GameCore = ReturnType<typeof useGameCore>;

export function useGameInteraction(
  core: GameCore,
  multiplayer?: any,
  onMoveExecuted?: (move: {
    from: [number, number];
    to: [number, number];
  }) => void,
  bgioClient?: any,
) {
  const {
    gameState,
    mode,
    turn,
    setTurn,
    board,
    setBoard,
    terrain,
    setTerrain,
    inventory,
    setInventory,
    terrainInventory,
    setTerrainInventory,
    activePlayers,
    setActivePlayers,
    setWinner,
    setCapturedBy,
    setupMode,
  } = core;

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

  const getValidMoves = useCallback(
    (
      r: number,
      c: number,
      piece: BoardPiece,
      player: string,
      depth = 0,
    ): number[][] => {
      return getValidMovesUtil(
        r,
        c,
        piece,
        player,
        board,
        terrain,
        mode,
        depth,
      );
    },
    [board, terrain, mode],
  );

  const handleCellHover = (r: number, c: number, overrideTurn?: string) => {
    const startTurn = overrideTurn || turn;
    if (gameState === "setup" && multiplayer?.socketId) {
      if (multiplayer.readyPlayers[multiplayer.socketId]) {
        setHoveredCell(null);
        setPreviewMoves([]);
        return;
      }
    }

    if (gameState === "zen-garden") {
      if (placementPiece === ("TRASH" as any)) {
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
          const moves = getValidMoves(
            r,
            c,
            { type: placementPiece, player: startTurn },
            startTurn,
          );
          setPreviewMoves(moves);
        } else {
          setHoveredCell(null);
          setPreviewMoves([]);
        }
        return;
      }
      if (placementTerrain) {
        if (!board[r][c]) {
          setHoveredCell([r, c]);
        } else {
          setHoveredCell(null);
        }
        return;
      }
      return;
    }

    if (gameState !== "setup" || !placementPiece) {
      setHoveredCell(null);
      setPreviewMoves([]);
      return;
    }

    // In setup, we prioritize localPlayerName for territory validation
    const perspectiveTurn =
      gameState === "setup" && core.localPlayerName
        ? core.localPlayerName
        : startTurn;
    const myCells = getPlayerCells(perspectiveTurn, mode);
    const isMyArea = myCells.some(
      ([cellR, cellC]) => cellR === r && cellC === c,
    );
    if (!isMyArea || board[r][c]) {
      setHoveredCell(null);
      setPreviewMoves([]);
      return;
    }

    if (canPlaceUnit(placementPiece, terrain[r][c])) {
      setHoveredCell([r, c]);
      const moves = getValidMoves(
        r,
        c,
        { type: placementPiece, player: startTurn },
        startTurn,
      );
      setPreviewMoves(moves);
    } else {
      setHoveredCell(null);
      setPreviewMoves([]);
    }
  };

  const executeMove = useCallback(
    (
      fromR: number,
      fromC: number,
      toR: number,
      toC: number,
      isAiMove = false,
    ) => {
      if (bgioClient) {
        bgioClient.moves.movePiece([fromR, fromC], [toR, toC]);
      } else {
        const newBoard = board.map((row) => [...row]);
        const captor = turn;
        const captured = newBoard[toR][toC];
        const movingPiece = newBoard[fromR][fromC];
        if (!movingPiece) return;

        newBoard[toR][toC] = movingPiece;
        newBoard[fromR][fromC] = null;

        if (movingPiece.type === PIECES.PAWN) {
          let promoted = false;
          if (mode === "2p-ns") {
            if (turn === "player1" && toR === BOARD_SIZE - 1) promoted = true;
            if (turn === "player4" && toR === 0) promoted = true;
          } else if (mode === "2p-ew") {
            if (turn === "player3" && toC === BOARD_SIZE - 1) promoted = true;
            if (turn === "player2" && toC === 0) promoted = true;
          } else {
            if (
              turn === "player1" &&
              (toR === BOARD_SIZE - 1 || toC === BOARD_SIZE - 1)
            )
              promoted = true;
            if (turn === "player2" && (toR === BOARD_SIZE - 1 || toC === 0))
              promoted = true;
            if (turn === "player3" && (toR === 0 || toC === BOARD_SIZE - 1))
              promoted = true;
            if (turn === "player4" && (toR === 0 || toC === 0)) promoted = true;
          }
          if (promoted) {
            newBoard[toR][toC] = {
              ...movingPiece,
              type: PIECES.QUEEN as PieceType,
            };
          }
        }

        if (captured) {
          setCapturedBy((prev) => ({
            ...prev,
            [captor]: [...(prev[captor] || []), captured],
          }));
          if (captured.type === PIECES.KING) {
            const victim = captured.player;
            const remainingPlayers = activePlayers.filter((p) => p !== victim);
            for (let row = 0; row < BOARD_SIZE; row++) {
              for (let col = 0; col < BOARD_SIZE; col++) {
                if (newBoard[row][col]?.player === victim)
                  newBoard[row][col]!.player = captor;
              }
            }
            if (remainingPlayers.length === 1) setWinner(captor);
            setActivePlayers(remainingPlayers);
          }
        }

        for (let row = 0; row < BOARD_SIZE; row++) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            const p = newBoard[row][col];
            if (
              p &&
              p.player === turn &&
              terrain[row][col] === TERRAIN_TYPES.DESERT
            ) {
              if (row !== toR || col !== toC) {
                if (p.type === PIECES.KING) {
                  const victim = p.player;
                  const remainingPlayers = activePlayers.filter(
                    (ap) => ap !== victim,
                  );
                  for (let r2 = 0; r2 < BOARD_SIZE; r2++) {
                    for (let c2 = 0; c2 < BOARD_SIZE; c2++) {
                      if (newBoard[r2][c2]?.player === victim)
                        newBoard[r2][c2] = null;
                    }
                  }
                  if (remainingPlayers.length === 1)
                    setWinner(remainingPlayers[0]);
                  setActivePlayers(remainingPlayers);
                } else {
                  newBoard[row][col] = null;
                }
              }
            }
          }
        }
        setBoard(newBoard);
        const nextIdx =
          (activePlayers.indexOf(turn) + 1) % activePlayers.length;
        setTurn(activePlayers[nextIdx]);
        if (!isAiMove && onMoveExecuted)
          onMoveExecuted({ from: [fromR, fromC], to: [toR, toC] });
      }
      setSelectedCell(null);
      setValidMoves([]);
    },
    [
      board,
      terrain,
      turn,
      activePlayers,
      setBoard,
      setCapturedBy,
      setWinner,
      setActivePlayers,
      setTurn,
      onMoveExecuted,
      bgioClient,
      mode,
    ],
  );

  const handleCellClick = (r: number, c: number, overrideTurn?: string) => {
    const startTurn = overrideTurn || turn;
    if (
      gameState === "setup" &&
      multiplayer?.socketId &&
      multiplayer.readyPlayers[multiplayer.socketId]
    )
      return;

    if (gameState === "zen-garden") {
      if (placementPiece === ("TRASH" as any)) {
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
        gameState === "setup" && core.localPlayerName
          ? core.localPlayerName
          : startTurn;
      const myCells = getPlayerCells(perspectiveTurn, mode);
      if (!myCells.some(([cr, cc]) => cr === r && cc === c)) return;

      if (setupMode === "terrain") {
        const current = terrain[r][c];
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
            const remaining = (terrainInventory[perspectiveTurn] || []).filter(
              (t: any) => t === placementTerrain,
            ).length;
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
      if (validMoves.some(([vr, vc]) => vr === r && vc === c))
        executeMove(sr, sc, r, c);
      else {
        setSelectedCell(null);
        setValidMoves([]);
      }
    } else {
      const piece = board[r][c];
      if (piece && piece.player === turn) {
        setSelectedCell([r, c]);
        setValidMoves(getValidMoves(r, c, piece, turn));
      }
    }
  };

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
    handleCellHover,
    handleCellClick,
    executeMove,
  };
}
