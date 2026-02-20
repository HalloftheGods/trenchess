import { useEffect, useRef } from "react";
import { getBestMove } from "../utils/aiLogic";
import { getValidMoves } from "../utils/gameLogic";
import { engineService } from "../utils/stockfishLogic";
import type { GameMode, BoardPiece, TerrainType } from "../types/game";

interface UseComputerOpponentProps {
  gameState: string;
  turn: string;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  mode: GameMode;
  playerTypes: Record<string, "human" | "computer">;
  executeMove: (
    fr: number,
    fc: number,
    tr: number,
    tc: number,
    isAi?: boolean,
  ) => void;
  winner: string | null;
  setIsThinking: (thinking: boolean) => void;
}

export function useComputerOpponent({
  gameState,
  turn,
  board,
  terrain,
  mode,
  playerTypes,
  executeMove,
  winner,
  setIsThinking,
}: UseComputerOpponentProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending move if turn changes or game ends
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Always ensure thinking is off when game ends or turn changes initially
    setIsThinking(false);

    if (gameState !== "play" || winner) return;

    // Check if current player is Computer
    if (playerTypes[turn] === "computer") {
      // Use a self-executing async function for the effect
      const runAi = async () => {
        setIsThinking(true);
        // Try the professional engine first
        let move;
        try {
          const sfMove = await engineService.getBestMove(board, turn);

          // Stockfish is completely unaware of Trenchess terrain rules (swamps, mountains etc).
          // We must validate that the move it chose is actually physically possible in Trenchess.
          const piece = board[sfMove.from[0]][sfMove.from[1]];
          let isValid = false;

          if (piece) {
            const validMoves = getValidMoves(
              sfMove.from[0],
              sfMove.from[1],
              piece,
              turn,
              board,
              terrain,
              mode,
            );
            isValid = validMoves.some(
              (m) => m[0] === sfMove.to[0] && m[1] === sfMove.to[1],
            );
          }

          if (isValid) {
            move = sfMove;
          } else {
            console.log(
              "Stockfish move was blocked by Trenchess Terrain! Falling back to backup JS Engine.",
            );
            move = getBestMove(board, terrain, turn, mode);
          }
        } catch (e) {
          console.warn("Stockfish failed, falling back to basic AI", e);
          move = getBestMove(board, terrain, turn, mode);
        }

        setIsThinking(false);
        if (move) {
          executeMove(move.from[0], move.from[1], move.to[0], move.to[1], true);
        } else {
          console.log("AI has no valid moves.");
        }
      };

      timeoutRef.current = setTimeout(runAi, 500); // reduced "thinking" time since Stockfish is fast
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    gameState,
    turn,
    board,
    terrain,
    mode,
    playerTypes,
    winner,
    executeMove,
    setIsThinking,
  ]);
}
