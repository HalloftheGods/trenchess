import { Move as mv, defineMovePattern } from "@/app/core/mechanics/moves/base";

/** Standard Knight L-jump */
export const movePatternKnight = defineMovePattern((r, c) => [
  mv.up2Left1(r, c),
  mv.up2Right1(r, c),
  mv.up1Left2(r, c),
  mv.up1Right2(r, c),
  mv.down1Left2(r, c),
  mv.down1Right2(r, c),
  mv.down2Left1(r, c),
  mv.down2Right1(r, c),
]);

export default movePatternKnight;
