import type { Coord, PlayerID, b } from "../../base";
import type { PieceType } from "./PieceType";

export interface LastMove {
  from: Coord;
  to: Coord;
  path: Coord[];
  type: PieceType;
  player: PlayerID;
  isAiMove?: b;
}
