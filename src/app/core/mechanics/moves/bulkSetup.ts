import { getPlayerCells, getPlayersForMode } from "@/app/core/setup/territory";
import { canPlaceUnit } from "@/app/core/setup/validation";
import { TERRAIN_TYPES, INITIAL_ARMY } from "@constants";
import { DEFAULT_SEEDS } from "@/app/core/setup/seeds";
import {
  deserializeGame,
  adaptSeedToMode,
} from "@/shared/utilities/serialization";
import type { TrenchessState, TerrainType, PieceType, GameMode } from "@tc.types";
import type { Ctx } from "boardgame.io";
import { resolvePlayerId } from "@/app/core/setup/coreHelpers";
import { INVALID_MOVE } from "boardgame.io/core";
import {
  randomizeTerrain as randomizeTerrainLogic,
  randomizeUnits as randomizeUnitsLogic,
} from "@/app/core/setup/randomization";
import { applyClassicalFormation as applyClassicalFormationLogic } from "@/app/core/setup/formations";
import M from "./base/move";

import { createInitialState } from "@/app/core/setup/setupLogic";

export const setMode = ({ G }: { G: TrenchessState }, mode: GameMode) => {
  const players = getPlayersForMode(mode);
  const initialState = createInitialState(mode, players, G.isMercenary);

  const playerMap: Record<string, string> = {};
  players.forEach((pid, index) => {
    playerMap[index.toString()] = pid;
  });

  // Authoritative Reset
  G.mode = mode;
  G.activePlayers = players;
  G.board = initialState.board;
  G.terrain = initialState.terrain;
  G.inventory = initialState.inventory;
  G.terrainInventory = initialState.terrainInventory;
  G.playerMap = playerMap;
  G.readyPlayers = {};
};

export const mirrorBoard = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  explicitPid?: string,
  isGM?: boolean,
) => {
  const playerId = resolvePlayerId(G, ctx, playerID, explicitPid, isGM);
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
  for (const [row, col] of targetCells) {
    G.board[row][col] = null;
    G.terrain[row][col] = TERRAIN_TYPES.FLAT as TerrainType;
  }

  // Mirror source to target
  const max = M.BOARD_SIZE - 1;
  for (const [row, col] of sourceCells) {
    const piece = G.board[row][col];
    const terr = G.terrain[row][col];
    const tr = max - row;
    const tc = max - col;
    if (tr >= 0 && tr < M.BOARD_SIZE && tc >= 0 && tc < M.BOARD_SIZE) {
      G.terrain[tr][tc] = terr;
      if (piece) G.board[tr][tc] = { ...piece, player: target };
    }
  }

  // Update inventories
  const updateInventoryForPlayer = (player: string) => {
    const placedUnits: Record<string, number> = {};
    for (let row = 0; row < M.BOARD_SIZE; row++) {
      for (let col = 0; col < M.BOARD_SIZE; col++) {
        const piece = G.board[row][col];
        if (piece && piece.player === player)
          placedUnits[piece.type] = (placedUnits[piece.type] || 0) + 1;
      }
    }
    const missingUnits: PieceType[] = [];
    INITIAL_ARMY.forEach((unit) => {
      const count = placedUnits[unit.type] || 0;
      const missing = unit.count - count;
      if (missing > 0) {
        for (let i = 0; i < missing; i++) missingUnits.push(unit.type);
      }
    });
    return missingUnits;
  };

  G.inventory[source] = updateInventoryForPlayer(source);
  G.inventory[target] = updateInventoryForPlayer(target);
};

export const randomizeTerrain = (
  {
    G,
    playerID,
    ctx,
    random,
  }: {
    G: TrenchessState;
    playerID?: string;
    ctx: Ctx;
    random: { Number: () => number };
  },
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

  const result = randomizeTerrainLogic(
    G.terrain,
    G.board,
    G.terrainInventory,
    pids,
    G.mode,
    undefined,
    random,
  );
  G.terrain = result.terrain;
  G.terrainInventory = result.terrainInventory;
};

export const randomizeUnits = (
  {
    G,
    playerID,
    ctx,
    random,
  }: {
    G: TrenchessState;
    playerID?: string;
    ctx: Ctx;
    random: { Number: () => number };
  },
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

  // Random Mode Logic: Choose between intelligent random placement OR a structured formation
  const strategy = random.Number();

  if (strategy < 0.4) {
    // 40% chance: Pure intelligent randomization
    const result = randomizeUnitsLogic(
      G.board,
      G.terrain,
      G.inventory,
      pids,
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
      formations[Math.floor(random.Number() * formations.length)];

    const result = applyClassicalFormationLogic(
      G.board,
      G.terrain,
      G.inventory,
      G.terrainInventory,
      pids,
      G.mode,
      formation,
    );
    G.board = result.board;
    G.inventory = result.inventory;
  }
};

export const setClassicalFormation = (
  {
    G,
    playerID,
    ctx,
    random,
  }: {
    G: TrenchessState;
    playerID?: string;
    ctx: Ctx;
    random: { Number: () => number };
  },
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

  // Pi Mode: Standard formation + ALWAYS 16 terrain tiles
  const terrainResult = randomizeTerrainLogic(
    G.terrain,
    G.board,
    G.terrainInventory,
    pids,
    G.mode,
    16,
    random,
  );
  const result = applyClassicalFormationLogic(
    G.board,
    terrainResult.terrain,
    G.inventory,
    terrainResult.terrainInventory,
    pids,
    G.mode,
    "classical",
  );
  G.board = result.board;
  G.terrain = result.terrain;
  G.inventory = result.inventory;
  G.terrainInventory = result.terrainInventory;
};

export const applyChiGarden = (
  {
    G,
    playerID,
    ctx,
    random,
  }: {
    G: TrenchessState;
    playerID?: string;
    ctx: Ctx;
    random: { Number: () => number };
  },
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

  // 1. Select a random layout from the library
  const modeSeeds = DEFAULT_SEEDS.filter((seed) => seed.mode === G.mode);
  const randVal = random.Number();
  const seedToUse =
    modeSeeds.length > 0
      ? modeSeeds[Math.floor(randVal * modeSeeds.length)].seed
      : DEFAULT_SEEDS[0].seed;

  const decoded = deserializeGame(seedToUse);
  if (decoded) {
    const adapted = adaptSeedToMode(decoded, G.mode);

    pids.forEach((playerId) => {
      const myCells = getPlayerCells(playerId, G.mode);

      // Check if the configuration has any pieces for this player
      let seedHasUnits = false;
      for (const [row, col] of myCells) {
        if (adapted.board[row][col]) {
          seedHasUnits = true;
          break;
        }
      }

      // 2. Apply Terrain + Units (Units only if present in build)
      for (const [row, col] of myCells) {
        const newTerrain = adapted.terrain[row][col];
        const existingPiece = G.board[row][col];

        // If seed has units, we overwrite everything in our territory
        if (seedHasUnits) {
          G.terrain[row][col] = newTerrain;
          G.board[row][col] = adapted.board[row][col];
        } else {
          // Garden Logic: Preserve existing pieces if compatible, otherwise clear tile
          if (existingPiece && !canPlaceUnit(existingPiece.type, newTerrain)) {
            G.terrain[row][col] = TERRAIN_TYPES.FLAT as TerrainType;
          } else {
            G.terrain[row][col] = newTerrain;
          }
        }
      }

      if (seedHasUnits) {
        G.inventory[playerId] = [];
      }
      G.terrainInventory[playerId] = [];
    });
  }
};
