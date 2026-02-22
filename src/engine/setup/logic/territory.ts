import { BOARD_SIZE } from "@constants/constants";
import type { GameMode } from "@engineTypes/game";

export const getPlayerCells = (
  player: string,
  mode: GameMode,
): [number, number][] => {
  const cells: [number, number][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      let isMyArea = false;
      if (mode === "2p-ns") {
        isMyArea = player === "player1" ? r < 6 : r >= 6;
      } else if (mode === "2p-ew") {
        if (player === "player3") isMyArea = c < 6;
        if (player === "player2") isMyArea = c >= 6;
      } else {
        if (player === "player1") isMyArea = r < 6 && c < 6;
        if (player === "player2") isMyArea = r < 6 && c >= 6;
        if (player === "player3") isMyArea = r >= 6 && c < 6;
        if (player === "player4") isMyArea = r >= 6 && c >= 6;
      }
      if (isMyArea) cells.push([r, c]);
    }
  }
  return cells;
};
