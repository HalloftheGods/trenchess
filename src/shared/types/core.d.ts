import type { BoardPiece, TerrainType, PieceType, GameMode } from "./game";
import type { MovePattern } from "./moves";

export interface SetupResult {
  mode: GameMode;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  mercenaryPoints?: Record<string, number>;
  capturedBy: Record<string, BoardPiece[]>;
  activePlayers: string[];
  readyPlayers: Record<string, boolean>;
  lastMove: {
    from: [number, number];
    to: [number, number];
    path: [number, number][];
    type: PieceType;
    player: string;
    isAiMove?: boolean;
  } | null;
}

export interface Move {
  from: [number, number];
  to: [number, number];
  score?: number;
}

export interface UnitBlueprint {
  type: PieceType;
  movePattern: MovePattern;
  newMovePattern?: MovePattern;
  attackPattern?: MovePattern;
  sanctuaryTerrain?: string[];
}

export interface TerrainBlueprint {
  sanctuaryUnits: PieceType[];
  allowedUnits: PieceType[];
  blockedUnits: PieceType[];
}
