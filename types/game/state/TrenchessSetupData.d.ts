import type { GameMode } from "../core/GameMode";
import type { BoardPiece } from "./BoardPiece";
import type { TerrainType } from "./TerrainType";
import type { PieceType } from "./PieceType";

export interface TrenchessSetupData {
  mode?: GameMode;
  board?: (BoardPiece | null)[][];
  terrain?: TerrainType[][];
  inventory?: Record<string, PieceType[]>;
  terrainInventory?: Record<string, TerrainType[]>;
  isGamemaster?: boolean;
  isMercenary?: boolean;
}
