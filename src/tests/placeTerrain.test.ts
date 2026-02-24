import { describe, it, expect, beforeEach, vi } from "vitest";
import { placeTerrain } from "@/core/moves/placeTerrain";
import { PIECES, BOARD_SIZE, TERRAIN_TYPES } from "@/constants";
import type { TrenchessState, BoardPiece, TerrainType } from "@/shared/types";
import { INVALID_MOVE } from "boardgame.io/core";
import type { Ctx } from "boardgame.io";
import * as setupLogic from "@/core/setup/setupLogic";
import * as coreHelpers from "@/core/setup/coreHelpers";

vi.mock("@/core/setup/setupLogic", () => ({
  getPlayerCells: vi.fn(),
  canPlaceUnit: vi.fn(),
}));

vi.mock("@/core/setup/coreHelpers", () => ({
  resolvePlayerId: vi.fn(),
  getQuota: vi.fn(),
}));

describe("placeTerrain", () => {
  let G: TrenchessState;
  let ctx: Ctx;

  beforeEach(() => {
    vi.resetAllMocks();

    const board: (BoardPiece | null)[][] = Array.from(
      { length: BOARD_SIZE },
      () => Array(BOARD_SIZE).fill(null),
    );
    const terrain: TerrainType[][] = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT),
    );

    G = {
      board,
      terrain,
      inventory: {},
      terrainInventory: { red: [TERRAIN_TYPES.FORESTS, TERRAIN_TYPES.SWAMPS] },
      capturedBy: {},
      mode: "2p-ns",
      activePlayers: ["red", "blue"],
      readyPlayers: {},
      playerMap: { "0": "red", "1": "blue" },
    };

    ctx = {
      currentPlayer: "0",
    } as unknown as Ctx;

    vi.mocked(coreHelpers.resolvePlayerId).mockReturnValue("red");
    vi.mocked(coreHelpers.getQuota).mockReturnValue(2);
    vi.mocked(setupLogic.getPlayerCells).mockReturnValue([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    vi.mocked(setupLogic.canPlaceUnit).mockReturnValue(true);
  });

  it("should fail if player ID cannot be resolved", () => {
    vi.mocked(coreHelpers.resolvePlayerId).mockReturnValue(null);
    const result = placeTerrain(
      { G, ctx, playerID: "0" },
      0,
      0,
      TERRAIN_TYPES.FORESTS,
    );
    expect(result).toBe(INVALID_MOVE);
  });

  it("should fail if placing outside of player's territory", () => {
    // cell [5,5] not in mocked getPlayerCells
    const result = placeTerrain(
      { G, ctx, playerID: "0" },
      5,
      5,
      TERRAIN_TYPES.FORESTS,
    );
    expect(result).toBe(INVALID_MOVE);
  });

  describe("Removing terrain (type === FLAT)", () => {
    it("should remove terrain and return it to inventory", () => {
      G.terrain[0][0] = TERRAIN_TYPES.MOUNTAINS;

      placeTerrain({ G, ctx, playerID: "0" }, 0, 0, TERRAIN_TYPES.FLAT);

      expect(G.terrain[0][0]).toBe(TERRAIN_TYPES.FLAT);
      expect(G.terrainInventory["red"]).toContain(TERRAIN_TYPES.MOUNTAINS);
    });

    it("should do nothing if terrain is already FLAT", () => {
      const initialInventorySize = G.terrainInventory["red"].length;

      placeTerrain({ G, ctx, playerID: "0" }, 0, 0, TERRAIN_TYPES.FLAT);

      expect(G.terrain[0][0]).toBe(TERRAIN_TYPES.FLAT);
      expect(G.terrainInventory["red"].length).toBe(initialInventorySize);
    });
  });

  describe("Placing terrain", () => {
    it("should fail if existing unit on cell is incompatible with new terrain", () => {
      G.board[0][0] = { type: PIECES.KNIGHT, player: "red" };
      vi.mocked(setupLogic.canPlaceUnit).mockReturnValue(false);

      const result = placeTerrain(
        { G, ctx, playerID: "0" },
        0,
        0,
        TERRAIN_TYPES.FORESTS,
      );
      expect(result).toBe(INVALID_MOVE);
    });

    it("should fail if terrain is not in inventory", () => {
      const result = placeTerrain(
        { G, ctx, playerID: "0" },
        0,
        0,
        TERRAIN_TYPES.MOUNTAINS,
      );
      expect(result).toBe(INVALID_MOVE);
    });

    it("should fail if terrain quota is reached and cell is flat", () => {
      // Mock getQuota returning 1
      vi.mocked(coreHelpers.getQuota).mockReturnValue(1);

      // Place one terrain manually so countPlacedTerrain returns 1
      G.terrain[0][1] = TERRAIN_TYPES.FORESTS;

      const result = placeTerrain(
        { G, ctx, playerID: "0" },
        0,
        0,
        TERRAIN_TYPES.SWAMPS,
      );
      expect(result).toBe(INVALID_MOVE);
    });

    it("should allow replacing existing terrain even if quota is reached", () => {
      vi.mocked(coreHelpers.getQuota).mockReturnValue(1);

      // Cell [0,1] already has FORESTS (reaches quota of 1)
      G.terrain[0][1] = TERRAIN_TYPES.FORESTS;

      // We replace FORESTS with SWAMPS on [0,1]
      placeTerrain({ G, ctx, playerID: "0" }, 0, 1, TERRAIN_TYPES.SWAMPS);

      expect(G.terrain[0][1]).toBe(TERRAIN_TYPES.SWAMPS);
      expect(G.terrainInventory["red"]).not.toContain(TERRAIN_TYPES.SWAMPS);
      // FORESTS goes back to inventory
      expect(G.terrainInventory["red"]).toContain(TERRAIN_TYPES.FORESTS);
    });

    it("should successfully place terrain on a flat cell", () => {
      placeTerrain({ G, ctx, playerID: "0" }, 0, 0, TERRAIN_TYPES.FORESTS);

      expect(G.terrain[0][0]).toBe(TERRAIN_TYPES.FORESTS);
      expect(G.terrainInventory["red"]).not.toContain(TERRAIN_TYPES.FORESTS);
    });
  });
});
