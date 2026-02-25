import {
  ChessKnight,
  ChessKing,
  ChessQueen,
  ChessRook,
  ChessBishop,
  ChessPawn,
} from "lucide-react";
import {
  KingIcon,
  QueenIcon,
  RookIcon,
  BishopIcon,
  KnightIcon,
  PawnIcon,
} from "@/client/game/shared/components/atoms/UnitIcons";
import { PIECES, CORE_INITIAL_ARMY } from "../pieces";
import { TERRAIN_TYPES } from "../terrain";
import { UNIT_BLUEPRINTS } from "@/core/blueprints/units";
import type {
  UnitColors,
  ArmyUnit,
  UnitDetails,
  TerrainType,
} from "@/shared/types";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;
const { FORESTS, MOUNTAINS, SWAMPS } = TERRAIN_TYPES;

export const PIECE_STYLES = [
  "emoji",
  "bold",
  "outlined",
  "custom",
  "lucide",
] as const;

export type PieceStyle = (typeof PIECE_STYLES)[number];

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

export interface UnitIntelEntry {
  title: string;
  subtitle: string;
  role: string;
  desc: string[];
  levelUp: {
    title: string;
    stats: string[];
    sanctuaryTerrain: string[];
  };
}

export const UNIT_INTEL: Record<string, UnitIntelEntry> = {
  [KING]: {
    title: "Equinox King",
    subtitle: "The Sovereign",
    role: '"The King bull-dozes 2 steps forward."',
    desc: [
      "The Leader. Moves 2 spaces in a straight line or 1 space diagonally. Cannot pass through a square guarded by an enemy. Capture to win.",
    ],
    levelUp: {
      title: "Somersault Assault",
      stats: ["Speed: +2 (Jump)", "Sanctuary: Forest"],
      sanctuaryTerrain: [FORESTS],
    },
  },
  [QUEEN]: {
    title: "Sacred Queen",
    subtitle: "The Queens",
    role: '"The Queen rides the sacred steed."',
    desc: [
      "Elite unit. Moves like a Queen AND a Knight. Can occupy any terrain. Cannot pass through walls but can jump them in L-shape moves.",
    ],
    levelUp: {
      title: "8 Legged Gallop",
      stats: ["Jump: Any Distance", "Sanctuary: Forest"],
      sanctuaryTerrain: [FORESTS],
    },
  },
  [ROOK]: {
    title: "Twilight Fortress",
    subtitle: "The Rooks",
    role: '"Rooks fortify the Swamps, Dusk-to-Dusk."',
    desc: [
      "Heavy Armor. Moves like a Rook. Cannot enter Forest or Mountains. Thrives in Swamp. Only unit that can traverse Tundra.",
    ],
    levelUp: {
      title: '"Four-Corners" Fortnight',
      stats: ["Armor: +10", "Sanctuary: Swamps"],
      sanctuaryTerrain: [SWAMPS],
    },
  },
  [BISHOP]: {
    title: "Light Seer",
    subtitle: "The Bishops",
    role: '"The Bishop hunts the Forest with Light."',
    desc: [
      "Ranged Specialist. Moves diagonally like a Bishop. Gains cover in Forest. Blocked by Swamp and Mountains.",
    ],
    levelUp: {
      title: "Leap of Faith",
      stats: ["Range: +4", "Sanctuary: Forests"],
      sanctuaryTerrain: [FORESTS],
    },
  },
  [KNIGHT]: {
    title: "Shadow Knight",
    subtitle: "The Knights",
    role: '"The Knight rides the Mountains under Dark."',
    desc: [
      "Cavalry. Moves in an L-shape, jumping over units and walls. Thrives in Mountains. Bogs down in Swamp and Forest.",
    ],
    levelUp: {
      title: '"Triple-Bar" Jump',
      stats: ["Jump: +1", "Sanctuary: Mountains"],
      sanctuaryTerrain: [MOUNTAINS],
    },
  },
  [PAWN]: {
    title: "Nimbus Jumper",
    subtitle: "The Pawns",
    role: '"The Pawn learns the way of the backflip."',
    desc: [
      "Infantry. Moves like a Pawn, but can also perform a 'Backflip' (jump 2 squares backward) to reposition or capture unexpectedly.",
    ],
    levelUp: {
      title: '"Double-back" Flip',
      stats: ["Evasion: +5", "Sanctuary: Forest"],
      sanctuaryTerrain: [FORESTS],
    },
  },
};

const mapToUnitDetails = (acc: Record<string, UnitDetails>, key: string) => {
  const intel = UNIT_INTEL[key];
  const blueprint = UNIT_BLUEPRINTS[key];
  acc[key] = {
    ...intel,
    movePattern: blueprint.movePattern,
    newMovePattern: blueprint.newMovePattern,
    attackPattern: blueprint.attackPattern,
    levelUp: intel.levelUp
      ? {
          ...intel.levelUp,
          sanctuaryTerrain: intel.levelUp.sanctuaryTerrain as TerrainType[],
        }
      : undefined,
  };
  return acc;
};

export const UNIT_DETAILS: Record<string, UnitDetails> = Object.keys(
  UNIT_INTEL,
).reduce(mapToUnitDetails, {} as Record<string, UnitDetails>);

const mapToInitialArmyTheme = (u: { type: string; count: number }) => ({
  ...u,
  ...UNIT_THEME_DATA[u.type as keyof typeof UNIT_THEME_DATA],
});

export const INITIAL_ARMY: ArmyUnit[] = CORE_INITIAL_ARMY.map(
  mapToInitialArmyTheme,
) as unknown as ArmyUnit[];

export const UNIT_NAMES: Record<string, string> = {
  [KING]: "Equinox King",
  [QUEEN]: "Sacred Queen",
  [ROOK]: "Twilight Fortress",
  [BISHOP]: "Light Seer",
  [KNIGHT]: "Shadow Knights",
  [PAWN]: "Nimbug Jumper",
};

export const CHESS_NAME: Record<string, { chess: string; role: string }> = {
  [ROOK]: { chess: "Rook", role: "Heavy Armor" },
  [BISHOP]: { chess: "Bishop", role: "Ranged" },
  [KNIGHT]: { chess: "Knight", role: "Cavalry" },
  [QUEEN]: { chess: "Queen", role: "Elite" },
  [KING]: { chess: "King", role: "Leader" },
  [PAWN]: { chess: "Pawn", role: "Infantry" },
};
