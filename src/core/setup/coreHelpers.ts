import { MAX_TERRAIN_PER_PLAYER, TERRAIN_TYPES } from "@/constants";
import type { GameMode, PieceType, TerrainType } from "@/shared/types";
import { getPlayerCells } from "./territory";

export const getPlayersForMode = (m: GameMode) =>
  m === "2p-ns"
    ? ["red", "blue"]
    : m === "2p-ew"
      ? ["green", "yellow"]
      : ["red", "yellow", "green", "blue"];

export const getQuota = (m: GameMode) => {
  return m === "2p-ns" || m === "2p-ew"
    ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
    : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
};

export const isPlayerReadyToPlay = (
  p: string,
  mode: GameMode,
  terrain: TerrainType[][],
  inventory: Record<string, PieceType[]>,
): boolean => {
  if (!terrain || terrain.length === 0) return false;

  const unitsPlaced = (inventory[p] || []).length === 0;

  const myCells = getPlayerCells(p, mode);
  let terrainCount = 0;
  for (const [r, c] of myCells) {
    if (terrain[r] && terrain[r][c] !== TERRAIN_TYPES.FLAT) terrainCount++;
  }

  const targetTerrain = getQuota(mode);
  const terrainPlaced = terrainCount >= targetTerrain;

  return unitsPlaced && terrainPlaced;
};
