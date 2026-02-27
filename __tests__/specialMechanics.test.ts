import { describe, it, expect } from "vitest";
import { PIECES, BOARD_SIZE, TERRAIN_TYPES } from "@constants";
import { getValidMoves } from "@/core/mechanics/movement";
import type { BoardPiece, TerrainType } from "@/shared/types";

describe("Special Mechanics Logic", () => {
  const emptyBoard = (): (BoardPiece | null)[][] =>
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

  const flatTerrain = (): TerrainType[][] =>
    Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT),
    );

  describe("Sanctuary Blockage", () => {
    it("should block Knight from moving into Swamps or Forests", () => {
      const board = emptyBoard();
      const terrain = flatTerrain();
      const knight: BoardPiece = { type: PIECES.KNIGHT, player: "red" };
      board[4][4] = knight;

      terrain[6][5] = TERRAIN_TYPES.SWAMPS;
      terrain[6][3] = TERRAIN_TYPES.FORESTS;

      const moves = getValidMoves(
        4,
        4,
        knight,
        "red",
        board,
        terrain,
        "2p-ns",
        0,
        true,
      );

      expect(moves).not.toContainEqual([6, 5]);
      expect(moves).not.toContainEqual([6, 3]);
      expect(moves).toContainEqual([2, 5]); // Should still move to flat
    });

    it("should block Bishop from moving into Swamps or Mountains", () => {
      const board = emptyBoard();
      const terrain = flatTerrain();
      const bishop: BoardPiece = { type: PIECES.BISHOP, player: "red" };
      board[4][4] = bishop;

      terrain[5][5] = TERRAIN_TYPES.SWAMPS;
      terrain[3][3] = TERRAIN_TYPES.MOUNTAINS;

      const moves = getValidMoves(
        4,
        4,
        bishop,
        "red",
        board,
        terrain,
        "2p-ns",
        0,
        true,
      );

      expect(moves).not.toContainEqual([5, 5]);
      expect(moves).not.toContainEqual([3, 3]);
      expect(moves).toContainEqual([5, 3]); // Should still move to flat
    });

    it("should block Rook from moving into Forests or Mountains", () => {
      const board = emptyBoard();
      const terrain = flatTerrain();
      const rook: BoardPiece = { type: PIECES.ROOK, player: "red" };
      board[4][4] = rook;

      terrain[4][5] = TERRAIN_TYPES.FORESTS;
      terrain[5][4] = TERRAIN_TYPES.MOUNTAINS;

      const moves = getValidMoves(
        4,
        4,
        rook,
        "red",
        board,
        terrain,
        "2p-ns",
        0,
        true,
      );

      expect(moves).not.toContainEqual([4, 5]);
      expect(moves).not.toContainEqual([5, 4]);
      expect(moves).toContainEqual([4, 3]); // Should still move to flat
    });
  });

  describe("Desert Terrain", () => {
    it("should stop sliding pieces (Rook) at the first Desert square", () => {
      const board = emptyBoard();
      const terrain = flatTerrain();
      const rook: BoardPiece = { type: PIECES.ROOK, player: "red" };
      board[4][4] = rook;

      terrain[4][6] = TERRAIN_TYPES.DESERT;

      const moves = getValidMoves(
        4,
        4,
        rook,
        "red",
        board,
        terrain,
        "2p-ns",
        0,
        true,
      );

      expect(moves).toContainEqual([4, 6]); // Can move into desert
      expect(moves).not.toContainEqual([4, 7]); // But cannot slide THROUGH it
    });
  });

  describe("Special Leaps", () => {
    it("should allow Knight Elite Jump (3-step orthogonal)", () => {
      const board = emptyBoard();
      const terrain = flatTerrain();
      const knight: BoardPiece = { type: PIECES.KNIGHT, player: "red" };
      board[4][4] = knight;

      const moves = getValidMoves(
        4,
        4,
        knight,
        "red",
        board,
        terrain,
        "2p-ns",
        0,
        true,
      );

      expect(moves).toContainEqual([7, 4]); // 3 steps down
      expect(moves).toContainEqual([1, 4]); // 3 steps up
      expect(moves).toContainEqual([4, 7]); // 3 steps right
      expect(moves).toContainEqual([4, 1]); // 3 steps left
    });

    it("should allow Bishop Seer Leap (2-step orthogonal)", () => {
      const board = emptyBoard();
      const terrain = flatTerrain();
      const bishop: BoardPiece = { type: PIECES.BISHOP, player: "red" };
      board[4][4] = bishop;

      const moves = getValidMoves(
        4,
        4,
        bishop,
        "red",
        board,
        terrain,
        "2p-ns",
        0,
        true,
      );

      expect(moves).toContainEqual([6, 4]);
      expect(moves).toContainEqual([2, 4]);
      expect(moves).toContainEqual([4, 6]);
      expect(moves).toContainEqual([4, 2]);
    });

    it("should allow Rook Bastion Leap (1-step diagonal jump)", () => {
      const board = emptyBoard();
      const terrain = flatTerrain();
      const rook: BoardPiece = { type: PIECES.ROOK, player: "red" };
      board[4][4] = rook;

      const moves = getValidMoves(
        4,
        4,
        rook,
        "red",
        board,
        terrain,
        "2p-ns",
        0,
        true,
      );

      expect(moves).toContainEqual([5, 5]);
      expect(moves).toContainEqual([5, 3]);
      expect(moves).toContainEqual([3, 5]);
      expect(moves).toContainEqual([3, 3]);
    });
  });

  describe("Pawn Backflip", () => {
    it("should allow Pawn to backflip (2 steps backwards)", () => {
      const board = emptyBoard();
      const terrain = flatTerrain();
      const pawn: BoardPiece = { type: PIECES.PAWN, player: "red" };
      board[4][4] = pawn; // Red is North, moves +1 (down)

      const moves = getValidMoves(
        4,
        4,
        pawn,
        "red",
        board,
        terrain,
        "2p-ns",
        0,
        true,
      );

      // Front move: [5,4]
      // Backflip move: [4-2, 4] = [2,4]
      expect(moves).toContainEqual([2, 4]);
    });
  });
});
