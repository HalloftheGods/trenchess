import { BOARD_SIZE } from "@constants";
import { MAX_TERRAIN_PER_PLAYER, TERRAIN_TYPES } from "@constants";
import { INITIAL_ARMY } from "@constants";
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
  isMercenary?: boolean,
): SetupResult => {
  const board: (BoardPiece | null)[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  const terrain: TerrainType[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT as TerrainType));

  const inventory: Record<string, PieceType[]> = {};
  const terrainInventory: Record<string, TerrainType[]> = {};
  const mercenaryPoints: Record<string, number> = {};

  const isTwoPlayerMode = mode === "2p-ns" || mode === "2p-ew";
  const terrainQuota = isTwoPlayerMode
    ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
    : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  players.forEach((player) => {
    // Map initial army to flat list of types
    const playerUnitList = isMercenary 
      ? (["king"] as PieceType[]) 
      : INITIAL_ARMY.flatMap((unit) => {
          const unitCount = unit.count;
          const unitType = unit.type;
          return Array(unitCount).fill(unitType);
        });

    inventory[player] = playerUnitList;
    if (isMercenary) {
      mercenaryPoints[player] = 39;
    }

    const playerTerrainList = [
      ...Array(terrainQuota).fill(TERRAIN_TYPES.FORESTS),
      ...Array(terrainQuota).fill(TERRAIN_TYPES.SWAMPS),
      ...Array(terrainQuota).fill(TERRAIN_TYPES.MOUNTAINS),
      ...Array(terrainQuota).fill(TERRAIN_TYPES.DESERT),
    ] as TerrainType[];

    terrainInventory[player] = playerTerrainList;
  });

  return { mode, board, terrain, inventory, terrainInventory, mercenaryPoints };
};
