import { getPlayerCells, getPlayersForMode } from "@/app/core/setup/territory";

import { TERRAIN_TYPES, INITIAL_ARMY } from "@constants";
import { DEFAULT_SEEDS } from "@/app/core/setup/seeds";
import {
  deserializeGame,
  adaptSeedToMode,
} from "@/shared/utilities/serialization";
import type {
  TrenchessState,
  TerrainType,
  PieceType,
  GameMode,
  BoardPiece,
} from "@tc.types";
import type { Ctx, FnContext } from "boardgame.io";
import { resolvePlayerId, getQuota } from "@/app/core/setup/coreHelpers";
import { INVALID_MOVE } from "boardgame.io/core";
import {
  randomizeTerrain as randomizeTerrainLogic,
  randomizeUnits as randomizeUnitsLogic,
} from "@/app/core/setup/randomization";
import { applyClassicalFormation as applyClassicalFormationLogic } from "@/app/core/setup/formations";
import M from "./base/move";

import { createInitialState } from "@/app/core/setup/setupLogic";

export const syncLayout = (
  { G }: { G: TrenchessState },
  layout: {
    board: (BoardPiece | null)[][];
    terrain: TerrainType[][];
    inventory: Record<string, PieceType[]>;
    terrainInventory: Record<string, TerrainType[]>;
  },
) => {
  G.board = layout.board;
  G.terrain = layout.terrain;
  G.inventory = layout.inventory;
  G.terrainInventory = layout.terrainInventory;
};

export const setMode = ({ G }: { G: TrenchessState }, mode: GameMode) => {
  const players = getPlayersForMode(mode);
  const initialState = createInitialState(mode, players, G.isMercenary);

  const playerMap: Record<string, string> = {};
  players.forEach((pid, index) => {
    playerMap[index.toString()] = pid;
  });

  console.log(`[SET_MODE] Mode: ${mode}. Players: ${players.join(", ")}`);

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
  allowExplicit?: boolean,
) => {
  const pids =
    (allowExplicit || G.isGamemaster) && !explicitPid
      ? G.activePlayers
      : ([
          resolvePlayerId(
            G,
            ctx,
            playerID,
            explicitPid,
            allowExplicit || G.isGamemaster,
          ),
        ].filter(Boolean) as string[]);

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
  allowExplicit?: boolean,
) => {
  const pids =
    (allowExplicit || G.isGamemaster) && !explicitPid
      ? G.activePlayers
      : ([
          resolvePlayerId(
            G,
            ctx,
            playerID,
            explicitPid,
            allowExplicit || G.isGamemaster,
          ),
        ].filter(Boolean) as string[]);

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
  allowExplicit?: boolean,
) => {
  const pids =
    (allowExplicit || G.isGamemaster) && !explicitPid
      ? G.activePlayers
      : ([
          resolvePlayerId(
            G,
            ctx,
            playerID,
            explicitPid,
            allowExplicit || G.isGamemaster,
          ),
        ].filter(Boolean) as string[]);

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
  allowExplicit?: boolean,
) => {
  const pids =
    (allowExplicit || G.isGamemaster) && !explicitPid
      ? G.activePlayers
      : ([
          resolvePlayerId(
            G,
            ctx,
            playerID,
            explicitPid,
            allowExplicit || G.isGamemaster,
          ),
        ].filter(Boolean) as string[]);

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

      // 2. Apply Terrain only. Players must layout their own pieces in the main phase.
      for (const [row, col] of myCells) {
        const newTerrain = adapted.terrain[row][col];
        G.terrain[row][col] = newTerrain;
        // We clear existing units in the territory to ensure a clean layout phase.
        G.board[row][col] = null;
      }

      // Re-calculate inventories based on board state
      const myUnitsOnBoard: Record<string, number> = {};
      const myTerrainOnBoard: Record<string, number> = {};

      myCells.forEach(([r, c]) => {
        const piece = G.board[r][c];
        const terr = G.terrain[r][c];
        if (piece && piece.player === playerId) {
          myUnitsOnBoard[piece.type] = (myUnitsOnBoard[piece.type] || 0) + 1;
        }
        if (terr !== TERRAIN_TYPES.FLAT) {
          myTerrainOnBoard[terr] = (myTerrainOnBoard[terr] || 0) + 1;
        }
      });

      // Update unit inventory
      const initialUnitList = INITIAL_ARMY.flatMap((unit) =>
        Array(unit.count).fill(unit.type),
      );
      const remainingUnits = [...initialUnitList];
      Object.entries(myUnitsOnBoard).forEach(([type, count]) => {
        for (let i = 0; i < count; i++) {
          const idx = remainingUnits.indexOf(type as PieceType);
          if (idx !== -1) remainingUnits.splice(idx, 1);
        }
      });
      G.inventory[playerId] = remainingUnits;

      // Update terrain inventory
      const initialTerrainList = [
        ...Array(getQuota(G.mode)).fill(TERRAIN_TYPES.FORESTS),
        ...Array(getQuota(G.mode)).fill(TERRAIN_TYPES.SWAMPS),
        ...Array(getQuota(G.mode)).fill(TERRAIN_TYPES.MOUNTAINS),
        ...Array(getQuota(G.mode)).fill(TERRAIN_TYPES.DESERT),
      ] as TerrainType[];
      const remainingTerrain = [...initialTerrainList];
      Object.entries(myTerrainOnBoard).forEach(([type, count]) => {
        for (let i = 0; i < count; i++) {
          const idx = remainingTerrain.indexOf(type as TerrainType);
          if (idx !== -1) remainingTerrain.splice(idx, 1);
        }
      });
      G.terrainInventory[playerId] = remainingTerrain;
    });
  }
};

export const initMatch = (
  { G, events, random }: FnContext<TrenchessState>,
  selectedMode: GameMode,
  preset: string | null,
  _newPlayerTypes?: Record<string, "human" | "computer">,
) => {
  // Apply mode
  if (G.mode !== selectedMode) {
    setMode({ G }, selectedMode);
  }

  // Update AI types
  // Note: playerTypes is managed outside G conceptually in our codebase but let's assume it's external or we don't need it here. Wait, turnState manages playerTypes locally in the React context, not in G. So we skip newPlayerTypes here.

  if (preset === "quick" || preset === "alpha") {
    // We pass explicitPid true to bypass Gamemaster check in the internal methods
    randomizeUnits({ G, random, ctx: {} as Ctx }, undefined, true);
    randomizeTerrain({ G, random, ctx: {} as Ctx }, undefined, true);
    for (const pid of getPlayersForMode(selectedMode)) {
      G.readyPlayers[pid] = true;
    }
  } else if (preset === "classic" || preset === "pi") {
    setClassicalFormation({ G, random, ctx: {} as Ctx }, undefined, true);
    for (const pid of getPlayersForMode(selectedMode)) {
      G.readyPlayers[pid] = true;
    }
  } else if (preset === "terrainiffic" || preset === "chi") {
    applyChiGarden({ G, random, ctx: {} as Ctx }, undefined, true);
    // Removed auto-ready to ensure players must layout pieces in main phase
  } else if (preset === "omega" || preset === "custom") {
    G.board = createInitialState(
      selectedMode,
      getPlayersForMode(selectedMode),
      G.isMercenary,
    ).board;
    // resetToOmega internal equivalent
    G.activePlayers.forEach((pid) => {
      G.inventory[pid] = [
        ...Array(1).fill("king"),
        ...Array(1).fill("queen"),
        ...Array(2).fill("rook"),
        ...Array(2).fill("bishop"),
        ...Array(2).fill("knight"),
        ...Array(8).fill("pawn"),
      ];
      G.terrainInventory[pid] = [
        ...Array(4).fill("forests"),
        ...Array(4).fill("mountains"),
        ...Array(4).fill("swamps"),
        ...Array(4).fill("desert"),
      ];
    });
  } else if (preset === "zen-garden") {
    G.isGamemaster = true;
    events.setPhase!("gamemaster");
    return;
  }

  // Check if all players ready to jump to combat
  const players = getPlayersForMode(selectedMode);
  const allReady = players.every((p) => G.readyPlayers[p]);

  if (allReady) {
    events.setPhase!("combat");
  } else {
    events.setPhase!("main");
  }
};
