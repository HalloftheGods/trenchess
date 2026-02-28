import type { GameMode } from "../core";
import type { LastMove } from "../state";
import type {
  NumericDictionary,
  BooleanDictionary,
  PlayerID,
  PieceInventory,
  TerrainInventory,
  CapturedByDictionary,
  BoardGrid,
  TerrainGrid,
} from "../../base";

export interface SetupResult {
  mode: GameMode;
  board: BoardGrid;
  terrain: TerrainGrid;
  inventory: PieceInventory;
  terrainInventory: TerrainInventory;
  mercenaryPoints?: NumericDictionary;
  capturedBy: CapturedByDictionary;
  activePlayers: PlayerID[];
  readyPlayers: BooleanDictionary;
  lastMove: LastMove | null;
}
