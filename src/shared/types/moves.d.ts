/** Directional coordinate types for movement logic */
export type n = number;
export type Coord = [number, number];
export type Coords = Coord[];
export type MoveFn = (r: number, c: number, d?: number) => Coord;
export type MovePattern = (r: number, c: number) => Coords;
