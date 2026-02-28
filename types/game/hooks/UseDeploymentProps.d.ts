import type { GameMode } from "../core/GameMode";
import type { GameState } from "../core/GameState";
import type { TerrainType } from "../game/TerrainType";
import type { BoardPiece } from "../game/BoardPiece";
import type { PieceType } from "../game/PieceType";

export interface UseDeploymentProps {
  mode: GameMode;
  gameState: GameState;
  terrain?: TerrainType[][];
  setTerrain?: (terrain: TerrainType[][]) => void;
  board?: (BoardPiece | null)[][];
  setBoard?: (board: (BoardPiece | null)[][]) => void;
  activePlayers: string[];
  turn: string;
  localPlayerName?: string;
  layoutName?: string;
  setInventory?: (inventory: Record<string, PieceType[]>) => void;
}
