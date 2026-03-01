import { PIECES, CORE_INITIAL_ARMY } from "@constants";
import { TERRAIN_TYPES } from "@constants";
import type { PieceType, TerrainType, BoardPiece } from "@tc.types";

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

/**
 * getUnitLimit (Atom)
 * Returns the maximum allowed count for a specific unit type.
 */
export const getUnitLimit = (type: PieceType, isMercenary: boolean): number => {
  if (type === PIECES.KING) return 1;
  if (isMercenary) return Infinity;

  const armyEntry = CORE_INITIAL_ARMY.find((unit) => unit.type === type);
  return armyEntry?.count ?? 0;
};

/**
 * isWithinUnitLimits (Molecule)
 * Checks if a player has reached their limit for a specific unit type.
 */
export const isWithinUnitLimits = (
  board: (BoardPiece | null)[][],
  inventory: Record<string, PieceType[]>,
  playerId: string,
  type: PieceType,
  isMercenary: boolean = false,
): boolean => {
  const limit = getUnitLimit(type, isMercenary);
  if (limit === Infinity) return true;

  let currentCount = 0;

  // Count pieces on the board
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell && cell.type === type && cell.player === playerId) {
        currentCount++;
      }
    });
  });

  // Count pieces in inventory
  const playerInventory = inventory[playerId] || [];
  const inventoryCount = playerInventory.filter(
    (unitType) => unitType === type,
  ).length;

  currentCount += inventoryCount;

  return currentCount <= limit;
};
