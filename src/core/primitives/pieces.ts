import type { PieceType } from "@/shared/types/game";

export const PIECES: Record<string, PieceType> = {
  PAWN: "pawn",
  KNIGHT: "knight",
  BISHOP: "bishop",
  ROOK: "rook",
  QUEEN: "queen",
  KING: "king",
};

export const ALL_UNITS: PieceType[] = [
  PIECES.KING,
  PIECES.QUEEN,
  PIECES.ROOK,
  PIECES.BISHOP,
  PIECES.KNIGHT,
  PIECES.PAWN,
];

export const INITIAL_ARMY = [
  { type: PIECES.KING, count: 1 },
  { type: PIECES.QUEEN, count: 1 },
  { type: PIECES.ROOK, count: 2 },
  { type: PIECES.BISHOP, count: 2 },
  { type: PIECES.KNIGHT, count: 2 },
  { type: PIECES.PAWN, count: 8 },
];
