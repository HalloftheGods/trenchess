import { MAX_TERRAIN_PER_PLAYER, TERRAIN_TYPES } from "@constants";
import type {
  GameMode,
  PieceType,
  TerrainType,
  TrenchessState,
} from "@/shared/types";
import type { Ctx } from "boardgame.io";
import { getPlayerCells } from "./territory";

export const getQuota = (mode: GameMode) => {
  const isTwoPlayer = mode === "2p-ns" || mode === "2p-ew";
  return isTwoPlayer
    ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
    : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
};

export const resolvePlayerId = (
  G: TrenchessState,
  ctx: Ctx,
  playerID?: string,
  explicitPid?: string,
): string | null => {
  const pid =
    explicitPid ||
    (playerID !== undefined
      ? G.playerMap[playerID]
      : G.playerMap[ctx.currentPlayer]);

  const isActive = pid && G.activePlayers.includes(pid);
  return isActive ? pid : null;
};

export const isPlayerReadyToPlay = (
  player: string,
  mode: GameMode,
  terrain: TerrainType[][],
  inventory: Record<string, PieceType[]>,
): boolean => {
  if (!terrain || terrain.length === 0) return false;

  const unitsPlaced = (inventory[player] || []).length === 0;

  const myCells = getPlayerCells(player, mode);
  let terrainCount = 0;
  for (const [row, col] of myCells) {
    if (terrain[row] && terrain[row][col] !== TERRAIN_TYPES.FLAT)
      terrainCount++;
  }

  const targetTerrain = getQuota(mode);
  const terrainPlaced = terrainCount >= targetTerrain;

  return unitsPlaced && terrainPlaced;
};
