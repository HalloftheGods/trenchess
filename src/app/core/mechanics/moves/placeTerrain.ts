import { INVALID_MOVE } from "boardgame.io/core";
import { TERRAIN_TYPES } from "@constants";
import { canPlaceUnit, getCellOwner } from "@/app/core/setup/setupLogic";
import { resolvePlayerId, getQuota } from "@/app/core/setup/coreHelpers";
import { isWithinTerritory } from "./base/territory";
import { getPlayerCells } from "@/app/core/setup/territory";
import type { TerrainType, TrenchessState } from "@tc.types";
import type { Ctx } from "boardgame.io";

const countPlacedTerrain = (
  gameState: TrenchessState,
  playerId: string,
): number => {
  const myCells = getPlayerCells(playerId, gameState.mode);
  let currentTerrainCount = 0;

  for (const [row, col] of myCells) {
    const isSpecialTerrain = gameState.terrain[row][col] !== TERRAIN_TYPES.FLAT;
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
  if (currentTerrain === TERRAIN_TYPES.FLAT) return;

  gameState.terrainInventory[playerId].push(currentTerrain);
  gameState.terrain[row][col] = TERRAIN_TYPES.FLAT as TerrainType;
};

const handlePlacement = (
  gameState: TrenchessState,
  playerId: string,
  row: number,
  col: number,
  type: TerrainType,
  isGM?: boolean,
) => {
  const unitAtCell = gameState.board[row][col];
  const isCompatibleWithUnit =
    !unitAtCell || canPlaceUnit(unitAtCell.type, type);

  if (!isCompatibleWithUnit && !isGM) return INVALID_MOVE;

  const playerTerrainInventory = gameState.terrainInventory[playerId];
  const terrainIndex = playerTerrainInventory?.indexOf(type);
  const isTerrainInInventory =
    terrainIndex !== -1 && terrainIndex !== undefined;

  if (!isGM && !isTerrainInInventory) return INVALID_MOVE;

  const quota = getQuota(gameState.mode);
  const currentTerrainCount = countPlacedTerrain(gameState, playerId);
  const isQuotaReached = currentTerrainCount >= quota;

  const currentTerrainAtCell = gameState.terrain[row][col];
  const isReplacingFlatTerrain = currentTerrainAtCell === TERRAIN_TYPES.FLAT;

  if (!isGM && isQuotaReached && isReplacingFlatTerrain) {
    return INVALID_MOVE;
  }

  if (!isReplacingFlatTerrain && !isGM) {
    gameState.terrainInventory[playerId].push(currentTerrainAtCell);
  }

  gameState.terrain[row][col] = type;

  if (!isGM && isTerrainInInventory) {
    gameState.terrainInventory[playerId].splice(terrainIndex, 1);
  }
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
  isGM?: boolean,
) => {
  let playerId = resolvePlayerId(
    gameState,
    context,
    playerID,
    explicitPid,
    isGM,
  );

  if (isGM) {
    const cellOwner = getCellOwner(row, col, gameState.mode);
    if (cellOwner) {
      playerId = cellOwner;
    }
  }

  if (!playerId) return INVALID_MOVE;

  const isPlayerPlacingInOwnTerritory = isWithinTerritory(
    playerId,
    gameState.mode,
    [row, col],
  );

  if (!isGM && !isPlayerPlacingInOwnTerritory) return INVALID_MOVE;

  if (type === TERRAIN_TYPES.FLAT) {
    handleRemoval(gameState, playerId, row, col);
    return;
  }

  return handlePlacement(gameState, playerId, row, col, type, isGM);
};
