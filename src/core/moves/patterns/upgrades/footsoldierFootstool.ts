import { Move as mv, defineMovePattern } from "@engine/moves/base";

/** 2-step orthogonal jump (The Footsoldier Footstool) */
export const footsoldierFootstool = defineMovePattern((r, c) => [
  mv.up(r, c, 2),
  mv.down(r, c, 2),
  mv.left(r, c, 2),
  mv.right(r, c, 2),
]);

export default footsoldierFootstool;
