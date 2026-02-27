import { TERRAIN_TYPES, CORE_TERRAIN_INTEL } from "@constants/terrain";
import type { PieceType, TerrainType } from "@/shared/types";

/**
 * canUnitTraverseTerrain (Molecule)
 * Checks whether a unit type can traverse a given terrain type
 * using the authoritative CORE_TERRAIN_INTEL data.
 */
export function canUnitTraverseTerrain(
  unitType: PieceType,
  terrainType: TerrainType,
): boolean {
  const isFlatTerrain = terrainType === TERRAIN_TYPES.FLAT;
  if (isFlatTerrain) return true;

  const terrainIntel = CORE_TERRAIN_INTEL[terrainType];
  const isAllowedOnTerrain = terrainIntel?.allowedUnits.includes(unitType);

  return !!isAllowedOnTerrain;
}
