import { PIECES } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import type { PieceType, TerrainBlueprint } from "@/shared/types";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

const COMMON_UNITS = [KING, QUEEN, PAWN];

export const TERRAIN_BLUEPRINTS: Record<string, TerrainBlueprint> = {
  [TERRAIN_TYPES.FORESTS]: {
    sanctuaryUnits: [...COMMON_UNITS, BISHOP],
    allowedUnits: [...COMMON_UNITS, BISHOP],
    blockedUnits: [ROOK, KNIGHT],
  },
  [TERRAIN_TYPES.PONDS]: {
    sanctuaryUnits: [...COMMON_UNITS, ROOK],
    allowedUnits: [...COMMON_UNITS, ROOK],
    blockedUnits: [BISHOP, KNIGHT],
  },
  [TERRAIN_TYPES.RUBBLE]: {
    sanctuaryUnits: [...COMMON_UNITS, KNIGHT],
    allowedUnits: [...COMMON_UNITS, KNIGHT],
    blockedUnits: [ROOK, BISHOP],
  },
  [TERRAIN_TYPES.DESERT]: {
    sanctuaryUnits: [ROOK],
    allowedUnits: [ROOK],
    blockedUnits: [KING, QUEEN, BISHOP, KNIGHT, PAWN],
  },
};
