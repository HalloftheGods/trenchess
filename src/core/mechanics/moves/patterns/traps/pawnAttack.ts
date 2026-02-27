import { Move as mv, defineMovePattern } from "@mechanics/moves/base";

/** Pawn-specific mechanics */
export const movePatternPawnAttack = defineMovePattern((r, c) => [
  mv.upLeft(r, c), // forward left
  mv.upRight(r, c), // forward right
  mv.down2Left1(r, c), // backflip left
  mv.down2Right1(r, c), // backflip right
]);

export default movePatternPawnAttack;
