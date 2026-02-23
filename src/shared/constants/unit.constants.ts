import type { PlayerConfig } from "@/core/types/game";
import { PIECES } from "@/core/configs/unitDetails";

// --- Piece Style Options ---
export const PIECE_STYLES = [
  "emoji",
  "bold",
  "outlined",
  "custom",
  "lucide",
] as const;
export type PieceStyle = (typeof PIECE_STYLES)[number];

// --- Player Configs ---
export const PLAYER_CONFIGS: Record<string, PlayerConfig> = {
  red: {
    name: "Red",
    color: "brand-red",
    text: "text-brand-red",
    bg: "bg-brand-red",
    shadow: "shadow-brand-red/40",
  },
  yellow: {
    name: "Yellow",
    color: "yellow-500",
    text: "text-yellow-500",
    bg: "bg-yellow-500",
    shadow: "shadow-yellow-900/40",
  },
  green: {
    name: "Green",
    color: "green-600",
    text: "text-green-500",
    bg: "bg-green-600",
    shadow: "shadow-green-900/40",
  },
  blue: {
    name: "Blue",
    color: "brand-blue",
    text: "text-brand-blue",
    bg: "bg-brand-blue",
    shadow: "shadow-brand-blue/40",
  },
};

export const UNIT_COLORS: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  [PIECES.KING]: {
    text: "text-brand-red",
    bg: "bg-brand-red/10",
    border: "border-brand-red/40",
  },
  [PIECES.QUEEN]: {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/40",
  },
  [PIECES.ROOK]: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
  },
  [PIECES.BISHOP]: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
  },
  [PIECES.KNIGHT]: {
    text: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/40",
  },
  [PIECES.PAWN]: {
    text: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/40",
  },
};

export const UNIT_NAMES: Record<string, string> = {
  [PIECES.KING]: "King",
  [PIECES.QUEEN]: "Queen",
  [PIECES.ROOK]: "Rooks",
  [PIECES.BISHOP]: "Bishops",
  [PIECES.KNIGHT]: "Knights",
  [PIECES.PAWN]: "Pawns",
};

export const ALL_UNITS = [
  PIECES.KING,
  PIECES.QUEEN,
  PIECES.ROOK,
  PIECES.BISHOP,
  PIECES.KNIGHT,
  PIECES.PAWN,
];
