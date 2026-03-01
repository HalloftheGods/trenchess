import {
  TERRAIN_TYPES,
  MAX_TERRAIN_PER_PLAYER,
  INITIAL_ARMY,
} from "@constants";
import { getPlayerCells } from "@/app/core/setup/setupLogic";
import type { GameMode, TerrainType, PieceType } from "@tc.types/game";

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
  // Derived inline for zero-lag synchronization with engine state
  const maxPlacement =
    activePlayers.length === 2
      ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
      : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  let placedCount = 0;
  if (terrain && terrain.length) {
    const myCells = getPlayerCells(perspectivePlayerId, mode);
    for (const [r, c] of myCells) {
      if (terrain[r] && terrain[r][c] !== TERRAIN_TYPES.FLAT) placedCount++;
    }
  }

  const totalUnitCount = INITIAL_ARMY.reduce(
    (sum, unit) => sum + unit.count,
    0,
  );
  const unitsPlaced =
    totalUnitCount - (inventory[perspectivePlayerId] || []).length;
  const isAllPlaced =
    unitsPlaced === totalUnitCount && placedCount === maxPlacement;

  return {
    maxPlacement,
    placedCount,
    unitsPlaced,
    maxUnits: totalUnitCount,
    isAllPlaced,
  };
}
