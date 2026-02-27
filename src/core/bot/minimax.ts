import { BOARD_SIZE } from "@constants";
import { TERRAIN_TYPES, CORE_TERRAIN_INTEL } from "@constants/terrain";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types/game";
import { getValidMoves } from "@/core/mechanics";
import { isPlayerInCheck } from "@/core/mechanics";
import { SCORES, hasCommander, evaluateBoard } from "@/core/bot/evaluation";

const { DESERT } = TERRAIN_TYPES;

const DESERT_MOVE_PENALTY = -30;
const SANCTUARY_MOVE_BONUS = 20;
const DESERT_CAPTURE_BONUS = 40;
const ESCAPE_DESERT_BONUS = 25;

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

          const targetPiece = board[tr][tc];
          const isCapture = !!targetPiece;
          if (isCapture) {
            moveScore =
              10 * (SCORES[targetPiece!.type] || 0) - (SCORES[piece.type] || 0);
          }

          const destinationTerrain = terrain[tr][tc];
          const originTerrain = terrain[r][c];

          const isMovingToDesert = destinationTerrain === DESERT;
          if (isMovingToDesert) {
            moveScore += DESERT_MOVE_PENALTY;
          }

          const isCapturingOnDesert = isCapture && isMovingToDesert;
          if (isCapturingOnDesert) {
            moveScore += DESERT_CAPTURE_BONUS;
          }

          const isEscapingDesert =
            originTerrain === DESERT && destinationTerrain !== DESERT;
          if (isEscapingDesert) {
            moveScore += ESCAPE_DESERT_BONUS;
          }

          const terrainIntel = CORE_TERRAIN_INTEL[destinationTerrain];
          const hasSanctuary = !!terrainIntel?.sanctuaryUnits?.includes(
            piece.type,
          );
          if (hasSanctuary) {
            moveScore += SANCTUARY_MOVE_BONUS;
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

  const sortByScore = (a: { score: number }, b: { score: number }) =>
    b.score + Math.random() - (a.score + Math.random());
  allMoves.sort(sortByScore);

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

      // Desert Rule Simulation: After move, other pieces on desert perish
      for (let dr = 0; dr < BOARD_SIZE; dr++) {
        for (let dc = 0; dc < BOARD_SIZE; dc++) {
          const p = nextBoard[dr][dc];
          if (
            p &&
            p.player === currentPlayer &&
            terrain[dr][dc] === DESERT &&
            (dr !== move.to[0] || dc !== move.to[1])
          ) {
            nextBoard[dr][dc] = null;
          }
        }
      }

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

      // Desert Rule Simulation: After move, other pieces on desert perish
      for (let dr = 0; dr < BOARD_SIZE; dr++) {
        for (let dc = 0; dc < BOARD_SIZE; dc++) {
          const p = nextBoard[dr][dc];
          if (
            p &&
            p.player === currentPlayer &&
            terrain[dr][dc] === DESERT &&
            (dr !== move.to[0] || dc !== move.to[1])
          ) {
            nextBoard[dr][dc] = null;
          }
        }
      }

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
