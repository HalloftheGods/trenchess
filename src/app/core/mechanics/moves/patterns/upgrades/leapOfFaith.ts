import mv from "@/app/core/mechanics/moves/base/move";
import { defineMovePattern } from "@/app/core/mechanics/moves/base/patterns";

/** 2-step orthogonal jump (The Leap of Faith) */
export const leapOfFaith = defineMovePattern((r, c) => [
  mv.up(r, c, 2),
  mv.down(r, c, 2),
  mv.left(r, c, 2),
  mv.right(r, c, 2),
]);

export default leapOfFaith;
