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
  | "bot"
  | "horseman"
  | "sniper"
  | "tank"
  | "battleknight"
  | "commander";

export interface BoardPiece {
  type: PieceType;
  player: string;
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
