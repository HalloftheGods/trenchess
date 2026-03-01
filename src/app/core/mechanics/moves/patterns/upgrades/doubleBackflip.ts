import mv from "@/app/core/mechanics/moves/base/move";
import { defineMovePattern } from "@/app/core/mechanics/moves/base/patterns";

/**
 * Jump back 2 spaces (Standard + Diagonals)
 * Does not need open space behind
 */
export const doubleBackflip = defineMovePattern((r, c) => [
  mv.down(r, c, 2), // back back 2
]);

export const doubleBackflipTrap = defineMovePattern((r, c) => [
  mv.down2Left1(r, c), // back 2, left 1
  mv.down2Right1(r, c), // back 2, right 1
]);

export default doubleBackflip;
