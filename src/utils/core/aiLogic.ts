import { BOARD_SIZE } from "../../constants";
import { PIECES } from "../../data/configs/unitDetails";
import type { BoardPiece, TerrainType, GameMode } from "../../types/game";
import { getValidMoves, isPlayerInCheck } from "./gameLogic";

// --- Heuristic Weights ---
const SCORES: Record<string, number> = {
  [PIECES.COMMANDER]: 100000,
  [PIECES.BATTLEKNIGHT]: 900,
  [PIECES.TANK]: 500,
  [PIECES.SNIPER]: 400,
  [PIECES.HORSEMAN]: 300,
  [PIECES.BOT]: 100,
};

// Material scores are sufficient for basic eval
// const MOBILITY_WEIGHT = 5;
const CENTER_WEIGHT = 10;
const KING_HUNT_WEIGHT = 20;

export interface Move {
  from: [number, number];
  to: [number, number];
  score?: number;
}

// Helper: Calculate Manhattan Distance
const manhattanDistance = (r1: number, c1: number, r2: number, c2: number) => {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
};

// Helper: Check if game is essentially won/lost
const hasCommander = (board: (BoardPiece | null)[][], player: string) => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.player === player && p.type === PIECES.COMMANDER) {
        return { r, c };
      }
    }
  }
  return null;
};

// Evaluate board for the maximizing player
export const evaluateBoard = (
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  maximizingPlayer: string,
  mode: GameMode,
): number => {
  let score = 0;

  // Identify kings for king hunting heuristics
  const myKingPos = hasCommander(board, maximizingPlayer);

  // Find enemy king (assume 2p mode for simplicity in heuristic)
  // let enemyPlayer = "";
  let enemyKingPos: { r: number; c: number } | null = null;

  let myMaterial = 0;
  let enemyMaterial = 0;

  const myPieces: { r: number; c: number; piece: BoardPiece }[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const value = SCORES[piece.type] || 0;

      if (piece.player === maximizingPlayer) {
        myMaterial += value;
        myPieces.push({ r, c, piece });

        // Center control
        const distToCenter =
          Math.abs(r - (BOARD_SIZE / 2 - 0.5)) +
          Math.abs(c - (BOARD_SIZE / 2 - 0.5));
        score += (BOARD_SIZE - distToCenter) * CENTER_WEIGHT;
      } else {
        enemyMaterial += value;
        // enemyPlayer = piece.player;
        if (piece.type === PIECES.COMMANDER) {
          enemyKingPos = { r, c };
        }
      }
    }
  }

  // Base material difference
  score += myMaterial - enemyMaterial;

  // Win/Loss overrides
  if (!myKingPos) return -999999; // Lost
  if (!enemyKingPos) return 999999; // Won

  // King Hunting Heuristic: If we are winning heavily (e.g., up by a piece),
  // encourage our pieces to move closer to the enemy king, and encourage
  // the enemy king to be pushed to the edge.
  const endgameWeight = Math.min(
    1.0,
    Math.max(0, (2000 - enemyMaterial) / 2000),
  );

  if (myMaterial > enemyMaterial + 200 && enemyKingPos) {
    // 1. Force enemy king to edge/corner
    const enemyKingDistToCenter =
      Math.abs(enemyKingPos.r - (BOARD_SIZE / 2 - 0.5)) +
      Math.abs(enemyKingPos.c - (BOARD_SIZE / 2 - 0.5));
    score += enemyKingDistToCenter * KING_HUNT_WEIGHT * 2 * endgameWeight;

    // 2. Bring our pieces closer to enemy king
    let distanceSum = 0;
    for (const p of myPieces) {
      distanceSum += manhattanDistance(
        p.r,
        p.c,
        enemyKingPos.r,
        enemyKingPos.c,
      );
    }
    score -= distanceSum * KING_HUNT_WEIGHT * endgameWeight;
  }

  // Check penalty (mild, as checkmate is handled by pure depth search)
  if (isPlayerInCheck(maximizingPlayer, board, terrain, mode)) {
    score -= 50;
  }

  return score;
};

// Generate all possible moves for a player, sorted by likelihood of being good (captures first)
const getAllMoves = (
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

  // Sort moves: highest score first (captures evaluated before quiet moves)
  // Add random variance to break ties and prevent exactly identical games
  allMoves.sort((a, b) => b.score + Math.random() - (a.score + Math.random()));

  return allMoves;
};

// Minimax with Alpha-Beta Pruning
const minimax = (
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
      // Stalemate is generally bad when winning, good when losing
      // Simplify by returning 0 (draw score)
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
  let opponent = "player2";
  if (player === "player2") opponent = "player1";
  if (player === "player3") opponent = "player4";
  if (player === "player4") opponent = "player3";

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

  // Fallback if somehow all moves lead to certain death (all score == -Infinity)
  // Just pick a random valid move instead of throwing null
  if (!bestMove && moves.length > 0) {
    bestMove = { from: moves[0].from, to: moves[0].to, score: 0 };
  }

  return bestMove;
};
