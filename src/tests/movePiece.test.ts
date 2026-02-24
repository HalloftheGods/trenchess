import { describe, it, expect, beforeEach } from "vitest";
import { movePiece } from "@/core/moves/movePiece";
import { PIECES, BOARD_SIZE, TERRAIN_TYPES } from "@/constants";
import type { TrenchessState, BoardPiece, TerrainType } from "@/shared/types";
import { INVALID_MOVE } from "boardgame.io/core";
import type { Ctx } from "boardgame.io";

describe("movePiece", () => {
  let G: TrenchessState;
  let ctx: Ctx;

  beforeEach(() => {
    // Basic setup for tests
    const board: (BoardPiece | null)[][] = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(null)
    );
    const terrain: TerrainType[][] = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT)
    );

    G = {
      board,
      terrain,
      inventory: {},
      terrainInventory: {},
      capturedBy: { red: [], blue: [], green: [], yellow: [] },
      mode: "2p-ns",
      activePlayers: ["red", "blue"],
      readyPlayers: { red: true, blue: true },
      playerMap: { "0": "red", "1": "blue" },
    };

    ctx = {
      numPlayers: 2,
      currentPlayer: "0",
      playOrder: ["0", "1"],
      playOrderPos: 0,
      activePlayers: null,
      phase: "",
      turn: 1,
    } as unknown as Ctx;
  });

  it("should fail if player is not found or not active", () => {
    G.activePlayers = [];
    const result = movePiece({ G, ctx, playerID: "0" }, [0, 0], [1, 1]);
    expect(result).toBe(INVALID_MOVE);
  });

  it("should fail if no piece exists at the origin", () => {
    const result = movePiece({ G, ctx, playerID: "0" }, [0, 0], [1, 1]);
    expect(result).toBe(INVALID_MOVE);
  });

  it("should fail if moving an enemy piece", () => {
    G.board[0][0] = { type: PIECES.PAWN, player: "blue" };
    const result = movePiece({ G, ctx, playerID: "0" }, [0, 0], [1, 1]);
    expect(result).toBe(INVALID_MOVE);
  });

  it("should fail if moving an allied piece into a square occupied by an allied piece", () => {
    G.board[0][0] = { type: PIECES.PAWN, player: "red" };
    G.board[1][1] = { type: PIECES.PAWN, player: "red" };
    const result = movePiece({ G, ctx, playerID: "0" }, [0, 0], [1, 1]);
    expect(result).toBe(INVALID_MOVE);
  });

  it("should successfully move a piece to an empty square", () => {
    G.board[0][0] = { type: PIECES.PAWN, player: "red" };
    movePiece({ G, ctx, playerID: "0" }, [0, 0], [1, 1]);
    
    expect(G.board[0][0]).toBeNull();
    expect(G.board[1][1]).toEqual({ type: PIECES.PAWN, player: "red" });
  });

  it("should capture an enemy piece and add it to capturedBy", () => {
    G.board[0][0] = { type: PIECES.PAWN, player: "red" };
    G.board[1][1] = { type: PIECES.PAWN, player: "blue" };
    
    movePiece({ G, ctx, playerID: "0" }, [0, 0], [1, 1]);
    
    expect(G.board[0][0]).toBeNull();
    expect(G.board[1][1]).toEqual({ type: PIECES.PAWN, player: "red" });
    expect(G.capturedBy["red"]).toHaveLength(1);
    expect(G.capturedBy["red"][0]).toEqual({ type: PIECES.PAWN, player: "blue" });
  });

  describe("Pawn Promotion", () => {
    it("should promote a red pawn to a queen when reaching the last row in 2p-ns", () => {
      const fromRow = BOARD_SIZE - 2;
      const toRow = BOARD_SIZE - 1;
      G.board[fromRow][0] = { type: PIECES.PAWN, player: "red" };
      
      movePiece({ G, ctx, playerID: "0" }, [fromRow, 0], [toRow, 0]);
      
      expect(G.board[toRow][0]).toEqual({ type: PIECES.QUEEN, player: "red" });
    });

    it("should promote a blue pawn to a queen when reaching the first row in 2p-ns", () => {
      G.mode = "2p-ns";
      G.playerMap = { "1": "blue" };
      ctx.currentPlayer = "1";
      
      G.board[1][0] = { type: PIECES.PAWN, player: "blue" };
      
      movePiece({ G, ctx, playerID: "1" }, [1, 0], [0, 0]);
      
      expect(G.board[0][0]).toEqual({ type: PIECES.QUEEN, player: "blue" });
    });

    it("should promote an EW player pawn to a queen reaching the opposite col in 2p-ew", () => {
      G.mode = "2p-ew";
      G.activePlayers = ["green", "yellow"];
      G.playerMap = { "0": "green" };
      ctx.currentPlayer = "0";
      
      const lastCol = BOARD_SIZE - 1;
      G.board[0][lastCol - 1] = { type: PIECES.PAWN, player: "green" };
      
      movePiece({ G, ctx, playerID: "0" }, [0, lastCol - 1], [0, lastCol]);
      
      expect(G.board[0][lastCol]).toEqual({ type: PIECES.QUEEN, player: "green" });
    });
  });

  describe("Joust Capture", () => {
    it("should allow king to joust capture an enemy piece", () => {
      G.board[2][2] = { type: PIECES.KING, player: "red" };
      G.board[3][2] = { type: PIECES.PAWN, player: "blue" }; // Midpoint enemy
      
      movePiece({ G, ctx, playerID: "0" }, [2, 2], [4, 2]); // Jump over
      
      // King moved
      expect(G.board[4][2]).toEqual({ type: PIECES.KING, player: "red" });
      expect(G.board[2][2]).toBeNull();
      // Midpoint captured
      expect(G.board[3][2]).toBeNull();
      expect(G.capturedBy["red"]).toHaveLength(1);
      expect(G.capturedBy["red"][0]).toEqual({ type: PIECES.PAWN, player: "blue" });
    });

    it("should NOT joust capture an allied piece", () => {
      G.board[2][2] = { type: PIECES.KING, player: "red" };
      G.board[3][2] = { type: PIECES.PAWN, player: "red" }; // Midpoint ally
      
      movePiece({ G, ctx, playerID: "0" }, [2, 2], [4, 2]); // Jump over
      
      // The move itself might be legal if gameLogic validates it, but joust specifically 
      // shouldn't capture the midpoint ally. Wait, movePiece only returns INVALID_MOVE 
      // for self capture on target cell. But let's check if midpoint remains.
      expect(G.board[3][2]).toEqual({ type: PIECES.PAWN, player: "red" });
    });
  });

  describe("King Capture / Player Elimination", () => {
    it("should eliminate player and convert army when king is captured", () => {
      G.board[0][0] = { type: PIECES.PAWN, player: "red" };
      G.board[1][1] = { type: PIECES.KING, player: "blue" }; // Enemy King
      G.board[5][5] = { type: PIECES.ROOK, player: "blue" }; // Enemy army
      
      movePiece({ G, ctx, playerID: "0" }, [0, 0], [1, 1]);
      
      expect(G.board[1][1]).toEqual({ type: PIECES.PAWN, player: "red" }); // Capture happened
      expect(G.activePlayers).not.toContain("blue"); // Blue eliminated
      expect(G.board[5][5]).toEqual({ type: PIECES.ROOK, player: "red" }); // Army converted
    });
  });
});
