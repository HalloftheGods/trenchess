import { type Coords } from "@tc.types";
import mv from "@/app/core/mechanics/moves/base/move";
import { defineMovePattern } from "@/app/core/mechanics/moves/base/patterns";

/** Sliding moves (Full distance) */
export const movePatternBishop = defineMovePattern((r, c) => {
  const moves: Coords = [];
  for (let i = 1; i < mv.BOARD_SIZE; i++) {
    moves.push(
      mv.upRight(r, c, i),
      mv.downLeft(r, c, i),
      mv.downRight(r, c, i),
      mv.upLeft(r, c, i),
    );
  }
  return moves;
});

export default movePatternBishop;
