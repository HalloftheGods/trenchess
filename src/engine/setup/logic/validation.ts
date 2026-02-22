import { PIECES } from "@engineConfigs/unitDetails";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import type { PieceType, TerrainType } from "@engineTypes/game";

export const canPlaceUnit = (
  unitType: PieceType,
  terrainType: TerrainType,
): boolean => {
  if (terrainType === TERRAIN_TYPES.DESERT && unitType !== PIECES.TANK)
    return false;
  if (unitType === PIECES.TANK && terrainType === TERRAIN_TYPES.TREES)
    return false;
  if (unitType === PIECES.HORSEMAN && terrainType === TERRAIN_TYPES.TREES)
    return false;
  if (unitType === PIECES.HORSEMAN && terrainType === TERRAIN_TYPES.PONDS)
    return false;
  if (unitType === PIECES.SNIPER && terrainType === TERRAIN_TYPES.PONDS)
    return false;
  if (unitType === PIECES.TANK && terrainType === TERRAIN_TYPES.RUBBLE)
    return false;
  if (unitType === PIECES.SNIPER && terrainType === TERRAIN_TYPES.RUBBLE)
    return false;
  return true;
};
