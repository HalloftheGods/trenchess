import type { PieceType } from "@tc.types/game/state/PieceType";
import type { TerrainType } from "@tc.types/game/state/TerrainType";
import type { BoardPiece } from "@tc.types/game/state/BoardPiece";
import type { PlayerDictionary, GridMatrix, nu } from "./Primitives.d.ts";

export type BoardGrid = GridMatrix<BoardPiece | nu>;
export type TerrainGrid = GridMatrix<TerrainType>;

export type PieceInventory = PlayerDictionary<PieceType[]>;
export type TerrainInventory = PlayerDictionary<TerrainType[]>;
export type CapturedByDictionary = PlayerDictionary<BoardPiece[]>;
export type Captured = CapturedByDictionary;
