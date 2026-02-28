import type { PieceType } from "../state/PieceType";

export interface TerrainBlueprint {
  sanctuaryUnits: PieceType[];
  allowedUnits: PieceType[];
  blockedUnits: PieceType[];
}
