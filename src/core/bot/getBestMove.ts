import type { BoardPiece, TerrainType, GameMode, Move } from "@/shared/types";
import { getAllMoves, minimax } from "./minimax";

/**
 * Main entry point for AI to calculate next move.
 */
export const getBestMove = (
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  player: string,
  mode: GameMode,
): Move | null => {
  // Determine opponent player ID (assuming 2p for now)
  let opponent = "yellow";
  if (player === "yellow") opponent = "red";
  if (player === "green") opponent = "blue";
  if (player === "blue") opponent = "green";

  // Depth settings (2 plies to ensure tests complete reasonably fast)
  const SEARCH_DEPTH = 2;

  let bestMove: Move | null = null;
  let bestScore = -Infinity;

  const moves = getAllMoves(board, terrain, player, mode);

  if (moves.length === 0) return null;

  for (const move of moves) {
    // Apply move
    const nextBoard = board.map((row) => [...row]);
    nextBoard[move.to[0]][move.to[1]] = nextBoard[move.from[0]][move.from[1]];
    nextBoard[move.from[0]][move.from[1]] = null;

    // Evaluate via Minimax
    const moveScore = minimax(
      nextBoard,
      terrain,
      SEARCH_DEPTH - 1,
      -Infinity,
      Infinity,
      false, // Next turn is min's
      player,
      opponent,
      mode,
    );

    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = { from: move.from, to: move.to, score: moveScore };
    }

    // If we found a forced mate, pick it immediately
    if (bestScore > 90000) {
      break;
    }
  }

  // Fallback if somehow all moves lead to certain death
  if (!bestMove && moves.length > 0) {
    bestMove = { from: moves[0].from, to: moves[0].to, score: 0 };
  }

  return bestMove;
};
