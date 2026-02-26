import { useMemo } from "react";
import { TERRAIN_TYPES, MAX_TERRAIN_PER_PLAYER, INITIAL_ARMY } from "@constants";
import { getPlayerCells } from "@/core/setup/setupLogic";
import type { GameMode, TerrainType, PieceType } from "@/shared/types/game";

interface DeploymentMetricsProps {
  mode: GameMode;
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  activePlayers: string[];
  perspectivePlayerId: string;
}

export function useDeploymentMetrics({
  mode,
  terrain,
  inventory,
  activePlayers,
  perspectivePlayerId,
}: DeploymentMetricsProps) {
  const maxPlacement = useMemo(() => 
    activePlayers.length === 2
      ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
      : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER,
    [activePlayers.length]
  );

  const placedCount = useMemo(() => {
    if (!terrain || !terrain.length) return 0;
    const myCells = getPlayerCells(perspectivePlayerId, mode);
    let count = 0;
    for (const [r, c] of myCells) {
      if (terrain[r] && terrain[r][c] !== TERRAIN_TYPES.FLAT) count++;
    }
    return count;
  }, [terrain, mode, perspectivePlayerId]);

  const totalUnitCount = useMemo(() => 
    INITIAL_ARMY.reduce((sum, unit) => sum + unit.count, 0),
    []
  );

  const unitsPlaced = useMemo(() => 
    totalUnitCount - (inventory[perspectivePlayerId] || []).length,
    [inventory, perspectivePlayerId, totalUnitCount]
  );

  return { maxPlacement, placedCount, unitsPlaced, maxUnits: totalUnitCount };
}
