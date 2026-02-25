import { PIECES } from "@constants";
import { TERRAIN_TYPES } from "@constants";
import type { PieceType, TerrainType } from "@/shared/types";

const { ROOK, BISHOP, KNIGHT } = PIECES;
const { FORESTS, SWAMPS, MOUNTAINS, DESERT } = TERRAIN_TYPES;

/**
 * canPlaceUnit (Atom)
 * Determines if a specific piece type is biologically/tactically compatible with a terrain tile.
 */
export const canPlaceUnit = (
  unitType: PieceType,
  terrainType: TerrainType,
): boolean => {
  const isDesert = terrainType === DESERT;
  const isForest = terrainType === FORESTS;
  const isSwamp = terrainType === SWAMPS;
  const isMountain = terrainType === MOUNTAINS;

  const isRook = unitType === ROOK;
  const isKnight = unitType === KNIGHT;
  const isBishop = unitType === BISHOP;

  const isDesertBlockedForNonRooks = isDesert && !isRook;
  const isForestBlockedForHeavyArmor = isForest && (isRook || isKnight);
  const isSwampBlockedForCavalryAndSeer = isSwamp && (isKnight || isBishop);
  const isMountainBlockedForHeavyArmorAndSeer =
    isMountain && (isRook || isBishop);

  const isBlocked =
    isDesertBlockedForNonRooks ||
    isForestBlockedForHeavyArmor ||
    isSwampBlockedForCavalryAndSeer ||
    isMountainBlockedForHeavyArmorAndSeer;

  return !isBlocked;
};
