import { BOARD_SIZE } from "@/constants";
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
