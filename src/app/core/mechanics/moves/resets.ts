import { INVALID_MOVE } from "boardgame.io/core";
import { resolvePlayerId } from "@/app/core/setup/coreHelpers";
import { getPlayerCells } from "@/app/core/setup/territory";
import { TERRAIN_TYPES } from "@constants/terrain";
import type { TrenchessState, TerrainType, PieceType } from "@tc.types";
import type { Ctx } from "boardgame.io";

/**
 * resetTerrain (Atom)
 * Clears all special terrain in a player's territory and returns it to their inventory.
 */
export const resetTerrain = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
  isGM?: boolean,
) => {
  const pids =
    isGM && !explicitPid
      ? G.activePlayers
      : ([resolvePlayerId(G, ctx, playerID, explicitPid, isGM)].filter(
          Boolean,
        ) as string[]);

  const noPlayersFound = pids.length === 0;
  if (noPlayersFound) return INVALID_MOVE;

  pids.forEach((playerId) => {
    const myCells = getPlayerCells(playerId, G.mode);
    const reclaimed: TerrainType[] = [];

    for (const [r, c] of myCells) {
      if (G.terrain[r][c] !== TERRAIN_TYPES.FLAT) {
        reclaimed.push(G.terrain[r][c]);
        G.terrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
      }
    }

    G.terrainInventory[playerId] = [
      ...(G.terrainInventory[playerId] || []),
      ...reclaimed,
    ];
  });
};

/**
 * resetUnits (Atom)
 * Clears all units in a player's territory and returns them to their inventory.
 */
export const resetUnits = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
  isGM?: boolean,
) => {
  const pids =
    isGM && !explicitPid
      ? G.activePlayers
      : ([resolvePlayerId(G, ctx, playerID, explicitPid, isGM)].filter(
          Boolean,
        ) as string[]);

  const noPlayersFound = pids.length === 0;
  if (noPlayersFound) return INVALID_MOVE;

  pids.forEach((playerId) => {
    const myCells = getPlayerCells(playerId, G.mode);
    const reclaimed: PieceType[] = [];

    for (const [r, c] of myCells) {
      const piece = G.board[r][c];
      if (piece && piece.player === playerId) {
        reclaimed.push(piece.type);
        G.board[r][c] = null;
      }
    }

    G.inventory[playerId] = [...(G.inventory[playerId] || []), ...reclaimed];
  });
};

/**
 * resetToOmega (Molecule)
 * Full reset of a player's field (Terrain + Units).
 */
export const resetToOmega = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
  isGM?: boolean,
) => {
  if (isGM && !explicitPid) {
    resetTerrain({ G, playerID, ctx }, undefined, true);
    resetUnits({ G, playerID, ctx }, undefined, true);
    return;
  }

  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid, isGM);
  if (!playerId) return INVALID_MOVE;

  // 1. Reset Terrain
  resetTerrain({ G, playerID, ctx }, explicitPid, isGM);

  // 2. Reset Units
  resetUnits({ G, playerID, ctx }, explicitPid, isGM);
};
