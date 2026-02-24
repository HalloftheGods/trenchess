import { INVALID_MOVE } from "boardgame.io/core";
import { TERRAIN_TYPES, MAX_TERRAIN_PER_PLAYER } from "@/constants";
import { canPlaceUnit, getPlayerCells } from "@/core/setup/setupLogic";
import type { TerrainType, TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export const placeTerrain = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  r: number,
  c: number,
  type: TerrainType,
  explicitPid?: string,
) => {
  const pid =
    explicitPid ||
    (playerID !== undefined
      ? G.playerMap[playerID]
      : G.playerMap[ctx.currentPlayer]);
  if (!pid || !G.activePlayers.includes(pid)) return INVALID_MOVE;

  const myCells = getPlayerCells(pid, G.mode);
  if (!myCells.some(([cellR, cellC]) => cellR === r && cellC === c)) {
    return INVALID_MOVE;
  }

  const oldTerrain = G.terrain[r][c];

  if (type === TERRAIN_TYPES.FLAT) {
    if (oldTerrain !== TERRAIN_TYPES.FLAT) {
      G.terrainInventory[pid].push(oldTerrain);
      G.terrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
    }
    return;
  }

  const unit = G.board[r][c];
  if (unit && !canPlaceUnit(unit.type, type)) return INVALID_MOVE;

  const idx = G.terrainInventory[pid]?.indexOf(type);
  if (idx === -1 || idx === undefined) return INVALID_MOVE;

  const isTwoPlayer = G.mode === "2p-ns" || G.mode === "2p-ew";
  const quota = isTwoPlayer
    ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
    : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  let currentCount = 0;
  for (const [cellR, cellC] of myCells) {
    if (G.terrain[cellR][cellC] !== TERRAIN_TYPES.FLAT) currentCount++;
  }

  if (currentCount >= quota && G.terrain[r][c] === TERRAIN_TYPES.FLAT) {
    return INVALID_MOVE;
  }

  if (oldTerrain !== TERRAIN_TYPES.FLAT) {
    G.terrainInventory[pid].push(oldTerrain);
  }

  G.terrain[r][c] = type;
  G.terrainInventory[pid].splice(idx, 1);
};
