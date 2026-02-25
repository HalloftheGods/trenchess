import { useEffect, useRef } from "react";
import { getBestMove } from "@/core/ai/aiLogic";
import { getValidMoves } from "@/core/mechanics/gameLogic";
import { engineService } from "@/core/ai/stockfishLogic";
import type { GameMode, BoardPiece, TerrainType } from "@/shared/types/game";

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
  const isThinkingRef = useRef(false);

  useEffect(() => {
    // Clear any pending move if dependencies change
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const shouldThink = gameState === "play" && !winner && playerTypes[turn] === "computer";

    if (!shouldThink) {
      if (isThinkingRef.current) {
        isThinkingRef.current = false;
        setIsThinking(false);
      }
      return;
    }

    // Check if current player is Computer
    const runAi = async () => {
      if (isThinkingRef.current) return;
      
      isThinkingRef.current = true;
      setIsThinking(true);
      
      // Try the professional engine first
      let move;
      try {
        const sfMove = await engineService.getBestMove(board, turn);
        // ... (validation logic)

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
              (m: number[]) => m[0] === sfMove.to[0] && m[1] === sfMove.to[1],
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

        isThinkingRef.current = false;
        setIsThinking(false);
        
        if (move) {
          executeMove(move.from[0], move.from[1], move.to[0], move.to[1], true);
        } else {
          console.log("AI has no valid moves.");
        }
      };

      timeoutRef.current = setTimeout(runAi, 500);

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
