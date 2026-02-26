import { Move as mv, defineMovePattern } from "@engine/moves/base";

/** 3-step orthogonal jump (Triple Bar Jump) */
export const tripleBarJump = defineMovePattern((r, c) => [
  mv.up(r, c, 3),
  mv.down(r, c, 3),
  mv.left(r, c, 3),
  mv.right(r, c, 3),
]);

export default tripleBarJump;
