import { Move as mv, defineMovePattern } from "@mechanics/moves/base";

/** 1-step in all 8 directions */
export const movePatternKing = defineMovePattern((r, c) => [
  mv.up(r, c),
  mv.down(r, c),
  mv.left(r, c),
  mv.right(r, c),
  mv.upLeft(r, c),
  mv.upRight(r, c),
  mv.downLeft(r, c),
  mv.downRight(r, c),
]);

export default movePatternKing;
