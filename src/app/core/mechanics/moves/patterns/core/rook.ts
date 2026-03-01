import { type Coords } from "@tc.types";
import mv from "@/app/core/mechanics/moves/base/move";
import { defineMovePattern } from "@/app/core/mechanics/moves/base/patterns";

/** Sliding moves (Full distance) */
export const movePatternRook = defineMovePattern((r, c) => {
  const moves: Coords = [];
  for (let i = 1; i < mv.BOARD_SIZE; i++) {
    moves.push(
      mv.up(r, c, i),
      mv.down(r, c, i),
      mv.right(r, c, i),
      mv.left(r, c, i),
    );
  }
  return moves;
});

export default movePatternRook;
