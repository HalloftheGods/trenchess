import { PIECES } from "@constants/pieces";
import { TERRAIN_TYPES } from "@constants/terrain";
import type { TerrainBlueprint } from "@tc.types";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;
const { MOUNTAINS, DESERT, FORESTS, SWAMPS } = TERRAIN_TYPES;

const COMMON_UNITS = [KING, QUEEN, PAWN];

export const TERRAIN_BLUEPRINTS: Record<string, TerrainBlueprint> = {
  [FORESTS]: {
    sanctuaryUnits: [...COMMON_UNITS, BISHOP],
    allowedUnits: [...COMMON_UNITS, BISHOP],
    blockedUnits: [ROOK, KNIGHT],
  },
  [SWAMPS]: {
    sanctuaryUnits: [...COMMON_UNITS, ROOK],
    allowedUnits: [...COMMON_UNITS, ROOK],
    blockedUnits: [BISHOP, KNIGHT],
  },
  [MOUNTAINS]: {
    sanctuaryUnits: [...COMMON_UNITS, KNIGHT],
    allowedUnits: [...COMMON_UNITS, KNIGHT],
    blockedUnits: [ROOK, BISHOP],
  },
  [DESERT]: {
    sanctuaryUnits: [],
    allowedUnits: [KING, QUEEN, BISHOP, KNIGHT, PAWN],
    blockedUnits: [ROOK],
  },
};
