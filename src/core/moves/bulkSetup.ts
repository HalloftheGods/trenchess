import { INVALID_MOVE } from "boardgame.io/core";
import { resolvePlayerId } from "@/core/setup/coreHelpers";
import {
  randomizeTerrain as randomizeTerrainLogic,
  randomizeUnits as randomizeUnitsLogic,
  generateElementalTerrain as generateElementalTerrainLogic,
} from "@/core/setup/randomization";
import { applyClassicalFormation as applyClassicalFormationLogic } from "@/core/setup/formations";
import { createInitialState } from "@/core/setup/initialization";
import { getPlayerCells } from "@/core/setup/territory";
import { TERRAIN_TYPES } from "@/constants/terrain";
import { DEFAULT_SEEDS } from "@/core/setup/seeds";
import { deserializeGame, adaptSeedToMode } from "@/shared/utils/serialization";
import type { TrenchessState } from "@/shared/types";
import type { Ctx } from "boardgame.io";

export const randomizeTerrain = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  const result = randomizeTerrainLogic(G.terrain, G.board, G.terrainInventory, [playerId], G.mode, undefined, ctx.random);
  G.terrain = result.terrain;
  G.terrainInventory = result.terrainInventory;
};

export const randomizeUnits = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  // Random Mode Logic: Choose between intelligent random placement OR a structured formation
  const strategy = ctx.random?.Number() || Math.random();
  
  if (strategy < 0.4) {
    // 40% chance: Pure intelligent randomization
    const result = randomizeUnitsLogic(G.board, G.terrain, G.inventory, [playerId], G.mode, ctx.random);
    G.board = result.board;
    G.inventory = result.inventory;
  } else {
    // 60% chance: Pick a tactical formation
    const formations: ("classical" | "vanguard" | "fortress" | "skirmish")[] = 
      ["classical", "vanguard", "fortress", "skirmish"];
    const formation = formations[Math.floor((ctx.random?.Number() || Math.random()) * formations.length)];
    
    const result = applyClassicalFormationLogic(
      G.board, 
      G.terrain, 
      G.inventory, 
      G.terrainInventory, 
      [playerId], 
      G.mode, 
      formation
    );
    G.board = result.board;
    G.inventory = result.inventory;
  }
};

export const setClassicalFormation = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  // Pi Mode: Standard formation + ALWAYS 16 terrain tiles
  const terrainResult = randomizeTerrainLogic(G.terrain, G.board, G.terrainInventory, [playerId], G.mode, 16, ctx.random);
  const result = applyClassicalFormationLogic(G.board, terrainResult.terrain, G.inventory, terrainResult.terrainInventory, [playerId], G.mode, "classical");
  G.board = result.board;
  G.terrain = result.terrain;
  G.inventory = result.inventory;
  G.terrainInventory = result.terrainInventory;
};

export const applyChiGarden = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  // 1. Select a random layout from the library
  const modeSeeds = DEFAULT_SEEDS.filter((s) => s.mode === G.mode);
  const randVal = ctx.random?.Number() || Math.random();
  const seedToUse = modeSeeds.length > 0 
    ? modeSeeds[Math.floor(randVal * modeSeeds.length)].seed 
    : DEFAULT_SEEDS[0].seed;

  const decoded = deserializeGame(seedToUse);
  if (decoded) {
    const adapted = adaptSeedToMode(decoded, G.mode);
    const myCells = getPlayerCells(playerId, G.mode);
    
    // Check if the configuration has any pieces for this player
    let seedHasUnits = false;
    for (const [r, c] of myCells) {
      if (adapted.board[r][c]) {
        seedHasUnits = true;
        break;
      }
    }

    // 2. Apply Terrain + Units (only if units are present in the 'Garden' build)
    for (const [r, c] of myCells) {
      G.terrain[r][c] = adapted.terrain[r][c];
      if (seedHasUnits) {
        G.board[r][c] = adapted.board[r][c];
      } else {
        // Clear board if it's a pure garden so user can deploy
        G.board[r][c] = null;
      }
    }
    
    if (seedHasUnits) {
      G.inventory[playerId] = [];
    } else {
      // Re-populate inventory for manual deployment in the new garden
      const { INITIAL_ARMY: army } = require("@/core/setup/seeds");
      const fullArmy: string[] = [];
      army.forEach((u: any) => {
        for(let i=0; i<u.count; i++) fullArmy.push(u.type);
      });
      G.inventory[playerId] = fullArmy;
    }
    G.terrainInventory[playerId] = [];
  }
};

export const resetToOmega = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  // We only reset the player's own area
  const emptyState = createInitialState(G.mode, [playerId]);
  const myCells = getPlayerCells(playerId, G.mode);
  
  for (const [r, c] of myCells) {
    G.board[r][c] = null;
    G.terrain[r][c] = TERRAIN_TYPES.FLAT as any;
  }
  
  G.inventory[playerId] = [...emptyState.inventory[playerId]];
  G.terrainInventory[playerId] = [...emptyState.terrainInventory[playerId]];
};
