import React from "react";

export type GameMode = "2p-ns" | "2p-ew" | "4p" | "2v2";
export type GameState =
  | "menu"
  | "how-to-play"
  | "setup"
  | "play"
  | "finished"
  | "zen-garden"
  | "library"
  | "tutorial"
  | "ctf-guide"
  | "trench-guide"
  | "chess-guide";
export type SetupMode = "terrain" | "pieces";
export type GameOverReason = "checkmate" | "stalemate" | "forfeit" | null;

export type TerrainType = "flat" | "trees" | "ponds" | "rubble" | "desert";

export type PieceType =
  | "pawn"
  | "knight"
  | "bishop"
  | "rook"
  | "queen"
  | "king";

export interface BoardPiece {
  type: PieceType;
  player: string;
}

export interface TrenchGameState {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  capturedBy: Record<string, BoardPiece[]>;
  mode: GameMode;
  activePlayers: string[];
  readyPlayers: Record<string, boolean>;
  playerMap: Record<string, string>;
}

export interface TrenchGameSetupData {
  mode?: GameMode;
  board?: (BoardPiece | null)[][];
  terrain?: TerrainType[][];
  inventory?: Record<string, PieceType[]>;
  terrainInventory?: Record<string, TerrainType[]>;
}

export interface PlayerConfig {
  name: string;
  color: string;
  text: string;
  bg: string;
  shadow: string;
}

export interface ArmyUnit {
  type: PieceType;
  count: number;
  emoji: string;
  bold: string;
  outlined: string;
  custom: React.FC<{ className?: string; size?: number | string }>;
  lucide: React.FC<{ className?: string; size?: number | string }>;
}

export interface PreviewConfig {
  mode?: GameMode | null;
  protocol?:
    | "custom"
    | "zen-garden"
    | "classic"
    | "quick"
    | "terrainiffic"
    | null;
  label?: string;
  hideUnits?: boolean;
  highlightCells?: [number, number][];
  showIcons?: boolean;
  forcedTerrain?: TerrainType | null;
  useDefaultFormation?: boolean;
  highlightOuterSquares?: boolean;
  [key: string]: unknown;
}

export interface SeedItem {
  id: string;
  name: string;
  seed: string;
  mode: string;
  createdAt: string;
}

export const PIECE_STYLES = [
  "emoji",
  "bold",
  "outlined",
  "custom",
  "lucide",
] as const;
export type PieceStyle = (typeof PIECE_STYLES)[number];
