import { INVALID_MOVE } from "boardgame.io/core";
import { TERRAIN_TYPES, MAX_TERRAIN_PER_PLAYER } from "@/constants";
import { canPlaceUnit, getPlayerCells } from "@/core/setup/setupLogic";
import type { TerrainType, TrenchessState, GameMode } from "@/shared/types";
import type { Ctx } from "boardgame.io";

const resolvePlayerId = (
  G: TrenchessState,
  ctx: Ctx,
  playerID?: string,
  explicitPid?: string
): string | null => {
  const pid = explicitPid || (playerID !== undefined ? G.playerMap[playerID] : G.playerMap[ctx.currentPlayer]);
  return pid && G.activePlayers.includes(pid) ? pid : null;
};

const isWithinTerritory = (
  pid: string,
  mode: GameMode,
  r: number,
  c: number
): boolean => {
  const myCells = getPlayerCells(pid, mode);
  return myCells.some(([cellR, cellC]) => cellR === r && cellC === c);
};

const getTerrainQuota = (mode: GameMode): number => {
  return mode === "2p-ns" || mode === "2p-ew"
    ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
    : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
};

const countPlacedTerrain = (G: TrenchessState, pid: string): number => {
  const myCells = getPlayerCells(pid, G.mode);
  let count = 0;
  for (const [r, c] of myCells) {
    if (G.terrain[r][c] !== TERRAIN_TYPES.FLAT) count++;
  }
  return count;
};

export const placeTerrain = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  r: number,
  c: number,
  type: TerrainType,
  explicitPid?: string,
) => {
  const pid = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!pid) return INVALID_MOVE;

  if (!isWithinTerritory(pid, G.mode, r, c)) return INVALID_MOVE;

  const oldTerrain = G.terrain[r][c];

  // 1. Remove/Reclaim Atom
  if (type === TERRAIN_TYPES.FLAT) {
    if (oldTerrain !== TERRAIN_TYPES.FLAT) {
      G.terrainInventory[pid].push(oldTerrain);
      G.terrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
    }
    return;
  }

  // 2. Validate Placement Atom (Unit overlap & Quota)
  const unit = G.board[r][c];
  if (unit && !canPlaceUnit(unit.type, type)) return INVALID_MOVE;

  const idx = G.terrainInventory[pid]?.indexOf(type);
  if (idx === -1 || idx === undefined) return INVALID_MOVE;

  const quota = getTerrainQuota(G.mode);
  const currentCount = countPlacedTerrain(G, pid);

  if (currentCount >= quota && oldTerrain === TERRAIN_TYPES.FLAT) {
    return INVALID_MOVE;
  }

  // 3. Swap Atom
  if (oldTerrain !== TERRAIN_TYPES.FLAT) {
    G.terrainInventory[pid].push(oldTerrain);
  }

  G.terrain[r][c] = type;
  G.terrainInventory[pid].splice(idx, 1);
};
