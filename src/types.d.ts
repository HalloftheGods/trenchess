import React from "react";

// --- Game Mode & State ---
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
  | "ctf-guide";
export type SetupMode = "terrain" | "pieces";
export type GameOverReason = "checkmate" | "stalemate" | "forfeit" | null;

// --- Terrain ---
export type TerrainType = "flat" | "trees" | "ponds" | "rubble" | "desert";

// --- Pieces ---
export type PieceType =
  | "bot"
  | "horseman"
  | "sniper"
  | "tank"
  | "battleknight"
  | "commander";

// --- Board ---
export interface BoardPiece {
  type: PieceType;
  player: string;
}

// --- Player ---
export interface PlayerConfig {
  name: string;
  color: string;
  text: string;
  bg: string;
  shadow: string;
}

// --- Army ---
export interface ArmyUnit {
  type: PieceType;
  count: number;
  emoji: string;
  bold: string;
  outlined: string;
  custom: React.FC<{ className?: string; size?: number | string }>;
  lucide: React.FC<{ className?: string; size?: number | string }>;
}

// --- Intel Panel Data ---
export interface UnitIntelEntry {
  title: string;
  desc: string;
}

export interface UnitIntelPanelEntry {
  title: string;
  role: string;
  points: number | string;
  movePattern: (r: number, c: number) => number[][];
  desc: string;
}

export interface TerrainIntelEntry {
  label: string;
  icon: React.FC<{ className?: string; size?: number | string }>;
  color: string;
  desc: string;
}

export interface TerrainInteraction {
  unit: string;
  status: "allow" | "block" | "special";
  text: string;
}

export interface TerrainIntelPanelEntry {
  label: string;
  icon: React.FC<{ className?: string; size?: number | string }>;
  color: string;
  interactions: TerrainInteraction[];
}
