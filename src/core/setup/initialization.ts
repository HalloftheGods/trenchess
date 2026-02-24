import { BOARD_SIZE } from "@/constants";
import {
  MAX_TERRAIN_PER_PLAYER,
  TERRAIN_TYPES,
} from "@/constants";
import { INITIAL_ARMY } from "@/constants";
import type {
  GameMode,
  BoardPiece,
  TerrainType,
  PieceType,
  SetupResult,
} from "@/shared/types";

/**
 * createInitialState (Molecule)
 * Scaffolds the starting state for a match, including empty boards and player inventories.
 */
export const createInitialState = (
  mode: GameMode,
  players: string[],
): SetupResult => {
  const board: (BoardPiece | null)[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
    
  const terrain: TerrainType[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT as TerrainType));

  const inventory: Record<string, PieceType[]> = {};
  const terrainInventory: Record<string, TerrainType[]> = {};

  const isTwoPlayerMode = mode === "2p-ns" || mode === "2p-ew";
  const terrainQuota = isTwoPlayerMode
    ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
    : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  players.forEach((player) => {
    // Map initial army to flat list of types
    const playerUnitList = INITIAL_ARMY.flatMap((unit) => {
      const unitCount = unit.count;
      const unitType = unit.type;
      return Array(unitCount).fill(unitType);
    });
    
    inventory[player] = playerUnitList;

    const playerTerrainList = [
      ...Array(terrainQuota).fill(TERRAIN_TYPES.TREES),
      ...Array(terrainQuota).fill(TERRAIN_TYPES.PONDS),
      ...Array(terrainQuota).fill(TERRAIN_TYPES.RUBBLE),
      ...Array(terrainQuota).fill(TERRAIN_TYPES.DESERT),
    ] as TerrainType[];
    
    terrainInventory[player] = playerTerrainList;
  });

  return { board, terrain, inventory, terrainInventory };
};
