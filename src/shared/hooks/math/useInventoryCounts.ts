import { INITIAL_ARMY, TERRAIN_TYPES, TERRAIN_INTEL } from "@constants";
import type { PieceType, TerrainType } from "@tc.types/game";

interface InventoryCountsProps {
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  perspectivePlayerId: string;
}

export function useInventoryCounts({
  inventory,
  terrainInventory,
  perspectivePlayerId,
}: InventoryCountsProps) {
  // Derived inline for zero-lag synchronization with engine state
  const units: Record<string, number> = {};
  const playerInventory = inventory[perspectivePlayerId] || [];
  INITIAL_ARMY.forEach((unit) => {
    units[unit.type] = playerInventory.filter(
      (type) => type === unit.type,
    ).length;
  });

  const terrain: Record<string, number> = {};
  const terrainTypesToCount = [
    TERRAIN_TYPES.FORESTS,
    TERRAIN_TYPES.SWAMPS,
    TERRAIN_TYPES.MOUNTAINS,
    TERRAIN_TYPES.DESERT,
  ];
  const playerTerrainInventory = terrainInventory[perspectivePlayerId] || [];
  terrainTypesToCount.forEach((terrainType) => {
    const label = (TERRAIN_INTEL[terrainType]?.label as string) || terrainType;
    terrain[label] = playerTerrainInventory.filter(
      (type) => type === terrainType,
    ).length;
  });

  return { units, terrain };
}
