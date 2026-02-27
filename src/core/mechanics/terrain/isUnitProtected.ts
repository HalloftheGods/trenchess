import { CORE_TERRAIN_INTEL } from "@constants/terrain";
import type { PieceType, TerrainType } from "@/shared/types";

/**
 * isUnitProtected (Atom)
 * Checks if a unit type enjoys sanctuary protection on a specific terrain tile.
 */
export const isUnitProtected = (
  unitType: string,
  terrainType: TerrainType | string,
): boolean => {
  const terrainInfo = CORE_TERRAIN_INTEL[terrainType as string];
  const isSanctuaryUnit = terrainInfo?.sanctuaryUnits.includes(
    unitType as PieceType,
  );
  return !!isSanctuaryUnit;
};
