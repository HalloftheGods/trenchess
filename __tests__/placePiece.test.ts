import { describe, it, expect, beforeEach, vi } from "vitest";
import { placePiece } from "@/app/core/mechanics/moves/placePiece";
import { PIECES, BOARD_SIZE, TERRAIN_TYPES } from "@constants";
import type { TrenchessState, BoardPiece, TerrainType } from "@tc.types";
import { INVALID_MOVE } from "boardgame.io/core";
import type { Ctx } from "boardgame.io";
import * as validationLogic from "@/app/core/setup/validation";
import * as coreHelpers from "@/app/core/setup/coreHelpers";
import * as territoryLogic from "@/app/core/setup/territory";
import * as baseTerritory from "@/app/core/mechanics/moves/base/territory";

// Mock the helper functions to isolate `placePiece` logic
vi.mock("@/app/core/setup/territory", () => ({
  getPlayerCells: vi.fn(),
  getCellOwner: vi.fn(),
}));

vi.mock("@/app/core/mechanics/moves/base/territory", () => ({
  isWithinTerritory: vi.fn(),
}));

vi.mock("@/app/core/setup/validation", () => ({
  canPlaceUnit: vi.fn(),
  isWithinUnitLimits: vi.fn(),
  getUnitLimit: vi.fn(),
}));

vi.mock("@/app/core/setup/coreHelpers", () => ({
  resolvePlayerId: vi.fn(),
}));

describe("placePiece", () => {
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
      inventory: { red: [PIECES.PAWN, PIECES.ROOK] },
      terrainInventory: {},
      capturedBy: {},
      lostToDesert: [],
      lastMove: null,
      mode: "2p-ns",
      activePlayers: ["red", "blue"],
      readyPlayers: {},
      playerMap: { "0": "red", "1": "blue" },
      winner: null,
      winnerReason: null,
    };

    ctx = {
      currentPlayer: "0",
    } as unknown as Ctx;

    // Default mock behaviors
    vi.mocked(coreHelpers.resolvePlayerId).mockReturnValue("red");
    vi.mocked(territoryLogic.getPlayerCells).mockReturnValue([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    vi.mocked(validationLogic.canPlaceUnit).mockReturnValue(true);
    vi.mocked(validationLogic.isWithinUnitLimits).mockReturnValue(true);
    vi.mocked(baseTerritory.isWithinTerritory).mockImplementation(
      (_pid, _mode, [r, c]) => {
        // Return false for [5,5] to match test expectations
        return !(r === 5 && c === 5);
      },
    );
  });

  it("should fail if player ID cannot be resolved", () => {
    vi.mocked(coreHelpers.resolvePlayerId).mockReturnValue(null);

    const result = placePiece({ G, ctx, playerID: "0" }, 0, 0, PIECES.PAWN);
    expect(result).toBe(INVALID_MOVE);
  });

  it("should fail if placing outside of player's territory", () => {
    // Only [0, 0] and [0, 1] are valid per mock
    const result = placePiece({ G, ctx, playerID: "0" }, 5, 5, PIECES.PAWN);
    expect(result).toBe(INVALID_MOVE);
  });

  describe("Removing a piece (type === null)", () => {
    it("should remove the piece and add it back to inventory if it belongs to the player", () => {
      G.board[0][0] = { type: PIECES.QUEEN, player: "red" };

      placePiece({ G, ctx, playerID: "0" }, 0, 0, null);

      expect(G.board[0][0]).toBeNull();
      expect(G.inventory["red"]).toContain(PIECES.QUEEN);
    });

    it("should do nothing when trying to remove an empty square", () => {
      const initialInventorySize = G.inventory["red"].length;

      placePiece({ G, ctx, playerID: "0" }, 0, 0, null);

      expect(G.board[0][0]).toBeNull();
      expect(G.inventory["red"].length).toBe(initialInventorySize);
    });

    it("should do nothing when trying to remove an enemy piece", () => {
      G.board[0][0] = { type: PIECES.QUEEN, player: "blue" };
      const initialInventorySize = G.inventory["red"].length;

      placePiece({ G, ctx, playerID: "0" }, 0, 0, null);

      expect(G.board[0][0]).toEqual({ type: PIECES.QUEEN, player: "blue" });
      expect(G.inventory["red"].length).toBe(initialInventorySize);
    });
  });

  describe("Placing a piece", () => {
    it("should fail if unit is not compatible with terrain", () => {
      vi.mocked(validationLogic.canPlaceUnit).mockReturnValue(false);

      const result = placePiece({ G, ctx, playerID: "0" }, 0, 0, PIECES.PAWN);
      expect(result).toBe(INVALID_MOVE);
    });

    it("should fail if the piece is not in the player's inventory", () => {
      const result = placePiece({ G, ctx, playerID: "0" }, 0, 0, PIECES.QUEEN);
      expect(result).toBe(INVALID_MOVE);
    });

    it("should place the piece and remove it from inventory", () => {
      placePiece({ G, ctx, playerID: "0" }, 0, 0, PIECES.PAWN);

      expect(G.board[0][0]).toEqual({ type: PIECES.PAWN, player: "red" });
      expect(G.inventory["red"]).not.toContain(PIECES.PAWN);
      expect(G.inventory["red"]).toContain(PIECES.ROOK);
    });

    it("should swap with an existing allied piece, placing it back in inventory", () => {
      G.board[0][0] = { type: PIECES.KNIGHT, player: "red" };

      placePiece({ G, ctx, playerID: "0" }, 0, 0, PIECES.PAWN);

      expect(G.board[0][0]).toEqual({ type: PIECES.PAWN, player: "red" });
      expect(G.inventory["red"]).toContain(PIECES.KNIGHT); // Old piece returned
      expect(G.inventory["red"]).not.toContain(PIECES.PAWN); // New piece placed
    });

    it("should fail if trying to place a second king", () => {
      vi.mocked(validationLogic.isWithinUnitLimits).mockReturnValue(false);
      G.board[0][0] = { type: PIECES.KING, player: "red" };
      G.inventory["red"].push(PIECES.KING);

      const result = placePiece({ G, ctx, playerID: "0" }, 0, 1, PIECES.KING);

      expect(result).toBe(INVALID_MOVE);
    });

    it("should allow placing a king if it's the only one", () => {
      G.inventory["red"].push(PIECES.KING);

      placePiece({ G, ctx, playerID: "0" }, 0, 0, PIECES.KING);

      expect(G.board[0][0]).toEqual({ type: PIECES.KING, player: "red" });
    });

    it("should fail if generalized unit limit is exceeded in normal mode", () => {
      vi.mocked(validationLogic.isWithinUnitLimits).mockReturnValue(false);
      G.isMercenary = false;

      const result = placePiece({ G, ctx, playerID: "0" }, 0, 0, PIECES.QUEEN);

      expect(result).toBe(INVALID_MOVE);
    });

    it("should allow placing pieces beyond normal limits in mercenary mode (except King)", () => {
      // isWithinUnitLimits would normally return true for non-king pieces in mercenary mode
      vi.mocked(validationLogic.isWithinUnitLimits).mockReturnValue(true);
      G.isMercenary = true;
      G.mercenaryPoints = { red: 100 };
      G.inventory["red"].push(PIECES.QUEEN);

      const result = placePiece({ G, ctx, playerID: "0" }, 0, 0, PIECES.QUEEN);

      expect(G.board[0][0]).toEqual({ type: PIECES.QUEEN, player: "red" });
      expect(result).not.toBe(INVALID_MOVE);
    });
  });
});
