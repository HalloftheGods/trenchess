import { Move as mv, defineMovePattern } from "@engine/moves/base";
import { movePatternKing } from "./core/king";

/**
 * Combined pattern for King attack:
 * Standard 1-step + 2-step orthogonal jump
 */
export const movePatternKingAttack = defineMovePattern((r, c) => [
  ...movePatternKing(r, c),
  mv.up(r, c, 2),
  mv.down(r, c, 2),
  mv.left(r, c, 2),
  mv.right(r, c, 2),
]);

export default movePatternKingAttack;
