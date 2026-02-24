import { PIECES } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import type { PieceType, TerrainType } from "@/shared/types/game";

export const canPlaceUnit = (
  unitType: PieceType,
  terrainType: TerrainType,
): boolean => {
  if (terrainType === TERRAIN_TYPES.DESERT && unitType !== PIECES.ROOK)
    return false;
  if (unitType === PIECES.ROOK && terrainType === TERRAIN_TYPES.TREES)
    return false;
  if (unitType === PIECES.KNIGHT && terrainType === TERRAIN_TYPES.TREES)
    return false;
  if (unitType === PIECES.KNIGHT && terrainType === TERRAIN_TYPES.PONDS)
    return false;
  if (unitType === PIECES.BISHOP && terrainType === TERRAIN_TYPES.PONDS)
    return false;
  if (unitType === PIECES.ROOK && terrainType === TERRAIN_TYPES.RUBBLE)
    return false;
  if (unitType === PIECES.BISHOP && terrainType === TERRAIN_TYPES.RUBBLE)
    return false;
  return true;
};
