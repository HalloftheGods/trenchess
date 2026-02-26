import { useCallback } from "react";
import { getBestMove } from "@/core/bot/aiLogic";
import { getValidMoves } from "@/core/mechanics/gameLogic";
import { engineService } from "@/core/bot/stockfishLogic";
import type { GameMode, BoardPiece, TerrainType } from "@/shared/types/game";

export function useAiDecision() {
  const getDecision = useCallback(async (
    board: (BoardPiece | null)[][],
    terrain: TerrainType[][],
    turn: string,
    mode: GameMode,
  ) => {
    try {
      const sfMove = await engineService.getBestMove(board, turn);
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

      if (isValid) return sfMove;

      console.log("Stockfish move was blocked by Trenchess Terrain! Falling back to backup JS Engine.");
      return getBestMove(board, terrain, turn, mode);
    } catch (e) {
      console.warn("Stockfish failed, falling back to basic AI", e);
      return getBestMove(board, terrain, turn, mode);
    }
  }, []);

  return { getDecision };
}
