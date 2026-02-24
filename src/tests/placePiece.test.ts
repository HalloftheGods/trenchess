import { describe, it, expect, beforeEach, vi } from "vitest";
import { placePiece } from "@/core/moves/placePiece";
import { PIECES, BOARD_SIZE, TERRAIN_TYPES } from "@/constants";
import type { TrenchessState, BoardPiece, TerrainType } from "@/shared/types";
import { INVALID_MOVE } from "boardgame.io/core";
import type { Ctx } from "boardgame.io";
import * as setupLogic from "@/core/setup/setupLogic";
import * as coreHelpers from "@/core/setup/coreHelpers";

// Mock the helper functions to isolate `placePiece` logic
vi.mock("@/core/setup/setupLogic", () => ({
  getPlayerCells: vi.fn(),
  canPlaceUnit: vi.fn(),
}));

vi.mock("@/core/setup/coreHelpers", () => ({
  resolvePlayerId: vi.fn(),
}));

describe("placePiece", () => {
  let G: TrenchessState;
  let ctx: Ctx;

  beforeEach(() => {
    vi.resetAllMocks();

    const board: (BoardPiece | null)[][] = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(null)
    );
    const terrain: TerrainType[][] = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT)
    );

    G = {
      board,
      terrain,
      inventory: { red: [PIECES.PAWN, PIECES.ROOK] },
      terrainInventory: {},
      capturedBy: {},
      mode: "2p-ns",
      activePlayers: ["red", "blue"],
      readyPlayers: {},
      playerMap: { "0": "red", "1": "blue" },
    };

    ctx = {
      currentPlayer: "0",
    } as unknown as Ctx;

    // Default mock behaviors
    (coreHelpers.resolvePlayerId as any).mockReturnValue("red");
    (setupLogic.getPlayerCells as any).mockReturnValue([[0, 0], [0, 1]]);
    (setupLogic.canPlaceUnit as any).mockReturnValue(true);
  });

  it("should fail if player ID cannot be resolved", () => {
    (coreHelpers.resolvePlayerId as any).mockReturnValue(null);
    
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
      (setupLogic.canPlaceUnit as any).mockReturnValue(false);
      
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
  });
});
