import { defineMovePattern } from "@/app/core/mechanics/moves/base/patterns";
import movePatternRook from "./rook";
import movePatternBishop from "./bishop";

const getQueenMoves = (row: number, col: number) => [
  ...movePatternRook(row, col),
  ...movePatternBishop(row, col),
];

/** Sliding moves (Full distance) */
export const movePatternQueen = defineMovePattern(getQueenMoves);

export default movePatternQueen;
