import { BOARD_SIZE } from "@/core/primitives/game";
import {
  MAX_TERRAIN_PER_PLAYER,
  TERRAIN_TYPES,
} from "@/core/primitives/terrain";
import { PIECES } from "@/core/primitives/pieces";
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

  const getPieceArray = (piece: (typeof PIECES)[keyof typeof PIECES]) =>
    Array(piece.initialCount).fill(piece.id);

  players.forEach((p) => {
    inventory[p] = Object.values(PIECES).flatMap(getPieceArray);

    terrainInventory[p] = [
      ...Array(quota).fill(TERRAIN_TYPES.TREES),
      ...Array(quota).fill(TERRAIN_TYPES.PONDS),
      ...Array(quota).fill(TERRAIN_TYPES.RUBBLE),
      ...Array(quota).fill(TERRAIN_TYPES.DESERT),
    ] as TerrainType[];
  });

  return { board, terrain, inventory, terrainInventory };
};
