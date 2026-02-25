import { PIECES } from "@constants/pieces";
import type { UnitBlueprint } from "@/shared/types";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

export const UNIT_BLUEPRINTS: Record<string, UnitBlueprint> = {
  [KING]: {
    type: KING,
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
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 1, c - 1],
      [r + 1, c + 1],
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
    ],
    sanctuaryTerrain: ["mountains", "forests", "swamps"],
  },
  [QUEEN]: {
    type: QUEEN,
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
    sanctuaryTerrain: ["mountains", "forests", "swamps"],
  },
  [ROOK]: {
    type: ROOK,
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
    sanctuaryTerrain: ["swamps"],
  },
  [BISHOP]: {
    type: BISHOP,
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
    sanctuaryTerrain: ["forests"],
  },
  [KNIGHT]: {
    type: KNIGHT,
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
    sanctuaryTerrain: ["mountains"],
  },
  [PAWN]: {
    type: PAWN,
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
    sanctuaryTerrain: ["mountains", "forests", "swamps"],
  },
};
