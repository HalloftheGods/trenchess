import { getPlayerCells } from "@/core/setup/territory";
import type { GameMode, Coord } from "@shared/types";

/**
 * Checks if a given coordinate is within a player's starting territory for the current mode.
 */
export const isWithinTerritory = (
  playerId: string,
  mode: GameMode,
  coord: Coord,
): boolean => {
  const [row, col] = coord;
  const myCells = getPlayerCells(playerId, mode);
  return myCells.some(([r, c]) => r === row && c === col);
};
