import { type Coord, type Coords } from "@shared/types";

/**
 * Pure Grid Math Atoms
 */

export const getDist = (from: Coord, to: Coord): Coord => [
  Math.abs(from[0] - to[0]),
  Math.abs(from[1] - to[1]),
];

export const isSameRow = (a: Coord, b: Coord) => a[0] === b[0];
export const isSameCol = (a: Coord, b: Coord) => a[1] === b[1];

export const getMidpoint = (a: Coord, b: Coord): Coord => [
  a[0] + (b[0] - a[0]) / 2,
  a[1] + (b[1] - a[1]) / 2,
];

export const isKnightMove = (from: Coord, to: Coord): boolean => {
  const [dR, dC] = getDist(from, to);
  return (
    (dR === 2 && dC === 1) ||
    (dR === 1 && dC === 2) ||
    (dR === 3 && dC === 0) ||
    (dR === 0 && dC === 3)
  );
};

export const calculatePath = (from: Coord, to: Coord): Coords => {
  if (isKnightMove(from, to)) return [from, to];

  const path: Coords = [];
  const [fR, fC] = from;
  const [tR, tC] = to;
  const dR = Math.sign(tR - fR);
  const dC = Math.sign(tC - fC);

  let currR = fR;
  let currC = fC;

  while (currR !== tR || currC !== tC) {
    path.push([currR, currC]);
    if (currR !== tR) currR += dR;
    if (currC !== tC) currC += dC;
  }
  path.push([tR, tC]);
  return path;
};
