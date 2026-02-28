import { PIECES } from "@constants";
import type { PieceType, TerrainType } from "@tc.types";
import { canUnitTraverseTerrain } from "./canUnitTraverseTerrain";

/**
 * getTraversableUnits (Molecule)
 */
export function getTraversableUnits(terrainType: TerrainType): PieceType[] {
  const allUnitTypes: PieceType[] = [
    PIECES.KING as PieceType,
    PIECES.QUEEN as PieceType,
    PIECES.ROOK as PieceType,
    PIECES.BISHOP as PieceType,
    PIECES.KNIGHT as PieceType,
    PIECES.PAWN as PieceType,
  ];

  const matchByTerrainTraversability = (unit: PieceType) =>
    canUnitTraverseTerrain(unit, terrainType);
  return allUnitTypes.filter(matchByTerrainTraversability);
}
