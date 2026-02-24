import { INVALID_MOVE } from "boardgame.io/core";
import { TERRAIN_TYPES } from "@/constants";
import { canPlaceUnit, getPlayerCells } from "@/core/setup/setupLogic";
import { resolvePlayerId, getQuota } from "@/core/setup/coreHelpers";
import type { TerrainType, TrenchessState, GameMode } from "@/shared/types";
import type { Ctx } from "boardgame.io";

const isWithinTerritory = (
  playerId: string,
  mode: GameMode,
  row: number,
  col: number,
): boolean => {
  const myCells = getPlayerCells(playerId, mode);
  
  const isTargetCellInMyCells = myCells.some(
    ([cellRow, cellCol]) => {
      const isRowMatch = cellRow === row;
      const isColMatch = cellCol === col;
      return isRowMatch && isColMatch;
    },
  );
  
  return isTargetCellInMyCells;
};

const countPlacedTerrain = (gameState: TrenchessState, playerId: string): number => {
  const myCells = getPlayerCells(playerId, gameState.mode);
  let currentTerrainCount = 0;
  
  for (const [row, col] of myCells) {
    const terrainAtCell = gameState.terrain[row][col];
    const isFlatTerrain = terrainAtCell === TERRAIN_TYPES.FLAT;
    const isSpecialTerrain = !isFlatTerrain;
    
    if (isSpecialTerrain) {
      currentTerrainCount++;
    }
  }
  
  return currentTerrainCount;
};

const handleRemoval = (
  gameState: TrenchessState,
  playerId: string,
  row: number,
  col: number,
) => {
  const currentTerrain = gameState.terrain[row][col];
  const isClearingExistingTerrain = currentTerrain !== TERRAIN_TYPES.FLAT;
  
  if (!isClearingExistingTerrain) return;

  gameState.terrainInventory[playerId].push(currentTerrain);
  gameState.terrain[row][col] = TERRAIN_TYPES.FLAT as TerrainType;
};

const handlePlacement = (
  gameState: TrenchessState,
  playerId: string,
  row: number,
  col: number,
  type: TerrainType,
) => {
  const unitAtCell = gameState.board[row][col];
  const isUnitAtCell = !!unitAtCell;
  const isCompatibleWithUnit = isUnitAtCell && canPlaceUnit(unitAtCell!.type, type);
  const isCellEmpty = !isUnitAtCell;
  
  const isPlacementAllowedByUnit = isCellEmpty || isCompatibleWithUnit;
  if (!isPlacementAllowedByUnit) return INVALID_MOVE;

  const playerTerrainInventory = gameState.terrainInventory[playerId];
  const terrainIndex = playerTerrainInventory?.indexOf(type);
  
  const isIndexValid = terrainIndex !== -1;
  const isInventoryExists = terrainIndex !== undefined;
  const isTerrainInInventory = isIndexValid && isInventoryExists;
  
  if (!isTerrainInInventory) return INVALID_MOVE;

  const quota = getQuota(gameState.mode);
  const currentTerrainCount = countPlacedTerrain(gameState, playerId);
  const isQuotaReached = currentTerrainCount >= quota;

  const currentTerrainAtCell = gameState.terrain[row][col];
  const isReplacingFlatTerrain = currentTerrainAtCell === TERRAIN_TYPES.FLAT;
  
  const isPlacementBlockedByQuota = isQuotaReached && isReplacingFlatTerrain;
  if (isPlacementBlockedByQuota) {
    return INVALID_MOVE;
  }

  const isReplacingExistingTerrain = !isReplacingFlatTerrain;
  if (isReplacingExistingTerrain) {
    gameState.terrainInventory[playerId].push(currentTerrainAtCell);
  }

  gameState.terrain[row][col] = type;
  gameState.terrainInventory[playerId].splice(terrainIndex, 1);
};

export const placeTerrain = (
  {
    G: gameState,
    playerID,
    ctx: context,
  }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  row: number,
  col: number,
  type: TerrainType,
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(gameState, context, playerID, explicitPid);
  const hasPlayerId = !!playerId;
  if (!hasPlayerId) return INVALID_MOVE;

  const isPlayerPlacingInOwnTerritory = isWithinTerritory(
    playerId!,
    gameState.mode,
    row,
    col,
  );
  if (!isPlayerPlacingInOwnTerritory) return INVALID_MOVE;

  const isClearingTerrain = type === TERRAIN_TYPES.FLAT;
  if (isClearingTerrain) {
    handleRemoval(gameState, playerId!, row, col);
    return;
  }

  const isPlacingTerrain = !isClearingTerrain;
  if (isPlacingTerrain) {
    return handlePlacement(gameState, playerId!, row, col, type);
  }
};
