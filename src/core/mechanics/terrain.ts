import { BOARD_SIZE } from "@/constants";
import { PIECES } from "@/constants";
import { TERRAIN_TYPES, TERRAIN_DETAILS } from "@/constants";
import type { PieceType, TerrainType } from "@/shared/types";
import { getValidMoves } from "./movement/movementLogic";

/**
 * isUnitProtected (Atom)
 * Checks if a unit type enjoys sanctuary protection on a specific terrain tile.
 */
export const isUnitProtected = (
  unitType: string,
  terrainType: TerrainType | string,
): boolean => {
  const matchByTerrainKey = (terrain: { key: string }) => terrain.key === terrainType;
  const terrainInfo = TERRAIN_DETAILS.find(matchByTerrainKey);
  
  const hasTerrainInfo = !!terrainInfo;
  if (!hasTerrainInfo) return false;
  
  const isSanctuaryUnit = terrainInfo!.sanctuaryUnits.includes(unitType as PieceType);
  return isSanctuaryUnit;
};

/**
 * canUnitTraverseTerrain (Molecule)
 * Dynamically checks whether a unit type can traverse a given terrain type
 * by simulating movement on a sample board.
 */
export function canUnitTraverseTerrain(
  unitType: PieceType,
  terrainType: TerrainType,
): boolean {
  const isFlatTerrain = terrainType === TERRAIN_TYPES.FLAT;
  if (isFlatTerrain) return true;

  const simulationBoard = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
    
  const simulationTerrain = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT as TerrainType));

  const centerPoint = 6;
  const areaOffset = 3;

  for (let row = centerPoint - areaOffset; row <= centerPoint + areaOffset; row++) {
    for (let col = centerPoint - areaOffset; col <= centerPoint + areaOffset; col++) {
      const isRowInBounds = row >= 0 && row < BOARD_SIZE;
      const isColInBounds = col >= 0 && col < BOARD_SIZE;
      const isWithinSimulationArea = isRowInBounds && isColInBounds;
      
      if (isWithinSimulationArea) {
        simulationTerrain[row][col] = terrainType;
      }
    }
  }
  
  simulationTerrain[centerPoint][centerPoint] = TERRAIN_TYPES.FLAT as TerrainType;
  simulationBoard[centerPoint][centerPoint] = { type: unitType, player: "red" };

  const validMoves = getValidMoves(
    centerPoint,
    centerPoint,
    simulationBoard[centerPoint][centerPoint]!,
    "red",
    simulationBoard,
    simulationTerrain,
    "2p-ns",
    1,
  );

  const canEnterTerrainTile = validMoves.some(([row, col]) => {
    const isTargetTerrainMatch = simulationTerrain[row][col] === terrainType;
    return isTargetTerrainMatch;
  });
  
  return canEnterTerrainTile;
}

/**
 * getTraversableTerrains (Molecule)
 */
export function getTraversableTerrains(unitType: PieceType): TerrainType[] {
  const allTerrainTypes: TerrainType[] = [
    TERRAIN_TYPES.TREES as TerrainType,
    TERRAIN_TYPES.PONDS as TerrainType,
    TERRAIN_TYPES.RUBBLE as TerrainType,
    TERRAIN_TYPES.DESERT as TerrainType,
  ];

  const matchByUnitTraversability = (terrain: TerrainType) => canUnitTraverseTerrain(unitType, terrain);
  return allTerrainTypes.filter(matchByUnitTraversability);
}

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

  const matchByTerrainTraversability = (unit: PieceType) => canUnitTraverseTerrain(unit, terrainType);
  return allUnitTypes.filter(matchByTerrainTraversability);
}
