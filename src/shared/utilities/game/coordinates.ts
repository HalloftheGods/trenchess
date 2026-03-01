import { BOARD_SIZE } from "@constants/game";

/**
 * Converts board coordinates (row, col) to algebraic notation (e.g., A1, B12).
 * Row 0 is the top (12), Row 11 is the bottom (1).
 * Col 0 is 'A', Col 11 is 'L'.
 */
export const toAlgebraic = (r: number, c: number): string => {
  const col = String.fromCharCode(65 + c);
  const row = BOARD_SIZE - r;
  return `${col}${row}`;
};

/**
 * Converts algebraic notation (e.g., A1, B12) to board coordinates (row, col).
 * Returns null if the notation is invalid.
 */
export const fromAlgebraic = (notation: string): [number, number] | null => {
  const match = notation.match(/^([A-L])(\d{1,2})$/i);
  if (!match) return null;

  const colChar = match[1].toUpperCase();
  const rowNum = parseInt(match[2], 10);

  const c = colChar.charCodeAt(0) - 65;
  const r = BOARD_SIZE - rowNum;

  if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
    return null;
  }

  return [r, c];
};
