import {
  ChessKnight,
  ChessKing,
  ChessQueen,
  ChessRook,
  ChessBishop,
  ChessPawn,
  Trees,
  Waves,
  Mountain,
} from "lucide-react";
import {
  KingIcon,
  QueenIcon,
  RookIcon,
  BishopIcon,
  KnightIcon,
  PawnIcon,
  DesertIcon,
} from "@/client/game/components/atoms/UnitIcons";
import { PIECES, INITIAL_ARMY as CORE_INITIAL_ARMY, ALL_UNITS } from "@/core/primitives/pieces";
import {
  TERRAIN_TYPES,
  TERRAIN_INTEL as CORE_TERRAIN_INTEL,
} from "@/core/primitives/terrain";
import { UNIT_BLUEPRINTS } from "@/core/blueprints/units";
import type {
  PlayerConfig,
  UnitColors,
  ArmyUnit,
  UnitDetails,
} from "@/shared/types/game";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

export { PIECES, ALL_UNITS };

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

export const UNIT_COLORS: Record<string, UnitColors> = {
  [KING]: {
    text: "text-brand-red",
    bg: "bg-brand-red/10",
    border: "border-brand-red/40",
    shadow: "shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    ribbonBg: "bg-brand-red",
    ring: "ring-brand-red/50",
  },
  [QUEEN]: {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/40",
    shadow: "shadow-[0_0_10px_rgba(168,85,247,0.1)]",
    ribbonBg: "bg-purple-500",
    ring: "ring-purple-500/50",
  },
  [ROOK]: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
    shadow: "shadow-[0_0_10px_rgba(234,179,8,0.1)]",
    ribbonBg: "bg-yellow-500",
    ring: "ring-yellow-500/50",
  },
  [BISHOP]: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    shadow: "shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    ribbonBg: "bg-emerald-500",
    ring: "ring-emerald-500/50",
  },
  [KNIGHT]: {
    text: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/40",
    shadow: "shadow-[0_0_10px_rgba(148,163,184,0.1)]",
    ribbonBg: "bg-slate-400",
    ring: "ring-slate-400/50",
  },
  [PAWN]: {
    text: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/40",
    shadow: "shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    ribbonBg: "bg-brand-blue",
    ring: "ring-brand-blue/50",
  },
};

export const unitColorMap = UNIT_COLORS;

export const UNIT_THEME_DATA = {
  [KING]: {
    emoji: "👑",
    bold: "♚︎",
    outlined: "♔︎",
    custom: KingIcon,
    lucide: ChessKing,
  },
  [QUEEN]: {
    emoji: "👸",
    bold: "♛︎",
    outlined: "♕︎",
    custom: QueenIcon,
    lucide: ChessQueen,
  },
  [ROOK]: {
    emoji: "🛡️",
    bold: "♜︎",
    outlined: "♖︎",
    custom: RookIcon,
    lucide: ChessRook,
  },
  [BISHOP]: {
    emoji: "🎯",
    bold: "♝︎",
    outlined: "♗︎",
    custom: BishopIcon,
    lucide: ChessBishop,
  },
  [KNIGHT]: {
    emoji: "🏇",
    bold: "♞︎",
    outlined: "♘︎",
    custom: KnightIcon,
    lucide: ChessKnight,
  },
  [PAWN]: {
    emoji: "🤖",
    bold: "♟︎",
    outlined: "♙︎",
    custom: PawnIcon,
    lucide: ChessPawn,
  },
};

export const TERRAIN_THEME_DATA = {
  [TERRAIN_TYPES.FORESTS]: {
    icon: <Trees />,
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/40",
    ring: "ring-emerald-500/50",
    headerBg: "bg-emerald-600",
    iconBg: "bg-emerald-500/20",
    color: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/40",
      headerBg: "bg-emerald-600",
    },
  },
  [TERRAIN_TYPES.SWAMPS]: {
    icon: <Waves />,
    bg: "bg-brand-blue/10",
    text: "text-brand-blue",
    border: "border-brand-blue/40",
    ring: "ring-brand-blue/50",
    headerBg: "bg-brand-blue",
    iconBg: "bg-brand-blue/20",
    color: {
      bg: "bg-brand-blue/10",
      text: "text-brand-blue",
      border: "border-brand-blue/40",
      headerBg: "bg-brand-blue",
    },
  },
  [TERRAIN_TYPES.MOUNTAINS]: {
    icon: <Mountain />,
    bg: "bg-brand-red/10",
    text: "text-brand-red",
    border: "border-brand-red/40",
    ring: "ring-brand-red/50",
    headerBg: "bg-brand-red",
    iconBg: "bg-brand-red/20",
    color: {
      bg: "bg-brand-red/10",
      text: "text-brand-red",
      border: "border-brand-red/40",
      headerBg: "bg-brand-red",
    },
  },
  [TERRAIN_TYPES.DESERT]: {
    icon: <DesertIcon />,
    bg: "bg-amber-600/20",
    text: "text-amber-500",
    border: "border-amber-500/40",
    ring: "ring-amber-500/50",
    headerBg: "bg-amber-600",
    iconBg: "bg-amber-500/20",
    color: {
      bg: "bg-amber-600/20",
      text: "text-amber-500",
      border: "border-amber-500/40",
      headerBg: "bg-amber-600",
    },
  },
};

export const UNIT_INTEL: Record<string, any> = {
  [KING]: {
    title: "King",
    subtitle: "The Sovereign",
    role: "Leader",
    desc: [
      "The Leader. Moves 2 spaces in a straight line or 1 space diagonally. Cannot pass through a square guarded by an enemy. Capture to win.",
    ],
    levelUp: {
      title: "Somersault Assault",
      stats: ["Speed: +2 (Jump)", "Sanctuary: Forest, Mountains, Swamp"],
      sanctuaryTerrain: [
        TERRAIN_TYPES.FORESTS,
        TERRAIN_TYPES.MOUNTAINS,
        TERRAIN_TYPES.SWAMPS,
      ],
    },
  },
  [QUEEN]: {
    title: "Queen",
    subtitle: "The Matriarch",
    role: "Elite",
    desc: [
      "Elite unit. Moves like a Queen AND a Knight. Can occupy any terrain. Cannot pass through walls but can jump them in L-shape moves.",
    ],
    levelUp: {
      title: "8 Legged Gallop",
      stats: ["Jump: Any Distance", "Sanctuary: Forest, Mountains, Swamp"],
      sanctuaryTerrain: [
        TERRAIN_TYPES.FORESTS,
        TERRAIN_TYPES.MOUNTAINS,
        TERRAIN_TYPES.SWAMPS,
      ],
    },
  },
  [ROOK]: {
    title: "Rook",
    subtitle: "The Bastion",
    role: "Heavy Armor",
    desc: [
      "Heavy Armor. Moves like a Rook. Cannot enter Forest or Mountains. Thrives in Swamp. Only unit that can traverse Tundra.",
    ],
    levelUp: {
      title: '"Four-Corners" Fortnight',
      stats: ["Armor: +10", "Sanctuary: Swamps"],
      sanctuaryTerrain: [TERRAIN_TYPES.SWAMPS],
    },
  },
  [BISHOP]: {
    title: "Bishop",
    subtitle: "The Seer",
    role: "Ranged",
    desc: [
      "Ranged Specialist. Moves diagonally like a Bishop. Gains cover in Forest. Blocked by Swamp and Mountains.",
    ],
    levelUp: {
      title: "Leap of Faith",
      stats: ["Range: +4", "Sanctuary: Forests"],
      sanctuaryTerrain: [TERRAIN_TYPES.FORESTS],
    },
  },
  [KNIGHT]: {
    title: "Knight",
    subtitle: "The Vanguard",
    role: "Cavalry",
    desc: [
      "Cavalry. Moves in an L-shape, jumping over units and walls. Thrives in Mountains. Bogs down in Swamp and Forest.",
    ],
    levelUp: {
      title: '"Triple-Bar" Jump',
      stats: ["Jump: +1", "Sanctuary: Mountains"],
      sanctuaryTerrain: [TERRAIN_TYPES.MOUNTAINS],
    },
  },
  [PAWN]: {
    title: "Pawn",
    subtitle: "The Automaton",
    role: "Infantry",
    desc: [
      "Infantry. Moves like a Pawn, but can also perform a 'Backflip' (jump 2 squares backward) to reposition or capture unexpectedly.",
    ],
    levelUp: {
      title: '"Double-back" Flip',
      stats: ["Evasion: +5", "Sanctuary: All"],
      sanctuaryTerrain: [
        TERRAIN_TYPES.FORESTS,
        TERRAIN_TYPES.MOUNTAINS,
        TERRAIN_TYPES.SWAMPS,
      ],
    },
  },
};

export const UNIT_DETAILS: Record<string, UnitDetails> = Object.keys(
  UNIT_INTEL,
).reduce(
  (acc, key) => {
    const intel = UNIT_INTEL[key];
    const blueprint = UNIT_BLUEPRINTS[key];
    acc[key] = {
      ...intel,
      movePattern: blueprint.movePattern,
      newMovePattern: blueprint.newMovePattern,
      attackPattern: blueprint.attackPattern,
    };
    return acc;
  },
  {} as Record<string, UnitDetails>,
);

export const INITIAL_ARMY: ArmyUnit[] = CORE_INITIAL_ARMY.map((u) => ({
  ...u,
  ...UNIT_THEME_DATA[u.type as keyof typeof UNIT_THEME_DATA],
  // Ensure we satisfy the ArmyUnit interface which might expect strings for icons in some contexts
  // or components. Theme data has components.
})) as unknown as ArmyUnit[];

export const TERRAIN_INTEL: Record<string, any> = Object.keys(
  CORE_TERRAIN_INTEL,
).reduce(
  (acc, key) => {
    acc[key] = {
      ...CORE_TERRAIN_INTEL[key],
      ...TERRAIN_THEME_DATA[key as keyof typeof TERRAIN_THEME_DATA],
    };
    return acc;
  },
  {} as Record<string, any>,
);

export const TERRAIN_DETAILS = Object.keys(TERRAIN_INTEL).map((key) => ({
  key,
  ...TERRAIN_INTEL[key],
}));

export const TERRAIN_LIST = TERRAIN_DETAILS;

export const UNIT_NAMES: Record<string, string> = {
  [KING]: "King",
  [QUEEN]: "Queen",
  [ROOK]: "Rooks",
  [BISHOP]: "Bishops",
  [KNIGHT]: "Knights",
  [PAWN]: "Pawns",
};

export const CHESS_NAME: Record<string, { chess: string; role: string }> = {
  [ROOK]: { chess: "Rook", role: "Heavy Armor" },
  [BISHOP]: { chess: "Bishop", role: "Ranged" },
  [KNIGHT]: { chess: "Knight", role: "Cavalry" },
  [QUEEN]: { chess: "Queen", role: "Elite" },
  [KING]: { chess: "King", role: "Leader" },
  [PAWN]: { chess: "Pawn", role: "Infantry" },
};
