import { useEffect, useRef } from "react";
import { useAiDecision } from "./useAiDecision";
import { PHASES } from "@constants/game";
import type { GameMode, BoardPiece, TerrainType } from "@/shared/types/game";

interface UseComputerOpponentProps {
  gameState: string;
  turn: string;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  mode: GameMode;
  playerTypes: Record<string, "human" | "computer">;
  executeMove: (fr: number, fc: number, tr: number, tc: number, isAi?: boolean) => void;
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
  const { getDecision } = useAiDecision();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isThinkingRef = useRef(false);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const shouldThink = gameState === PHASES.COMBAT && !winner && playerTypes[turn] === "computer";

    if (!shouldThink) {
      if (isThinkingRef.current) {
        isThinkingRef.current = false;
        setIsThinking(false);
      }
      return;
    }

    const runAi = async () => {
      if (isThinkingRef.current) return;
      
      isThinkingRef.current = true;
      setIsThinking(true);
      
      const move = await getDecision(board, terrain, turn, mode);

      isThinkingRef.current = false;
      setIsThinking(false);
      
      if (move) {
        executeMove(move.from[0], move.from[1], move.to[0], move.to[1], true);
      }
    };

    timeoutRef.current = setTimeout(runAi, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gameState, turn, board, terrain, mode, playerTypes, winner, executeMove, setIsThinking, getDecision]);
}
