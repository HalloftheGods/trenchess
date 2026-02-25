import { describe, it, expect } from "vitest";
import { PIECES, BOARD_SIZE, TERRAIN_TYPES } from "@constants";
import { getValidMoves } from "@/core/mechanics/gameLogic";
import type { BoardPiece, TerrainType } from "@/shared/types";

describe("King Movement Logic", () => {
  const terrain: TerrainType[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT),
  );

  it("should have 8 standard 1-step moves + 4 joust moves in an empty board", () => {
    const board: (BoardPiece | null)[][] = Array.from(
      { length: BOARD_SIZE },
      () => Array(BOARD_SIZE).fill(null),
    );
    const king: BoardPiece = { type: PIECES.KING, player: "red" };
    const row = 4,
      col = 4;
    board[row][col] = king;

    const moves = getValidMoves(row, col, king, "red", board, terrain, "2p-ns");

    // 8 standard + 4 joust = 12 total
    // Standard: (3,3), (3,4), (3,5), (4,3), (4,5), (5,3), (5,4), (5,5)
    // Joust: (2,4), (6,4), (4,2), (4,6)
    expect(moves).toHaveLength(12);

    const expectedMoves = [
      [3, 3],
      [3, 4],
      [3, 5],
      [4, 3],
      [4, 5],
      [5, 3],
      [5, 4],
      [5, 5],
      [2, 4],
      [6, 4],
      [4, 2],
      [4, 6],
    ];
    expectedMoves.forEach((m) => {
      expect(moves).toContainEqual(m);
    });
  });

  it("should be able to capture an enemy piece with a 1-step move", () => {
    const board: (BoardPiece | null)[][] = Array.from(
      { length: BOARD_SIZE },
      () => Array(BOARD_SIZE).fill(null),
    );
    const king: BoardPiece = { type: PIECES.KING, player: "red" };
    const enemy: BoardPiece = { type: PIECES.PAWN, player: "yellow" };

    board[4][4] = king;
    board[3][4] = enemy; // Orthogonal enemy
    board[3][3] = enemy; // Diagonal enemy

    const moves = getValidMoves(4, 4, king, "red", board, terrain, "2p-ns");

    expect(moves).toContainEqual([3, 4]);
    expect(moves).toContainEqual([3, 3]);
  });

  it("should NOT be able to move into a square occupied by an ally", () => {
    const board: (BoardPiece | null)[][] = Array.from(
      { length: BOARD_SIZE },
      () => Array(BOARD_SIZE).fill(null),
    );
    const king: BoardPiece = { type: PIECES.KING, player: "red" };
    const ally: BoardPiece = { type: PIECES.PAWN, player: "red" };

    board[4][4] = king;
    board[3][4] = ally;

    const moves = getValidMoves(4, 4, king, "red", board, terrain, "2p-ns");

    expect(moves).not.toContainEqual([3, 4]);
  });

  it("should be able to capture with a Joust jump over an enemy", () => {
    const board: (BoardPiece | null)[][] = Array.from(
      { length: BOARD_SIZE },
      () => Array(BOARD_SIZE).fill(null),
    );
    const king: BoardPiece = { type: PIECES.KING, player: "red" };
    const enemy: BoardPiece = { type: PIECES.PAWN, player: "yellow" };

    board[4][4] = king;
    board[5][4] = enemy; // Enemy in between for joust

    const moves = getValidMoves(4, 4, king, "red", board, terrain, "2p-ns");

    // Joust to [6,4] should be available because midpoint is enemy
    expect(moves).toContainEqual([6, 4]);
  });

  it("should NOT be able to Joust over an ally", () => {
    const board: (BoardPiece | null)[][] = Array.from(
      { length: BOARD_SIZE },
      () => Array(BOARD_SIZE).fill(null),
    );
    const king: BoardPiece = { type: PIECES.KING, player: "red" };
    const ally: BoardPiece = { type: PIECES.PAWN, player: "red" };

    board[4][4] = king;
    board[5][4] = ally; // Ally in between

    const moves = getValidMoves(4, 4, king, "red", board, terrain, "2p-ns");

    expect(moves).not.toContainEqual([6, 4]);
  });

  it("should NOT be able to move into a square guarded by an enemy", () => {
    const board: (BoardPiece | null)[][] = Array.from(
      { length: BOARD_SIZE },
      () => Array(BOARD_SIZE).fill(null),
    );
    const king: BoardPiece = { type: PIECES.KING, player: "red" };
    const enemyRook: BoardPiece = { type: PIECES.ROOK, player: "yellow" };

    board[4][4] = king;
    board[0][5] = enemyRook; // Guards column 5

    const moves = getValidMoves(4, 4, king, "red", board, terrain, "2p-ns");

    // (3,5), (4,5), (5,5) are guarded by the rook
    expect(moves).not.toContainEqual([3, 5]);
    expect(moves).not.toContainEqual([4, 5]);
    expect(moves).not.toContainEqual([5, 5]);
  });

  it("should NOT be able to Joust through a guarded midpoint", () => {
    const board: (BoardPiece | null)[][] = Array.from(
      { length: BOARD_SIZE },
      () => Array(BOARD_SIZE).fill(null),
    );
    const king: BoardPiece = { type: PIECES.KING, player: "red" };
    const enemyRook: BoardPiece = { type: PIECES.ROOK, player: "yellow" };

    board[4][4] = king;
    board[5][0] = enemyRook; // Guards row 5, including the midpoint [5,4]

    const moves = getValidMoves(4, 4, king, "red", board, terrain, "2p-ns");

    // Joust to [6,4] should be blocked because midpoint [5,4] is guarded
    expect(moves).not.toContainEqual([6, 4]);
  });
});
