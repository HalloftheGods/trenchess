import { useEffect, useRef } from "react";
import { getBestMove } from "../utils/aiLogic";
import type { GameMode, BoardPiece, TerrainType } from "../types";

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
}: UseComputerOpponentProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending move if turn changes or game ends
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (gameState !== "play" || winner) return;

    // Check if current player is Computer
    if (playerTypes[turn] === "computer") {
      // Schedule AI Move
      timeoutRef.current = setTimeout(() => {
        const move = getBestMove(board, terrain, turn, mode);

        if (move) {
          executeMove(move.from[0], move.from[1], move.to[0], move.to[1], true);
        } else {
          // AI stuck (no moves). Game logic should handled 'skip' before this,
          // but if we are here, maybe we should just skip?
          // For now, do nothing.
          console.log("AI has no valid moves.");
        }
      }, 750); // 750ms "thinking" time
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gameState, turn, board, terrain, mode, playerTypes, winner, executeMove]);
}
