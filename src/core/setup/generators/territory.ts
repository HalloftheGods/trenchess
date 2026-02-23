import { BOARD_SIZE } from "@/core/constants/core.constants";
import type { GameMode } from "@/shared/types/game";

export const getPlayerCells = (
  player: string,
  mode: GameMode,
): [number, number][] => {
  const cells: [number, number][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      let isMyArea = false;
      if (mode === "2p-ns") {
        isMyArea = player === "red" ? r < 6 : r >= 6;
      } else if (mode === "2p-ew") {
        if (player === "green") isMyArea = c < 6;
        if (player === "yellow") isMyArea = c >= 6;
      } else {
        if (player === "red") isMyArea = r < 6 && c < 6;
        if (player === "yellow") isMyArea = r < 6 && c >= 6;
        if (player === "green") isMyArea = r >= 6 && c < 6;
        if (player === "blue") isMyArea = r >= 6 && c >= 6;
      }
      if (isMyArea) cells.push([r, c]);
    }
  }
  return cells;
};
