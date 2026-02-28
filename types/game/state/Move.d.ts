import type { Coord, n } from "../../base";

export interface Move {
  from: Coord;
  to: Coord;
  score?: n;
}
