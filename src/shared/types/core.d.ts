import type { BoardPiece, TerrainType, PieceType, GameMode } from "./game";

export interface SetupResult {
  mode: GameMode;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  mercenaryPoints?: Record<string, number>;
}

export interface Move {
  from: [number, number];
  to: [number, number];
  score?: number;
}

export interface UnitBlueprint {
  type: PieceType;
  movePattern: (r: number, c: number) => [number, number][];
  newMovePattern?: (r: number, c: number) => [number, number][];
  attackPattern?: (r: number, c: number) => [number, number][];
  sanctuaryTerrain?: string[];
}

export interface TerrainBlueprint {
  sanctuaryUnits: PieceType[];
  allowedUnits: PieceType[];
  blockedUnits: PieceType[];
}


