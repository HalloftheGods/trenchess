import React from "react";
import type { MovePattern } from "./moves";

export type GameMode = "2p-ns" | "2p-ew" | "4p" | "2v2" | null;

export interface TacticalConfig {
  id: GameMode;
  name: string;
  players: string[];
  quota: number;
  layout: "vertical" | "horizontal" | "quadrant";
  isCoop?: boolean;
}

export type GameState =
  | "menu"
  | "how-to-play"
  | "gamemaster"
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

export type TerrainType =
  | "flat"
  | "forests"
  | "swamps"
  | "mountains"
  | "desert";

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

export interface TrenchessState {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  capturedBy: Record<string, BoardPiece[]>;
  lostToDesert: BoardPiece[];
  mode: GameMode;
  lastMove: {
    from: [number, number];
    to: [number, number];
    path: [number, number][];
    type: PieceType;
    player: string;
    isAiMove?: boolean;
  } | null;
  activePlayers: string[];
  readyPlayers: Record<string, boolean>;
  playerMap: Record<string, string>;
  winner: string | null;
  winnerReason: GameOverReason;
  isGamemaster?: boolean;
  isMercenary?: boolean;
  mercenaryPoints?: Record<string, number>;
}

export interface TrenchessSetupData {
  mode?: GameMode;
  board?: (BoardPiece | null)[][];
  terrain?: TerrainType[][];
  inventory?: Record<string, PieceType[]>;
  terrainInventory?: Record<string, TerrainType[]>;
  isGamemaster?: boolean;
  isMercenary?: boolean;
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

export type PieceStyle = "emoji" | "bold" | "outlined" | "custom" | "lucide";

export interface UnitDetails {
  title: string;
  subtitle?: string;
  role: string;
  desc?: string[];
  levelUp?: {
    title: string;
    stats: string[];
    sanctuaryTerrain?: TerrainType[];
  };
  movePattern: MovePattern;
  newMovePattern?: MovePattern;
  attackPattern?: MovePattern;
}

export interface UnitColors {
  text: string;
  bg: string;
  border: string;
  shadow: string;
  ribbonBg: string;
  ring: string;
}

export interface TerrainDetail {
  key: string;
  name: string;
  terrainTypeKey: TerrainType;
  label: string;
  desc: string;
  sanctuaryUnits: PieceType[];
  allowedUnits: PieceType[];
  blockedUnits: PieceType[];
  subtitle?: string;
  tagline?: string;
  flavorTitle?: string;
  flavorStats?: string[];
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  bg?: string;
  text?: string;
  border?: string;
  ring?: string;
  headerBg?: string;
  iconBg?: string;
  color?: {
    bg: string;
    text: string;
    border: string;
    headerBg: string;
    iconBg?: string;
  };
}
