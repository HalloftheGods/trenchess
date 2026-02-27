import { Move as mv, defineMovePattern } from "@mechanics/moves/base";

/** 1-step diagonal jump (The 4 Corners Fortnight) */
export const fourCornersFortnight = defineMovePattern((r, c) => [
  mv.upLeft(r, c),
  mv.upRight(r, c),
  mv.downLeft(r, c),
  mv.downRight(r, c),
]);

export default fourCornersFortnight;
