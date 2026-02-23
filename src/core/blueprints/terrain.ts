import { TERRAIN_TYPES } from "@/core/primitives/terrain";
import { PIECES } from "@/core/primitives/pieces";
import type { TerrainType, PieceType } from "@/shared/types/game";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;
const { TREES, PONDS, RUBBLE, DESERT } = TERRAIN_TYPES;

const COMMON_UNITS = [KING.id, QUEEN.id, PAWN.id];
const getPieceId = (piece: (typeof PIECES)[keyof typeof PIECES]) => piece.id;
const ALL_UNITS = Object.values(PIECES).map(getPieceId);

export interface TerrainBlueprint {
  type: TerrainType;
  sanctuaryUnits: PieceType[];
  allowedUnits: PieceType[];
  blockedUnits: PieceType[];
}

export const TERRAIN_BLUEPRINTS: Record<string, TerrainBlueprint> = {
  [TREES]: {
    type: TREES as TerrainType,
    sanctuaryUnits: [...COMMON_UNITS, BISHOP.id],
    allowedUnits: [...COMMON_UNITS, BISHOP.id],
    blockedUnits: [ROOK.id, KNIGHT.id],
  },
  [PONDS]: {
    type: PONDS as TerrainType,
    sanctuaryUnits: [...COMMON_UNITS, ROOK.id],
    allowedUnits: [...COMMON_UNITS, ROOK.id],
    blockedUnits: [BISHOP.id, KNIGHT.id],
  },
  [RUBBLE]: {
    type: RUBBLE as TerrainType,
    sanctuaryUnits: [...COMMON_UNITS, KNIGHT.id],
    allowedUnits: [...COMMON_UNITS, KNIGHT.id],
    blockedUnits: [ROOK.id, BISHOP.id],
  },
  [DESERT]: {
    type: DESERT as TerrainType,
    sanctuaryUnits: [ROOK.id],
    allowedUnits: ALL_UNITS,
    blockedUnits: [],
  },
};
