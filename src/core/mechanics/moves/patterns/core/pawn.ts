import { Move as mv, defineMovePattern } from "@mechanics/moves/base";

/** Pawn-specific mechanics */
export const movePatternPawn = defineMovePattern((r, c) => [mv.up(r, c)]);

export const trapPatternPawn = defineMovePattern((r, c) => [
  mv.upLeft(r, c),
  mv.upRight(r, c),
]);

export default {
  movePatternPawn,
  trapPatternPawn,
};
