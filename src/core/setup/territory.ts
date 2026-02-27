import { BOARD_SIZE } from "@constants";
import type { GameMode } from "@/shared/types";

/**
 * getPlayerCells (Atom)
 * Returns the coordinates for all cells belonging to a specific player's starting territory.
 */
export const getPlayerCells = (
  player: string,
  mode: GameMode,
): [number, number][] => {
  const cells: [number, number][] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      let isMyArea = false;

      const isNorthSouthMode = mode === "2p-ns";
      const isEastWestMode = mode === "2p-ew";

      const isTopHalf = row < 6;
      const isBottomHalf = row >= 6;
      const isLeftHalf = col < 6;
      const isRightHalf = col >= 6;

      if (isNorthSouthMode) {
        const isRedPlayer = player === "red";
        isMyArea = isRedPlayer ? isTopHalf : isBottomHalf;
      } else if (isEastWestMode) {
        const isGreenPlayer = player === "green";
        const isYellowPlayer = player === "yellow";

        if (isGreenPlayer) isMyArea = isLeftHalf;
        if (isYellowPlayer) isMyArea = isRightHalf;
      } else {
        const isPlayerRed = player === "red";
        const isPlayerYellow = player === "yellow";
        const isPlayerGreen = player === "green";
        const isPlayerBlue = player === "blue";

        const isTopLeftQuadrant = isTopHalf && isLeftHalf;
        const isTopRightQuadrant = isTopHalf && isRightHalf;
        const isBottomLeftQuadrant = isBottomHalf && isLeftHalf;
        const isBottomRightQuadrant = isBottomHalf && isRightHalf;

        if (isPlayerRed) isMyArea = isTopLeftQuadrant;
        if (isPlayerYellow) isMyArea = isTopRightQuadrant;
        if (isPlayerGreen) isMyArea = isBottomLeftQuadrant;
        if (isPlayerBlue) isMyArea = isBottomRightQuadrant;
      }

      if (isMyArea) cells.push([row, col]);
    }
  }

  return cells;
};

/**
 * getCellOwner
 * Returns the player ID who owns a specific cell based on the game mode.
 */
export const getCellOwner = (
  row: number,
  col: number,
  mode: GameMode,
): string | null => {
  const isTopHalf = row < 6;
  const isBottomHalf = row >= 6;
  const isLeftHalf = col < 6;
  const isRightHalf = col >= 6;

  if (mode === "2p-ns") {
    return isTopHalf ? "red" : "blue";
  }

  if (mode === "2p-ew") {
    return isLeftHalf ? "green" : "yellow";
  }

  // 4p mode
  if (isTopHalf && isLeftHalf) return "red";
  if (isTopHalf && isRightHalf) return "yellow";
  if (isBottomHalf && isLeftHalf) return "green";
  if (isBottomHalf && isRightHalf) return "blue";

  return null;
};

/**
 * getPlayersForMode
 * Returns the list of active players for a given mode.
 */
export const getPlayersForMode = (mode: GameMode): string[] => {
  switch (mode) {
    case null:
      return [];
    case "2p-ns":
      return ["red", "blue"];
    case "2p-ew":
      return ["green", "yellow"];
    default:
      return ["red", "yellow", "green", "blue"];
  }
};
