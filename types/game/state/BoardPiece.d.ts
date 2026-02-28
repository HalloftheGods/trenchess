import type { PieceType } from "../state/PieceType";
import type { PlayerID } from "../../base";

export interface BoardPiece {
  type: PieceType;
  player: PlayerID;
}
