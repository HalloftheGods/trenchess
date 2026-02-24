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
} from "@/shared/types";

export interface SetupResult {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
}

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

  const isTwoPlayer = mode === "2p-ns" || mode === "2p-ew";
  const quota = isTwoPlayer
    ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
    : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  players.forEach((p) => {
    inventory[p] = INITIAL_ARMY.flatMap((unit) =>
      Array(unit.count).fill(unit.type),
    );

    terrainInventory[p] = [
      ...Array(quota).fill(TERRAIN_TYPES.TREES),
      ...Array(quota).fill(TERRAIN_TYPES.PONDS),
      ...Array(quota).fill(TERRAIN_TYPES.RUBBLE),
      ...Array(quota).fill(TERRAIN_TYPES.DESERT),
    ] as TerrainType[];
  });

  return { board, terrain, inventory, terrainInventory };
};
