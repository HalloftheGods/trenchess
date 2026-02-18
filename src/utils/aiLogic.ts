import { BOARD_SIZE, PIECES } from "../constants";
import type { BoardPiece, TerrainType, GameMode } from "../types";
import { getValidMoves, isPlayerInCheck } from "./gameLogic";

// --- Heuristic Weights ---
const SCORES = {
  [PIECES.COMMANDER]: 10000,
  [PIECES.BATTLEKNIGHT]: 900,
  [PIECES.TANK]: 500,
  [PIECES.SNIPER]: 400,
  [PIECES.HORSEMAN]: 300,
  [PIECES.BOT]: 100,
};

const MOBILITY_WEIGHT = 10;
const AGGRESSION_WEIGHT = 50; // Bonus for threatening high value
const CENTER_WEIGHT = 20; // Bonus for center control in 2v2/4p

export interface Move {
  from: [number, number];
  to: [number, number];
  score?: number;
}

/**
 * Evaluates the board state from the perspective of 'player'.
 * Positive score = good for 'player'.
 * Negative score = bad for 'player'.
 */
export const evaluateBoard = (
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  player: string,
  mode: GameMode,
): number => {
  let score = 0;

  // 1. Material & Position
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const value = SCORES[piece.type] || 0;

      if (piece.player === player) {
        score += value;

        // Center control bonus (especially for 2v2/4p)
        if (mode === "2v2" || mode === "4p") {
          const distToCenter = Math.abs(r - 5.5) + Math.abs(c - 5.5);
          score += (12 - distToCenter) * CENTER_WEIGHT;
        } else {
          // For 2p, advancing is generally good
          if (mode === "2p-ns") {
            // Forward is r increasing for P1 (NW)? No, P1 is top (0-5), moves down (+r). P4 is bottom (6-11), moves up (-r).
            if (player === "player1") score += r * 5;
            if (player === "player4") score += (11 - r) * 5;
          }
        }
      } else {
        score -= value;
      }
    }
  }

  // 2. Win/Loss (King Check)
  // If player has no king, huge penalty. If enemy has no king, huge bonus.
  // Actually, 'evaluateBoard' is called on leaf nodes.
  // We should rely on Minimax to find checkmates, but a static check status helps.

  if (isPlayerInCheck(player, board, terrain, mode)) {
    score -= 500; // Penalty for being in check
  }

  // Note: Finding if enemy is in check requires knowing who the enemy is.
  // In 2p, it's easy. In 4p, simpler to just maximize own score.

  return score;
};

/**
 * Minimax with Alpha-Beta Pruning
 */
export const getBestMove = (
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  player: string,
  mode: GameMode,
): Move | null => {
  let bestMove: Move | null = null;
  let bestScore = -Infinity;

  // 1. Identify all own pieces
  const myPieces: { r: number; c: number; piece: BoardPiece }[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.player === player) {
        myPieces.push({ r, c, piece: p });
      }
    }
  }

  // 2. Shuffle pieces to add variety if scores are equal
  // (Fisher-Yates shuffle is better, but simple sort with random is okay for small N)
  myPieces.sort(() => Math.random() - 0.5);

  // 3. For each piece, get valid moves
  for (const { r, c, piece } of myPieces) {
    const validMoves = getValidMoves(r, c, piece, player, board, terrain, mode);

    // Mobility Bonus (Pre-move)
    const baseMobilityScore = validMoves.length * MOBILITY_WEIGHT;

    for (const [tr, tc] of validMoves) {
      // Light Simulation: Check if we capture something
      let moveScore = baseMobilityScore;
      const target = board[tr][tc];

      if (target && target.player !== player) {
        // Aggression Bonus
        moveScore += (SCORES[target.type] || 0) * (AGGRESSION_WEIGHT / 10);
      }

      // Simulate Move
      const nextBoard = board.map((row) => [...row]);
      nextBoard[tr][tc] = nextBoard[r][c];
      nextBoard[r][c] = null;

      // Calculate Score
      moveScore += evaluateBoard(nextBoard, terrain, player, mode);

      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = { from: [r, c], to: [tr, tc], score: moveScore };
      }
    }
  }

  return bestMove;
};
