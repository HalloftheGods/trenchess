import { type Coords } from "@shared/types";
import { Move as mv, defineMovePattern } from "@mechanics/moves/base";

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
