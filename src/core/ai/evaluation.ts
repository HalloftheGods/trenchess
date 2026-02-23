import { BOARD_SIZE } from "@/core/primitives/game";
import { PIECES } from "@/core/primitives/pieces";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types/game";
import { isPlayerInCheck } from "@/core/mechanics/gameState";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

// --- Heuristic Weights ---
export const SCORES: Record<string, number> = {
  [KING.id]: 100000,
  [QUEEN.id]: 900,
  [ROOK.id]: 500,
  [BISHOP.id]: 400,
  [KNIGHT.id]: 300,
  [PAWN.id]: 100,
};

const CENTER_WEIGHT = 10;
const KING_HUNT_WEIGHT = 20;

// Helper: Calculate Manhattan Distance
export const manhattanDistance = (
  r1: number,
  c1: number,
  r2: number,
  c2: number,
) => {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
};

// Helper: Check if game is essentially won/lost
export const hasCommander = (
  board: (BoardPiece | null)[][],
  player: string,
) => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.player === player && p.type === KING.id) {
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
        if (piece.type === KING.id) {
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

  // King Hunting Heuristic
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

  // Check penalty
  if (isPlayerInCheck(maximizingPlayer, board, terrain, mode)) {
    score -= 50;
  }

  return score;
};
