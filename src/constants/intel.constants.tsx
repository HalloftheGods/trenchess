import React from "react";
import { Waves, Trees, Mountain } from "lucide-react";
import { DesertIcon } from "@/app/routes/game/components/atoms/UnitIcons";
import { PIECES } from "@engineConfigs/unitDetails";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import type { PieceType } from "@engineTypes/game";
import type {
  UnitIntelPanelEntry,
  TerrainIntelPanelEntry,
} from "@engineTypes/guide";

export interface TerrainDef {
  name: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  terrainTypeKey: string;
}

export type MovePatternFn = (r: number, c: number) => number[][];

// --- Detailed intel data for the panel ---
export const UNIT_INTEL_PANEL: Record<string, UnitIntelPanelEntry> = {
  [PIECES.KING]: {
    title: "Commander",
    role: "Leader",
    points: "∞",
    movePattern: (r, c) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 1, c - 1],
      [r + 1, c + 1],
    ],
    desc: "The Leader. Capture to win.",
  },
  [PIECES.QUEEN]: {
    title: "BattleKnight",
    role: "Elite",
    points: 9,
    movePattern: (r, c) => {
      const moves: number[][] = [];
      const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];
      knightMoves.forEach(([dr, dc]) => moves.push([r + dr, c + dc]));
      for (let i = 1; i < 8; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
    desc: "Moves like Queen + Horseman. Jump tundra and units in L-shape.",
  },
  [PIECES.ROOK]: {
    title: "Tank",
    role: "Heavy Armor",
    points: 5,
    movePattern: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 8; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
      }
      return moves;
    },
    desc: "Traverses Swamps. Claims Tundra.",
  },
  [PIECES.BISHOP]: {
    title: "Sniper",
    role: "Ranged",
    points: 3,
    movePattern: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 8; i++) {
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
    desc: "Hides in Forest. Diagonals only.",
  },
  [PIECES.KNIGHT]: {
    title: "Horseman",
    role: "Cavalry",
    points: 3,
    movePattern: (r, c) => [
      [r - 2, c - 1],
      [r - 2, c + 1],
      [r - 1, c - 2],
      [r - 1, c + 2],
      [r + 1, c - 2],
      [r + 1, c + 2],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
    desc: "Jumps tundra/units. Agile in Mountains.",
  },
  [PIECES.PAWN]: {
    title: "Bot",
    role: "Infantry",
    points: 1,
    movePattern: (r, c) => [[r - 1, c]],
    desc: "Moves forward 1. All-Terrain Walker.",
  },
};

export const TERRAIN_INTEL_PANEL: Record<string, TerrainIntelPanelEntry> = {
  [TERRAIN_TYPES.PONDS]: {
    label: "Swamps",
    icon: Waves,
    color: "brand-blue",
    interactions: [
      { unit: "Tank", status: "allow", text: "Pushes Through" },
      { unit: "BattleKnight", status: "allow", text: "Can Enter" },
      { unit: "Bot", status: "allow", text: "Slowly Wades" },
      { unit: "Commander", status: "allow", text: "Can Enter" },
      { unit: "Horseman", status: "block", text: "Bogged Down" },
      { unit: "Sniper", status: "block", text: "Bogged Down" },
    ],
  },
  [TERRAIN_TYPES.TREES]: {
    label: "Forests",
    icon: Trees,
    color: "emerald",
    interactions: [
      { unit: "Sniper", status: "allow", text: "Perfect Cover" },
      { unit: "BattleKnight", status: "allow", text: "Can Enter" },
      { unit: "Bot", status: "allow", text: "Slowly Passes" },
      { unit: "Commander", status: "allow", text: "Can Enter" },
      { unit: "Tank", status: "block", text: "Too Dense" },
      { unit: "Horseman", status: "block", text: "Too Dense" },
    ],
  },
  [TERRAIN_TYPES.RUBBLE]: {
    label: "Mountains",
    icon: Mountain,
    color: "brand-red",
    interactions: [
      { unit: "Horseman", status: "allow", text: "Agile Climb" },
      { unit: "BattleKnight", status: "allow", text: "Can Enter" },
      { unit: "Bot", status: "allow", text: "Climbs Over" },
      { unit: "Commander", status: "allow", text: "Can Enter" },
      { unit: "Tank", status: "block", text: "Too Steep" },
      { unit: "Sniper", status: "block", text: "No Line of Sight" },
    ],
  },
  [TERRAIN_TYPES.DESERT]: {
    label: "Desert",
    icon: DesertIcon,
    color: "amber",
    interactions: [
      { unit: "Tank", status: "allow", text: "Traverses Dunes" },
      { unit: "Others", status: "block", text: "Impassable" },
    ],
  },
};

// ── Terrain definitions ──────────────────────────────────────────────
export const TERRAIN_LIST: TerrainDef[] = [
  {
    name: "Forests",
    icon: <Trees />,
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/40",
    terrainTypeKey: TERRAIN_TYPES.TREES,
  },
  {
    name: "Swamps",
    icon: <Waves />,
    bg: "bg-brand-blue/10",
    text: "text-brand-blue",
    border: "border-brand-blue/40",
    terrainTypeKey: TERRAIN_TYPES.PONDS,
  },
  {
    name: "Mountains",
    icon: <Mountain />,
    bg: "bg-brand-red/10",
    text: "text-brand-red",
    border: "border-brand-red/40",
    terrainTypeKey: TERRAIN_TYPES.RUBBLE,
  },
  {
    name: "Desert",
    icon: <DesertIcon className="w-6 h-6" />,
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/40",
    terrainTypeKey: TERRAIN_TYPES.DESERT,
  },
];

// ── Unit color palette ───────────────────────────────────────────────
export const UNIT_COLORS: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  [PIECES.KING]: {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/40",
  },
  [PIECES.QUEEN]: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
  },
  [PIECES.ROOK]: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
  },
  [PIECES.BISHOP]: {
    text: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
  },
  [PIECES.KNIGHT]: {
    text: "text-brand-red",
    bg: "bg-brand-red/10",
    border: "border-brand-red/40",
  },
  [PIECES.PAWN]: {
    text: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/40",
  },
};

// ── Unit display names ───────────────────────────────────────────────
export const UNIT_NAMES: Record<string, string> = {
  [PIECES.KING]: "King",
  [PIECES.QUEEN]: "Queen",
  [PIECES.ROOK]: "Rooks",
  [PIECES.BISHOP]: "Bishops",
  [PIECES.KNIGHT]: "Knights",
  [PIECES.PAWN]: "Pawns",
};

// ── Move‑pattern definitions (same as HowToPlay) ────────────────────
export const MOVE_PATTERNS: Record<
  string,
  { move: MovePatternFn; newMove?: MovePatternFn }
> = {
  [PIECES.KING]: {
    move: (r, c) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 1, c - 1],
      [r + 1, c + 1],
    ],
    newMove: (r, c) => [
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
    ],
  },
  [PIECES.QUEEN]: {
    move: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
    newMove: (r, c) =>
      [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ].map(([dr, dc]) => [r + dr, c + dc]),
  },
  [PIECES.ROOK]: {
    move: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
      }
      return moves;
    },
  },
  [PIECES.BISHOP]: {
    move: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
  },
  [PIECES.KNIGHT]: {
    move: (r, c) => [
      [r - 2, c - 1],
      [r - 2, c + 1],
      [r - 1, c - 2],
      [r - 1, c + 2],
      [r + 1, c - 2],
      [r + 1, c + 2],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
  },
  [PIECES.PAWN]: {
    move: (r, c) => [[r - 1, c]],
    newMove: (r, c) => [[r + 2, c]],
  },
};

// ── Terrain traversal check ──────────────────────────────────────────
export const UNIT_TERRAIN_KEYS: Record<string, string[]> = {
  [PIECES.KING]: ["mt", "tr", "wv"],
  [PIECES.QUEEN]: ["mt", "tr", "wv"],
  [PIECES.ROOK]: ["wv", "ds"],
  [PIECES.BISHOP]: ["tr"],
  [PIECES.KNIGHT]: ["mt"],
  [PIECES.PAWN]: ["mt", "tr", "wv"],
};

export const TERRAIN_NAME_TO_KEY: Record<string, string> = {
  Mountains: "mt",
  Forests: "tr",
  Swamps: "wv",
  Desert: "ds",
};

export function canTraverse(terrainName: string, unitType: string): boolean {
  const keys = UNIT_TERRAIN_KEYS[unitType] || [];
  const needed = TERRAIN_NAME_TO_KEY[terrainName];
  return keys.includes(needed);
}

// ── All units list ───────────────────────────────────────────────────
export const ALL_UNITS: PieceType[] = [
  PIECES.KING as PieceType,
  PIECES.QUEEN as PieceType,
  PIECES.ROOK as PieceType,
  PIECES.BISHOP as PieceType,
  PIECES.KNIGHT as PieceType,
  PIECES.PAWN as PieceType,
];

// ── Unit display names (Trench Card) ─────────────────────────────────
export const CHESS_NAME: Record<string, { chess: string; role: string }> = {
  [PIECES.ROOK]: { chess: "Rook", role: "Heavy Armor" },
  [PIECES.BISHOP]: { chess: "Bishop", role: "Ranged" },
  [PIECES.KNIGHT]: { chess: "Knight", role: "Cavalry" },
  [PIECES.QUEEN]: { chess: "Queen", role: "Elite" },
  [PIECES.KING]: { chess: "King", role: "Leader" },
  [PIECES.PAWN]: { chess: "Pawn", role: "Infantry" },
};
