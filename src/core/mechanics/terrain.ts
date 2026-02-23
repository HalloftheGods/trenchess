import { BOARD_SIZE } from "@/core/primitives/game";
import { PIECES } from "@/core/primitives/pieces";
import { TERRAIN_TYPES, TERRAIN_DETAILS } from "@/core/primitives/terrain";
import type { PieceType, TerrainType } from "@/shared/types/game";
import { getValidMoves } from "@/core/mechanics/movement/movementLogic";

export const isUnitProtected = (
  unitType: string,
  terrainType: TerrainType | string,
): boolean => {
  const terrainInfo = TERRAIN_DETAILS.find((t) => t.key === terrainType);
  if (!terrainInfo) return false;
  return terrainInfo.sanctuaryUnits.includes(unitType as PieceType);
};

/**
 * Dynamically checks whether a unit type can traverse a given terrain type
 * by simulating placement on a board filled with that terrain and checking
 * if the unit can move into any adjacent cell of that terrain.
 */
export function canUnitTraverseTerrain(
  unitType: PieceType,
  terrainType: TerrainType,
): boolean {
  if (terrainType === TERRAIN_TYPES.FLAT) return true;

  const simBoard = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  const simTerrain = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT as TerrainType));

  const center = 6;

  for (let r = center - 3; r <= center + 3; r++) {
    for (let c = center - 3; c <= center + 3; c++) {
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        simTerrain[r][c] = terrainType;
      }
    }
  }
  simTerrain[center][center] = TERRAIN_TYPES.FLAT as TerrainType;
  simBoard[center][center] = { type: unitType, player: "red" };

  const moves = getValidMoves(
    center,
    center,
    simBoard[center][center]!,
    "red",
    simBoard,
    simTerrain,
    "2p-ns",
    1,
  );

  return moves.some(([r, c]) => simTerrain[r][c] === terrainType);
}

export function getTraversableTerrains(unitType: PieceType): TerrainType[] {
  const terrains: TerrainType[] = [
    TERRAIN_TYPES.TREES as TerrainType,
    TERRAIN_TYPES.PONDS as TerrainType,
    TERRAIN_TYPES.RUBBLE as TerrainType,
    TERRAIN_TYPES.DESERT as TerrainType,
  ];

  return terrains.filter((t) => canUnitTraverseTerrain(unitType, t));
}

export function getTraversableUnits(terrainType: TerrainType): PieceType[] {
  const unitTypes: PieceType[] = [
    PIECES.KING as PieceType,
    PIECES.QUEEN as PieceType,
    PIECES.ROOK as PieceType,
    PIECES.BISHOP as PieceType,
    PIECES.KNIGHT as PieceType,
    PIECES.PAWN as PieceType,
  ];

  return unitTypes.filter((u) => canUnitTraverseTerrain(u, terrainType));
}
