import { getPlayerCells, getPlayersForMode } from "@/core/setup/territory";
import { canPlaceUnit } from "@/core/setup/validation";
import { TERRAIN_TYPES, INITIAL_ARMY } from "@constants";
import { DEFAULT_SEEDS } from "@/core/setup/seeds";
import { deserializeGame, adaptSeedToMode } from "@/shared/utils/serialization";
import type {
  TrenchessState,
  TerrainType,
  PieceType,
  GameMode,
} from "@/shared/types";
import type { Ctx } from "boardgame.io";
import { resolvePlayerId } from "@/core/setup/coreHelpers";
import { INVALID_MOVE } from "boardgame.io/core";
import {
  randomizeTerrain as randomizeTerrainLogic,
  randomizeUnits as randomizeUnitsLogic,
} from "@/core/setup/randomization";
import { applyClassicalFormation as applyClassicalFormationLogic } from "@/core/setup/formations";

interface RandomAPI {
  Number: () => number;
  Die: (n: number) => number;
  Shuffle: <T>(array: T[]) => T[];
}

export const setMode = ({ G }: { G: TrenchessState }, mode: GameMode) => {
  G.mode = mode;
  G.activePlayers = getPlayersForMode(mode);
};

export const mirrorBoard = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  const source = playerId;
  let target = "";
  if (G.mode === "2p-ns") target = source === "red" ? "blue" : "red";
  else if (G.mode === "2p-ew") target = source === "green" ? "yellow" : "green";
  else {
    if (source === "red") target = "blue";
    else if (source === "blue") target = "red";
    else if (source === "yellow") target = "green";
    else if (source === "green") target = "yellow";
  }
  if (!target) return INVALID_MOVE;

  const sourceCells = getPlayerCells(source, G.mode);
  const targetCells = getPlayerCells(target, G.mode);

  // Clear target cells first
  for (const [r, c] of targetCells) {
    G.board[r][c] = null;
    G.terrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
  }

  // Mirror source to target
  for (const [r, c] of sourceCells) {
    const piece = G.board[r][c];
    const terr = G.terrain[r][c];
    const tr = 11 - r;
    const tc = 11 - c;
    if (tr >= 0 && tr < 12 && tc >= 0 && tc < 12) {
      G.terrain[tr][tc] = terr;
      if (piece) G.board[tr][tc] = { ...piece, player: target };
    }
  }

  // Update inventories
  const updateInventoryForPlayer = (p: string) => {
    const placedUnits: Record<string, number> = {};
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        const piece = G.board[r][c];
        if (piece && piece.player === p)
          placedUnits[piece.type] = (placedUnits[piece.type] || 0) + 1;
      }
    }
    const missingUnits: PieceType[] = [];
    INITIAL_ARMY.forEach((u) => {
      const count = placedUnits[u.type] || 0;
      const missing = u.count - count;
      if (missing > 0) {
        for (let i = 0; i < missing; i++) missingUnits.push(u.type);
      }
    });
    return missingUnits;
  };

  G.inventory[source] = updateInventoryForPlayer(source);
  G.inventory[target] = updateInventoryForPlayer(target);
};

export const randomizeTerrain = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  const random = (ctx as unknown as { random: RandomAPI }).random;

  const result = randomizeTerrainLogic(
    G.terrain,
    G.board,
    G.terrainInventory,
    [playerId],
    G.mode,
    undefined,
    random,
  );
  G.terrain = result.terrain;
  G.terrainInventory = result.terrainInventory;
};

export const randomizeUnits = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!playerId) return INVALID_MOVE;

  const random = (ctx as unknown as { random: RandomAPI }).random;

  // Random Mode Logic: Choose between intelligent random placement OR a structured formation
  const strategy = random?.Number() || Math.random();

  if (strategy < 0.4) {
    // 40% chance: Pure intelligent randomization
    const result = randomizeUnitsLogic(
      G.board,
      G.terrain,
      G.inventory,
      [playerId],
      G.mode,
      random,
    );
    G.board = result.board;
    G.inventory = result.inventory;
  } else {
    // 60% chance: Pick a tactical formation
    const formations: ("classical" | "vanguard" | "fortress" | "skirmish")[] = [
      "classical",
      "vanguard",
      "fortress",
      "skirmish",
    ];
    const formation =
      formations[
        Math.floor((random?.Number() || Math.random()) * formations.length)
      ];

    const result = applyClassicalFormationLogic(
      G.board,
      G.terrain,
      G.inventory,
      G.terrainInventory,
      [playerId],
      G.mode,
      formation,
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

  const random = (ctx as unknown as { random: RandomAPI }).random;

  // Pi Mode: Standard formation + ALWAYS 16 terrain tiles
  const terrainResult = randomizeTerrainLogic(
    G.terrain,
    G.board,
    G.terrainInventory,
    [playerId],
    G.mode,
    16,
    random,
  );
  const result = applyClassicalFormationLogic(
    G.board,
    terrainResult.terrain,
    G.inventory,
    terrainResult.terrainInventory,
    [playerId],
    G.mode,
    "classical",
  );
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

  const random = (ctx as unknown as { random: RandomAPI }).random;

  // 1. Select a random layout from the library
  const modeSeeds = DEFAULT_SEEDS.filter((s) => s.mode === G.mode);
  const randVal = random?.Number() || Math.random();
  const seedToUse =
    modeSeeds.length > 0
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

    // 2. Apply Terrain + Units (Units only if present in build)
    for (const [r, c] of myCells) {
      const newTerrain = adapted.terrain[r][c];
      const existingPiece = G.board[r][c];

      // If seed has units, we overwrite everything in our territory
      if (seedHasUnits) {
        G.terrain[r][c] = newTerrain;
        G.board[r][c] = adapted.board[r][c];
      } else {
        // Garden Logic: Preserve existing pieces if compatible, otherwise clear tile
        if (existingPiece && !canPlaceUnit(existingPiece.type, newTerrain)) {
          G.terrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
        } else {
          G.terrain[r][c] = newTerrain;
        }
      }
    }

    if (seedHasUnits) {
      G.inventory[playerId] = [];
    }
    G.terrainInventory[playerId] = [];
  }
};
