import type { PieceType } from "../state/PieceType";
import type { TerrainType } from "../state/TerrainType";
import type { MovePattern } from "../mechanics/MovePattern";

export interface UnitBlueprint {
  type: PieceType;
  movePattern: MovePattern;
  newMovePattern?: MovePattern;
  attackPattern?: MovePattern;
  sanctuaryTerrain?: TerrainType[];
}
