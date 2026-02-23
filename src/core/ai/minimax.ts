import { BOARD_SIZE } from "@/shared/constants/core.constants";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types/game";
import { getValidMoves, isPlayerInCheck } from "@/core/rules/gameLogic";
import { SCORES, hasCommander, evaluateBoard } from "@/core/ai/evaluation";

// Generate all possible moves for a player, sorted by likelihood of being good (captures first)
export const getAllMoves = (
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  player: string,
  mode: GameMode,
): { from: [number, number]; to: [number, number]; score: number }[] => {
  const allMoves = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && piece.player === player) {
        const moves = getValidMoves(
          r,
          c,
          piece,
          player,
          board,
          terrain,
          mode,
          0,
        );
        for (const [tr, tc] of moves) {
          let moveScore = 0;
          // Primary heuristic for move ordering: captures are good
          const targetPiece = board[tr][tc];
          if (targetPiece) {
            moveScore =
              10 * (SCORES[targetPiece.type] || 0) - (SCORES[piece.type] || 0); // MVV-LVA approx
          }
          allMoves.push({
            from: [r, c] as [number, number],
            to: [tr, tc] as [number, number],
            score: moveScore,
          });
        }
      }
    }
  }

  // Sort moves: highest score first
  allMoves.sort((a, b) => b.score + Math.random() - (a.score + Math.random()));

  return allMoves;
};

// Minimax with Alpha-Beta Pruning
export const minimax = (
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  maximizingPlayer: string,
  minimizingPlayer: string,
  mode: GameMode,
): number => {
  // Terminal conditions: win/loss check
  if (!hasCommander(board, maximizingPlayer)) return -999999 + (10 - depth); // Prefer longer survival
  if (!hasCommander(board, minimizingPlayer)) return 999999 - (10 - depth); // Prefer faster wins

  if (depth === 0) {
    return evaluateBoard(board, terrain, maximizingPlayer, mode);
  }

  const currentPlayer = isMaximizing ? maximizingPlayer : minimizingPlayer;
  const moves = getAllMoves(board, terrain, currentPlayer, mode);

  if (moves.length === 0) {
    // Stalemate or Checkmate
    if (isPlayerInCheck(currentPlayer, board, terrain, mode)) {
      // Checkmate
      return isMaximizing ? -999999 + (10 - depth) : 999999 - (10 - depth);
    } else {
      // Stalemate
      return 0;
    }
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      // Apply move
      const nextBoard = board.map((row) => [...row]);
      nextBoard[move.to[0]][move.to[1]] = nextBoard[move.from[0]][move.from[1]];
      nextBoard[move.from[0]][move.from[1]] = null;

      const evalu = minimax(
        nextBoard,
        terrain,
        depth - 1,
        alpha,
        beta,
        false,
        maximizingPlayer,
        minimizingPlayer,
        mode,
      );
      maxEval = Math.max(maxEval, evalu);
      alpha = Math.max(alpha, evalu);
      if (beta <= alpha) break; // Beta cut-off
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      // Apply move
      const nextBoard = board.map((row) => [...row]);
      nextBoard[move.to[0]][move.to[1]] = nextBoard[move.from[0]][move.from[1]];
      nextBoard[move.from[0]][move.from[1]] = null;

      const evalu = minimax(
        nextBoard,
        terrain,
        depth - 1,
        alpha,
        beta,
        true,
        maximizingPlayer,
        minimizingPlayer,
        mode,
      );
      minEval = Math.min(minEval, evalu);
      beta = Math.min(beta, evalu);
      if (beta <= alpha) break; // Alpha cut-off
    }
    return minEval;
  }
};
