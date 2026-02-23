import { PIECES } from "@/core/primitives/pieces";
import type { PieceType } from "@/shared/types/game";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

export interface UnitBlueprint {
  type: PieceType;
  movePattern: (r: number, c: number) => [number, number][];
  newMovePattern?: (r: number, c: number) => [number, number][];
  attackPattern?: (r: number, c: number) => [number, number][];
  sanctuaryTerrain?: string[];
}

export const UNIT_BLUEPRINTS: Record<string, UnitBlueprint> = {
  [KING.id]: {
    type: KING.id,
    movePattern: (r: number, c: number) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 1, c - 1],
      [r + 1, c + 1],
    ],
    newMovePattern: (r: number, c: number) => [
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
    ],
    attackPattern: (r: number, c: number) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ],
    sanctuaryTerrain: ["rubble", "trees", "ponds"],
  },
  [QUEEN.id]: {
    type: QUEEN.id,
    movePattern: (r: number, c: number) => {
      const moves: [number, number][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
    newMovePattern: (r: number, c: number) =>
      [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ].map(([dr, dc]) => [r + dr, c + dc]) as [number, number][],
    sanctuaryTerrain: ["rubble", "trees", "ponds"],
  },
  [ROOK.id]: {
    type: ROOK.id,
    movePattern: (r: number, c: number) => {
      const moves: [number, number][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
      }
      return moves;
    },
    newMovePattern: (r: number, c: number) => [
      [r - 1, c - 1],
      [r + 1, c - 1],
      [r + 1, c + 1],
      [r - 1, c + 1],
    ],
    sanctuaryTerrain: ["ponds"],
  },
  [BISHOP.id]: {
    type: BISHOP.id,
    movePattern: (r: number, c: number) => {
      const moves: [number, number][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
    newMovePattern: (r: number, c: number) => [
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
    ],
    sanctuaryTerrain: ["trees"],
  },
  [KNIGHT.id]: {
    type: KNIGHT.id,
    movePattern: (r: number, c: number) => [
      [r - 2, c - 1],
      [r - 2, c + 1],
      [r - 1, c - 2],
      [r - 1, c + 2],
      [r + 1, c - 2],
      [r + 1, c + 2],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
    newMovePattern: (r: number, c: number) => [
      [r + 3, c],
      [r - 3, c],
      [r, c - 3],
      [r, c + 3],
    ],
    sanctuaryTerrain: ["rubble"],
  },
  [PAWN.id]: {
    type: PAWN.id,
    movePattern: (r: number, c: number) => [[r - 1, c]],
    newMovePattern: (r: number, c: number) => [
      [r + 2, c],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
    attackPattern: (r: number, c: number) => [
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
    sanctuaryTerrain: ["rubble", "trees", "ponds"],
  },
};
