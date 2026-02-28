import { TERRAIN_TYPES } from "@constants";
import type { PieceType, TerrainType } from "@tc.types";
import { canUnitTraverseTerrain } from "./canUnitTraverseTerrain";

/**
 * getTraversableTerrains (Molecule)
 */
export function getTraversableTerrains(unitType: PieceType): TerrainType[] {
  const allTerrainTypes: TerrainType[] = [
    TERRAIN_TYPES.FORESTS as TerrainType,
    TERRAIN_TYPES.SWAMPS as TerrainType,
    TERRAIN_TYPES.MOUNTAINS as TerrainType,
    TERRAIN_TYPES.DESERT as TerrainType,
  ];

  const matchByUnitTraversability = (terrain: TerrainType) =>
    canUnitTraverseTerrain(unitType, terrain);
  return allTerrainTypes.filter(matchByUnitTraversability);
}
