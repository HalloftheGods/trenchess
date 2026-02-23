import { BOARD_SIZE } from "@/core/primitives/game";
import { TERRAIN_TYPES } from "@/core/primitives/terrain";
import type { TerrainType, BoardPiece } from "@/shared/types";

export const buildBoard = (): (BoardPiece | null)[][] =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

export const buildTerrain = (): TerrainType[][] =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT));

export { serializeGame } from "@/shared/utils/gameUrl";
