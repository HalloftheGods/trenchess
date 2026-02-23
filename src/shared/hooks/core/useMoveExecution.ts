import { useCallback } from "react";
import { BOARD_SIZE } from "@constants/core.constants";
import { PIECES } from "@engineConfigs/unitDetails";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import type { PieceType } from "@engineTypes/game";
import type { GameCore, BgioClient } from "./useGameLifecycle";

export interface MoveExecution {
  executeMove: (
    fromR: number,
    fromC: number,
    toR: number,
    toC: number,
    isAiMove?: boolean,
  ) => void;
}

export function useMoveExecution(
  core: GameCore,
  bgioClientRef?: React.MutableRefObject<BgioClient | undefined>,
  onMoveExecuted?: (move: {
    from: [number, number];
    to: [number, number];
  }) => void,
): MoveExecution {
  const { boardState, turnState, configState } = core;
  const { board, terrain, setBoard, setCapturedBy } = boardState;
  const { turn, setTurn, activePlayers, setActivePlayers, setWinner } =
    turnState;
  const { mode } = configState;

  const executeMove = useCallback(
    (
      fromR: number,
      fromC: number,
      toR: number,
      toC: number,
      isAiMove = false,
    ) => {
      const bgioClient = bgioClientRef?.current;
      if (bgioClient) {
        bgioClient.moves.movePiece([fromR, fromC], [toR, toC]);
        return;
      }

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
          if (turn === "red" && toR === BOARD_SIZE - 1) promoted = true;
          if (turn === "blue" && toR === 0) promoted = true;
        } else if (mode === "2p-ew") {
          if (turn === "green" && toC === BOARD_SIZE - 1) promoted = true;
          if (turn === "yellow" && toC === 0) promoted = true;
        } else {
          if (
            turn === "red" &&
            (toR === BOARD_SIZE - 1 || toC === BOARD_SIZE - 1)
          )
            promoted = true;
          if (turn === "yellow" && (toR === BOARD_SIZE - 1 || toC === 0))
            promoted = true;
          if (turn === "green" && (toR === 0 || toC === BOARD_SIZE - 1))
            promoted = true;
          if (turn === "blue" && (toR === 0 || toC === 0)) promoted = true;
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
              if (newBoard[row][col]?.player === victim) {
                newBoard[row][col]!.player = captor;
              }
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
      const nextIdx = (activePlayers.indexOf(turn) + 1) % activePlayers.length;
      setTurn(activePlayers[nextIdx]);

      if (!isAiMove && onMoveExecuted) {
        onMoveExecuted({ from: [fromR, fromC], to: [toR, toC] });
      }
    },
    [
      activePlayers,
      bgioClientRef,
      board,
      mode,
      onMoveExecuted,
      setActivePlayers,
      setBoard,
      setCapturedBy,
      setTurn,
      setWinner,
      terrain,
      turn,
    ],
  );

  return { executeMove };
}
