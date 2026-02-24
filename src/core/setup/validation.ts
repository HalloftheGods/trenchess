import { PIECES } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import type { PieceType, TerrainType } from "@/shared/types";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;
const { FLAT, FORESTS, SWAMPS, MOUNTAINS, DESERT, TREES, PONDS, RUBBLE } = TERRAIN_TYPES;

/**
 * canPlaceUnit (Atom)
 * Determines if a specific piece type is biologically/tactically compatible with a terrain tile.
 */
export const canPlaceUnit = (
  unitType: PieceType,
  terrainType: TerrainType,
): boolean => {
  const isDesert = terrainType === DESERT;
  const isTrees = terrainType === TREES || terrainType === FORESTS;
  const isPonds = terrainType === PONDS || terrainType === SWAMPS;
  const isRubble = terrainType === RUBBLE || terrainType === MOUNTAINS;

  const isRook = unitType === ROOK;
  const isKnight = unitType === KNIGHT;
  const isBishop = unitType === BISHOP;

  const isDesertBlockedForNonRooks = isDesert && !isRook;
  const isTreesBlockedForHeavyArmor = isTrees && (isRook || isKnight);
  const isPondsBlockedForCavalryAndSeer = isPonds && (isKnight || isBishop);
  const isRubbleBlockedForHeavyArmorAndSeer = isRubble && (isRook || isBishop);

  const isBlocked =
    isDesertBlockedForNonRooks ||
    isTreesBlockedForHeavyArmor ||
    isPondsBlockedForCavalryAndSeer ||
    isRubbleBlockedForHeavyArmorAndSeer;

  return !isBlocked;
};
