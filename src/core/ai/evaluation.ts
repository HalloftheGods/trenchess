import { BOARD_SIZE } from "@/constants";
import { PIECES } from "@/constants";
import { TERRAIN_TYPES, CORE_TERRAIN_INTEL } from "@/constants/terrain";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types/game";
import { isPlayerInCheck } from "@/core/mechanics/gameLogic";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;
const { FLAT, DESERT } = TERRAIN_TYPES;

export const SCORES: Record<string, number> = {
  [KING]: 100000,
  [QUEEN]: 900,
  [ROOK]: 500,
  [BISHOP]: 400,
  [KNIGHT]: 300,
  [PAWN]: 100,
};

const CENTER_WEIGHT = 10;
const KING_HUNT_WEIGHT = 20;
const SANCTUARY_BONUS = 30;
const DESERT_STRAND_PENALTY = 60;
const TERRAIN_SAFETY_BONUS = 15;
const DESERT_ENEMY_STRAND_BONUS = 25;

export const manhattanDistance = (
  r1: number,
  c1: number,
  r2: number,
  c2: number,
) => {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
};

export const hasCommander = (
  board: (BoardPiece | null)[][],
  player: string,
) => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.player === player && p.type === KING) {
        return { r, c };
      }
    }
  }
  return null;
};

const isTerrainSanctuary = (
  pieceType: string,
  terrainType: TerrainType,
): boolean => {
  const terrainIntel = CORE_TERRAIN_INTEL[terrainType];
  const hasIntel = !!terrainIntel;
  if (!hasIntel) return false;
  const isSanctuaryPiece = terrainIntel.sanctuaryUnits.includes(pieceType);
  return isSanctuaryPiece;
};

const isTerrainBlocking = (
  pieceType: string,
  terrainType: TerrainType,
): boolean => {
  const terrainIntel = CORE_TERRAIN_INTEL[terrainType];
  const hasIntel = !!terrainIntel;
  if (!hasIntel) return false;
  const hasBlockedUnits = !!terrainIntel.blockedUnits;
  if (!hasBlockedUnits) return false;
  const isPieceBlocked = terrainIntel.blockedUnits!.includes(pieceType);
  return isPieceBlocked;
};

const scoreTerrainPosition = (
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  maximizingPlayer: string,
): number => {
  let terrainScore = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const cellTerrain = terrain[r][c];
      const isFlat = cellTerrain === FLAT;
      if (isFlat) continue;

      const isOwnPiece = piece.player === maximizingPlayer;
      const isDesertTile = cellTerrain === DESERT;
      const pieceValue = SCORES[piece.type] || 100;
      const valueScale = pieceValue / 100;

      if (isOwnPiece) {
        if (isDesertTile) {
          terrainScore -= DESERT_STRAND_PENALTY * valueScale;
        }

        const hasSanctuary = isTerrainSanctuary(piece.type, cellTerrain);
        if (hasSanctuary) {
          terrainScore += SANCTUARY_BONUS * valueScale;
        }

        const hasNearbyProtection = hasTerrainShield(r, c, piece, terrain);
        if (hasNearbyProtection) {
          terrainScore += TERRAIN_SAFETY_BONUS;
        }
      } else {
        if (isDesertTile) {
          terrainScore += DESERT_ENEMY_STRAND_BONUS * valueScale;
        }

        const hasEnemySanctuary = isTerrainSanctuary(piece.type, cellTerrain);
        if (hasEnemySanctuary) {
          terrainScore -= SANCTUARY_BONUS * valueScale;
        }
      }
    }
  }

  return terrainScore;
};

const hasTerrainShield = (
  row: number,
  col: number,
  piece: BoardPiece,
  terrain: TerrainType[][],
): boolean => {
  const adjacentOffsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const hasShieldingTerrain = adjacentOffsets.some(([dr, dc]) => {
    const adjRow = row + dr;
    const adjCol = col + dc;

    const isRowInBounds = adjRow >= 0 && adjRow < BOARD_SIZE;
    const isColInBounds = adjCol >= 0 && adjCol < BOARD_SIZE;
    const isInBounds = isRowInBounds && isColInBounds;
    if (!isInBounds) return false;

    const adjTerrain = terrain[adjRow][adjCol];
    const isFlat = adjTerrain === FLAT;
    if (isFlat) return false;

    const blocksAttackers = isTerrainBlocking(piece.type, adjTerrain);
    return !blocksAttackers;
  });

  return hasShieldingTerrain;
};

export const evaluateBoard = (
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  maximizingPlayer: string,
  mode: GameMode,
): number => {
  let score = 0;

  const myKingPos = hasCommander(board, maximizingPlayer);
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

        const distToCenter =
          Math.abs(r - (BOARD_SIZE / 2 - 0.5)) +
          Math.abs(c - (BOARD_SIZE / 2 - 0.5));
        score += (BOARD_SIZE - distToCenter) * CENTER_WEIGHT;
      } else {
        enemyMaterial += value;
        if (piece.type === KING) {
          enemyKingPos = { r, c };
        }
      }
    }
  }

  score += myMaterial - enemyMaterial;

  if (!myKingPos) return -999999;
  if (!enemyKingPos) return 999999;

  score += scoreTerrainPosition(board, terrain, maximizingPlayer);

  const endgameWeight = Math.min(
    1.0,
    Math.max(0, (2000 - enemyMaterial) / 2000),
  );

  const hasMaterialAdvantage = myMaterial > enemyMaterial + 200;
  if (hasMaterialAdvantage && enemyKingPos) {
    const enemyKingDistToCenter =
      Math.abs(enemyKingPos.r - (BOARD_SIZE / 2 - 0.5)) +
      Math.abs(enemyKingPos.c - (BOARD_SIZE / 2 - 0.5));
    score += enemyKingDistToCenter * KING_HUNT_WEIGHT * 2 * endgameWeight;

    let distanceSum = 0;
    const addPieceDistance = (p: { r: number; c: number }) => {
      distanceSum += manhattanDistance(
        p.r,
        p.c,
        enemyKingPos!.r,
        enemyKingPos!.c,
      );
    };
    myPieces.forEach(addPieceDistance);
    score -= distanceSum * KING_HUNT_WEIGHT * endgameWeight;
  }

  const isInCheck = isPlayerInCheck(maximizingPlayer, board, terrain, mode);
  if (isInCheck) {
    score -= 50;
  }

  return score;
};
