import { INVALID_MOVE } from "boardgame.io/core";
import { resolvePlayerId } from "@/core/setup/coreHelpers";
import { getPlayerCells } from "@/core/setup/territory";
import { TERRAIN_TYPES } from "@/constants/terrain";
import { createInitialState } from "@/core/setup/initialization";
import type { TrenchessState } from "@/shared/types";
import type { Ctx } from "boardgame.io";

/**
 * resetTerrain (Atom)
 * Clears all special terrain in a player's territory and returns it to their inventory.
 */
export const resetTerrain = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  const myCells = getPlayerCells(playerId, G.mode);
  const reclaimed: any[] = [];

  for (const [r, c] of myCells) {
    if (G.terrain[r][c] !== TERRAIN_TYPES.FLAT) {
      reclaimed.push(G.terrain[r][c]);
      G.terrain[r][c] = TERRAIN_TYPES.FLAT as any;
    }
  }

  G.terrainInventory[playerId] = [
    ...(G.terrainInventory[playerId] || []),
    ...reclaimed,
  ];
};

/**
 * resetUnits (Atom)
 * Clears all units in a player's territory and returns them to their inventory.
 */
export const resetUnits = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  const myCells = getPlayerCells(playerId, G.mode);
  const reclaimed: any[] = [];

  for (const [r, c] of myCells) {
    const piece = G.board[r][c];
    if (piece && piece.player === playerId) {
      reclaimed.push(piece.type);
      G.board[r][c] = null;
    }
  }

  G.inventory[playerId] = [...(G.inventory[playerId] || []), ...reclaimed];
};

/**
 * resetToOmega (Molecule)
 * Full reset of a player's field (Terrain + Units).
 */
export const resetToOmega = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  // 1. Reset Terrain
  resetTerrain({ G, playerID, ctx }, explicitPid);
  
  // 2. Reset Units
  resetUnits({ G, playerID, ctx }, explicitPid);
};
