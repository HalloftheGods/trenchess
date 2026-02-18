import { TERRAIN_TYPES, PIECES, BOARD_SIZE } from "../constants";
import { getValidMoves } from "./gameLogic";
import type { PieceType, TerrainType } from "../types";

/**
 * Dynamically checks whether a unit type can traverse a given terrain type
 * by simulating placement on a board filled with that terrain and checking
 * if the unit can move into any adjacent cell of that terrain.
 *
 * This is the single source of truth — it exercises the real game logic
 * so the UI always stays in sync with actual movement rules.
 */
export function canUnitTraverseTerrain(
  unitType: PieceType,
  terrainType: TerrainType,
): boolean {
  // Flat is always traversable
  if (terrainType === TERRAIN_TYPES.FLAT) return true;

  // Build a simulated board: unit at center, target terrain all around
  const simBoard = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  const simTerrain = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT as TerrainType));

  const center = 6;

  // Fill surrounding area with the target terrain
  for (let r = center - 3; r <= center + 3; r++) {
    for (let c = center - 3; c <= center + 3; c++) {
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        simTerrain[r][c] = terrainType;
      }
    }
  }
  // Unit starts on flat ground at center
  simTerrain[center][center] = TERRAIN_TYPES.FLAT as TerrainType;

  simBoard[center][center] = { type: unitType, player: "player1" };

  const moves = getValidMoves(
    center,
    center,
    simBoard[center][center]!,
    "player1",
    simBoard,
    simTerrain,
    "2p-ns",
    1, // depth=1 to skip expensive guard checks for Commander
  );

  // If the unit can move into at least one cell of that terrain → traversable
  return moves.some(([r, c]) => simTerrain[r][c] === terrainType);
}

/**
 * Returns all non-flat terrain types that a unit can traverse.
 * Result is dynamically computed from actual game logic.
 */
export function getTraversableTerrains(unitType: PieceType): TerrainType[] {
  const terrains: TerrainType[] = [
    TERRAIN_TYPES.TREES as TerrainType,
    TERRAIN_TYPES.PONDS as TerrainType,
    TERRAIN_TYPES.RUBBLE as TerrainType,
    TERRAIN_TYPES.DESERT as TerrainType,
  ];

  return terrains.filter((t) => canUnitTraverseTerrain(unitType, t));
}

/**
 * Returns all unit types that can traverse a given terrain type.
 * The reverse of getTraversableTerrains — dynamically computed.
 */
export function getTraversableUnits(terrainType: TerrainType): PieceType[] {
  const unitTypes: PieceType[] = [
    PIECES.COMMANDER as PieceType,
    PIECES.BATTLEKNIGHT as PieceType,
    PIECES.TANK as PieceType,
    PIECES.SNIPER as PieceType,
    PIECES.HORSEMAN as PieceType,
    PIECES.BOT as PieceType,
  ];

  return unitTypes.filter((u) => canUnitTraverseTerrain(u, terrainType));
}
