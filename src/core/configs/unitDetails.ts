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
} from "@/client/game/components/atoms/UnitIcons";
import type { TerrainType, PieceType, ArmyUnit } from "@/core/types/game";
import type { UnitIntelEntry } from "@/core/types/guide";

// --- Piece Types ---
export const PIECES: Record<string, PieceType> = {
  PAWN: "pawn",
  KNIGHT: "knight",
  BISHOP: "bishop",
  ROOK: "rook",
  QUEEN: "queen",
  KING: "king",
};

export const unitColorMap: Record<
  string,
  {
    text: string;
    bg: string;
    border: string;
    shadow: string;
    ribbonBg: string;
    ring: string;
  }
> = {
  [PIECES.KING]: {
    text: "text-brand-red",
    bg: "bg-brand-red/10",
    border: "border-brand-red/40",
    shadow: "shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    ribbonBg: "bg-brand-red",
    ring: "ring-brand-red/50",
  },
  [PIECES.QUEEN]: {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/40",
    shadow: "shadow-[0_0_10px_rgba(168,85,247,0.1)]",
    ribbonBg: "bg-purple-500",
    ring: "ring-purple-500/50",
  },
  [PIECES.ROOK]: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
    shadow: "shadow-[0_0_10px_rgba(234,179,8,0.1)]",
    ribbonBg: "bg-yellow-500",
    ring: "ring-yellow-500/50",
  },
  [PIECES.BISHOP]: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    shadow: "shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    ribbonBg: "bg-emerald-500",
    ring: "ring-emerald-500/50",
  },
  [PIECES.KNIGHT]: {
    text: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/40",
    shadow: "shadow-[0_0_10px_rgba(148,163,184,0.1)]",
    ribbonBg: "bg-slate-400",
    ring: "ring-slate-400/50",
  },
  [PIECES.PAWN]: {
    text: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/40",
    shadow: "shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    ribbonBg: "bg-brand-blue",
    ring: "ring-brand-blue/50",
  },
};

export const UNIT_DETAILS: Record<
  string,
  {
    title: string;
    subtitle?: string;
    role: string;
    desc?: string[];
    levelUp?: {
      title: string;
      stats: string[];
      sanctuaryTerrain?: TerrainType[];
    };
    movePattern: (r: number, c: number) => number[][];
    newMovePattern?: (r: number, c: number) => number[][];
    attackPattern?: (r: number, c: number) => number[][];
  }
> = {
  [PIECES.KING]: {
    title: "Equinox King",
    subtitle: "The Kings",
    role: '"The King bull-dozes 2 steps forward."',
    desc: [],
    levelUp: {
      title: "Equinox King",
      stats: [
        "Joust 2 squares in a straight line.",
        "Captures any enemies in the way.",
      ],
      sanctuaryTerrain: ["rubble", "trees", "ponds"],
    },
    movePattern: (r, c) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 1, c - 1],
      [r + 1, c + 1],
    ],
    newMovePattern: (r, c) => [
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
    ],
    attackPattern: (r, c) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ],
  },
  [PIECES.QUEEN]: {
    title: "Sacred Queen",
    subtitle: "The Queens",
    role: '"The Queen rides the sacred steed."',
    desc: [],
    levelUp: {
      title: "Sacred Queen",
      stats: ["Leap over units L-shape."],
      sanctuaryTerrain: ["rubble", "trees", "ponds"],
    },
    movePattern: (r, c) => {
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
    newMovePattern: (r, c) =>
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
    title: "Twilight Fortress",
    subtitle: "The Rooks",
    role: '"Rooks fortify the Swamps, Dusk-to-Dusk."',
    desc: [],
    levelUp: {
      title: "Twilight Fortress",
      stats: [
        "Single-step-diagonal: Advance1 square diagonally.",
        "Swamp Sanctuary: Safe from Bishops & Knights.",
      ],
      sanctuaryTerrain: ["ponds"],
    },
    newMovePattern(r, c) {
      return [
        [r - 1, c - 1],
        [r + 1, c - 1],
        [r + 1, c + 1],
        [r - 1, c + 1],
      ];
    },
    movePattern: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
      }
      return moves;
    },
  },
  [PIECES.BISHOP]: {
    title: "Light Seer",
    subtitle: "The Bishops",
    role: '"The Bishop hunts the Forest with Light."',
    desc: [],
    levelUp: {
      title: "Light Seer",
      stats: [
        "Double-step Retreat: Horizonal or Vertical 2 squares.",
        "Forest Sanctuary: Safe from Rooks and Knights.",
      ],
      sanctuaryTerrain: ["trees"],
    },
    newMovePattern(r, c) {
      return [
        [r - 2, c - 0],
        [r + 2, c - 0],
        [r + 0, c - 2],
        [r + 0, c + 2],
      ];
    },
    movePattern: (r, c) => {
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
    title: "Shadow Knight",
    subtitle: "The Knights",
    role: '"The Knight rides the Mountains under Dark."',
    desc: [],
    levelUp: {
      title: "Shadow Knight",
      stats: [
        "Triple-Jump: Horizontal or Vertical 3 squares.",
        "Mountain Sanctuary: Safe from Rooks and Bishops.",
      ],
      sanctuaryTerrain: ["rubble"],
    },

    newMovePattern(r, c) {
      return [
        [r + 3, c - 0],
        [r - 3, c - 0],
        [r + 0, c - 3],
        [r + 0, c + 3],
      ];
    },
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
  },
  [PIECES.PAWN]: {
    title: "Nimbus Jumper",
    subtitle: "The Pawns",
    role: '"The Pawn learns the way of the backflip."',
    desc: [],
    levelUp: {
      title: "Nimbus Jumper",
      stats: [
        "Backflip: Vault 2 squares if vacant.",
        "Crouching-Tiger-Hidden-Dragoon: Backflip capture on left or right.",
      ],
      sanctuaryTerrain: ["rubble", "trees", "ponds"],
    },
    movePattern: (r, c) => [[r - 1, c]],
    newMovePattern: (r, c) => [
      [r + 2, c],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
    attackPattern: (r, c) => [
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
  },
};

// --- Initial Army ---
export const INITIAL_ARMY: ArmyUnit[] = [
  {
    type: PIECES.KING,
    count: 1,
    emoji: "👑",
    bold: "♚︎",
    outlined: "♔︎",
    custom: KingIcon,
    lucide: ChessKing,
  },
  {
    type: PIECES.QUEEN,
    count: 1,
    emoji: "👸",
    bold: "♛︎",
    outlined: "♕︎",
    custom: QueenIcon,
    lucide: ChessQueen,
  },
  {
    type: PIECES.ROOK,
    count: 2,
    emoji: "🛡️",
    bold: "♜︎",
    outlined: "♖︎",
    custom: RookIcon,
    lucide: ChessRook,
  },
  {
    type: PIECES.BISHOP,
    count: 2,
    emoji: "🎯",
    bold: "♝︎",
    outlined: "♗︎",
    custom: BishopIcon,
    lucide: ChessBishop,
  },
  {
    type: PIECES.KNIGHT,
    count: 2,
    emoji: "🏇",
    bold: "♞︎",
    outlined: "♘︎",
    custom: KnightIcon,
    lucide: ChessKnight,
  },
  {
    type: PIECES.PAWN,
    count: 8,
    emoji: "🤖",
    bold: "♟︎",
    outlined: "♙︎",
    custom: PawnIcon,
    lucide: ChessPawn,
  },
];

// --- Unit Intel (simple tooltips) ---
export const UNIT_INTEL: Record<string, UnitIntelEntry> = {
  [PIECES.KING]: {
    title: "King",
    desc: "The Leader. Moves 2 spaces in a straight line or 1 space diagonally. Cannot pass through a square guarded by an enemy. Capture to win.",
  },
  [PIECES.QUEEN]: {
    title: "Queen",
    desc: "Elite unit. Moves like a Queen AND a Knight. Can occupy any terrain. Cannot pass through walls but can jump them in L-shape moves.",
  },
  [PIECES.ROOK]: {
    title: "Rook",
    desc: "Heavy Armor. Moves like a Rook. Cannot enter Forest or Mountains. Thrives in Swamp. Only unit that can traverse Tundra.",
  },
  [PIECES.BISHOP]: {
    title: "Bishop",
    desc: "Ranged Specialist. Moves diagonally like a Bishop. Gains cover in Forest. Blocked by Swamp and Mountains.",
  },
  [PIECES.KNIGHT]: {
    title: "Knight",
    desc: "Cavalry. Moves in an L-shape, jumping over units and walls. Thrives in Mountains. Bogs down in Swamp and Forest.",
  },
  [PIECES.PAWN]: {
    title: "Pawn",
    desc: "Infantry. Moves like a Pawn, but can also perform a 'Backflip' (jump 2 squares backward) to reposition or capture unexpectedly.",
  },
};
