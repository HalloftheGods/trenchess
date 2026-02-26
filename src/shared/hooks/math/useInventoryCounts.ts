import { useMemo } from "react";
import { INITIAL_ARMY, TERRAIN_TYPES, TERRAIN_INTEL } from "@constants";
import type { PieceType, TerrainType } from "@/shared/types/game";

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
  const units = useMemo(() => {
    const counts: Record<string, number> = {};
    const playerInventory = inventory[perspectivePlayerId] || [];
    INITIAL_ARMY.forEach((unit) => {
      counts[unit.type] = playerInventory.filter((type) => type === unit.type).length;
    });
    return counts;
  }, [inventory, perspectivePlayerId]);

  const terrain = useMemo(() => {
    const counts: Record<string, number> = {};
    const terrainTypesToCount = [
      TERRAIN_TYPES.FORESTS,
      TERRAIN_TYPES.SWAMPS,
      TERRAIN_TYPES.MOUNTAINS,
      TERRAIN_TYPES.DESERT,
    ];
    const playerTerrainInventory = terrainInventory[perspectivePlayerId] || [];
    terrainTypesToCount.forEach((terrainType) => {
      const label = (TERRAIN_INTEL[terrainType]?.label as string) || terrainType;
      counts[label] = playerTerrainInventory.filter((type) => type === terrainType).length;
    });
    return counts;
  }, [terrainInventory, perspectivePlayerId]);

  return { units, terrain };
}
