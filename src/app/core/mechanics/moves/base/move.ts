import { BOARD_SIZE } from "@constants";
import type { n, Coord, MoveFn } from "@tc.types";

/**
 * Simple helper to generate relative moves from a direction vector
 */
export const move =
  (dr: n, dc: n): MoveFn =>
  (r: n, c: n, d = 1): Coord => [r + dr * d, c + dc * d];

/**
 * The Directions Molecule
 */
export default {
  BOARD_SIZE,
  up: move(-1, 0),
  down: move(1, 0),
  left: move(0, -1),
  right: move(0, 1),
  upLeft: move(-1, -1),
  upRight: move(-1, 1),
  downLeft: move(1, -1),
  downRight: move(1, 1),

  /** Knight-specific jumps (L-shapes) */
  up2Left1: move(-2, -1),
  up2Right1: move(-2, 1),
  up1Left2: move(-1, -2),
  up1Right2: move(-1, 2),
  down2Left1: move(2, -1),
  down2Right1: move(2, 1),
  down1Left2: move(1, -2),
  down1Right2: move(1, 2),
};
