import type { PieceType } from "@tc.types/game";

export const PIECES: Record<string, PieceType> = {
  PAWN: "pawn",
  KNIGHT: "knight",
  BISHOP: "bishop",
  ROOK: "rook",
  QUEEN: "queen",
  KING: "king",
} as const;

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

export const ALL_UNITS: PieceType[] = [KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN];

export const UNIT_POINTS: Record<string, number> = {
  [PAWN]: 1,
  [KNIGHT]: 3,
  [BISHOP]: 3,
  [ROOK]: 5,
  [QUEEN]: 9,
  [KING]: 15,
};

const mapToInitialArmy = ([type, count]: [PieceType, number]) => ({
  type,
  count,
});

export const CORE_INITIAL_ARMY = (
  [
    [KING, 1],
    [QUEEN, 1],
    [ROOK, 2],
    [BISHOP, 2],
    [KNIGHT, 2],
    [PAWN, 8],
  ] as [PieceType, number][]
).map(mapToInitialArmy);
