import type { n, GridMatrix } from "./Primitives.d.ts";

export type Coord = [n, n];
export type Coords = Coord[];
export type Dir = Coord;
export type Dirs = Coord[];
export type MoveDirections = Dirs;
export type Matrix = GridMatrix<n>;
