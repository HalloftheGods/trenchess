import type { GameMode, GameOverReason } from "../core";
import type { BoardPiece, LastMove } from "../state";
import type {
  NumericDictionary,
  BooleanDictionary,
  StringDictionary,
  PlayerID,
  PieceInventory,
  TerrainInventory,
  CapturedByDictionary,
  BoardGrid,
  TerrainGrid,
} from "../../base";

export interface TrenchessState {
  board: BoardGrid;
  terrain: TerrainGrid;
  inventory: PieceInventory;
  terrainInventory: TerrainInventory;
  capturedBy: CapturedByDictionary;
  lostToDesert: BoardPiece[];
  mode: GameMode;
  lastMove: LastMove | null;
  activePlayers: PlayerID[];
  readyPlayers: BooleanDictionary;
  playerMap: StringDictionary;
  winner: PlayerID | null;
  winnerReason: GameOverReason;
  activeScreen?: string;
  isGamemaster?: boolean;
  isMercenary?: boolean;
  mercenaryPoints?: NumericDictionary;
}
