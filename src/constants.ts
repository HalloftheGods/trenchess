import {
  Waves,
  Trees,
  Mountain,
  ChessKnight,
  ChessKing,
  ChessQueen,
  ChessRook,
  ChessBishop,
  ChessPawn,
} from "lucide-react";

import {
  CommanderIcon,
  BattleKnightIcon,
  TankIcon,
  SniperIcon,
  HorsemanIcon,
  BotIcon,
  DesertIcon,
} from "./UnitIcons";

import type {
  TerrainType,
  PieceType,
  PlayerConfig,
  ArmyUnit,
  UnitIntelEntry,
  TerrainIntelEntry,
} from "./types";

// --- Game Identity ---
export const GAME_NAME = "Trenchess";

// --- Board ---
export const BOARD_SIZE = 12;

// --- Terrain Limits & Deck ---
export const MAX_TERRAIN_PER_PLAYER = {
  TWO_PLAYER: 16,
  FOUR_PLAYER: 8, // 8 per player = 32 total
};

// Cards per type in the deck.
// 4 types * 18 = 72 cards total. Enough for 4 players * 16 = 64 cards.
export const TERRAIN_CARDS_PER_TYPE = 32;

// --- Terrain Types ---
export const TERRAIN_TYPES: Record<string, TerrainType> = {
  FLAT: "flat",
  TREES: "trees",
  PONDS: "ponds",
  RUBBLE: "rubble",
  DESERT: "desert",
};

// --- Sanctuary Protection ---
// Defines which units are protected by which terrain
// Rule: technically any piece that can enter the terrain has protection.
export const isUnitProtected = (
  unitType: string,
  terrainType: TerrainType,
): boolean => {
  if (terrainType === TERRAIN_TYPES.TREES) {
    return [
      PIECES.SNIPER,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ].includes(unitType as any);
  }
  if (terrainType === TERRAIN_TYPES.PONDS) {
    return [
      PIECES.TANK,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ].includes(unitType as any);
  }
  if (terrainType === TERRAIN_TYPES.RUBBLE) {
    return [
      PIECES.HORSEMAN,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ].includes(unitType as any);
  }
  if (terrainType === TERRAIN_TYPES.DESERT) {
    return unitType === PIECES.TANK;
  }
  return false;
};

// --- Piece Types ---
export const PIECES: Record<string, PieceType> = {
  BOT: "bot",
  HORSEMAN: "horseman",
  SNIPER: "sniper",
  TANK: "tank",
  BATTLEKNIGHT: "battleknight",
  COMMANDER: "commander",
};

// --- Player Configs ---
export const PLAYER_CONFIGS: Record<string, PlayerConfig> = {
  player1: {
    name: "NW",
    color: "red",
    text: "text-red-500",
    bg: "bg-red-600",
    shadow: "shadow-red-900/40",
  },
  player2: {
    name: "NE",
    color: "yellow",
    text: "text-yellow-500",
    bg: "bg-yellow-500",
    shadow: "shadow-yellow-900/40",
  },
  player3: {
    name: "SW",
    color: "green",
    text: "text-green-500",
    bg: "bg-green-600",
    shadow: "shadow-green-900/40",
  },
  player4: {
    name: "SE",
    color: "blue",
    text: "text-blue-500",
    bg: "bg-blue-600",
    shadow: "shadow-blue-900/40",
  },
};

// --- Initial Army ---
export const INITIAL_ARMY: ArmyUnit[] = [
  {
    type: PIECES.COMMANDER as PieceType,
    count: 1,
    emoji: "👑",
    bold: "♚︎",
    outlined: "♔︎",
    custom: CommanderIcon,
    lucide: ChessKing,
  },
  {
    type: PIECES.BATTLEKNIGHT as PieceType,
    count: 1,
    emoji: "👸",
    bold: "♛︎",
    outlined: "♕︎",
    custom: BattleKnightIcon,
    lucide: ChessQueen,
  },
  {
    type: PIECES.TANK as PieceType,
    count: 2,
    emoji: "🛡️",
    bold: "♜︎",
    outlined: "♖︎",
    custom: TankIcon,
    lucide: ChessRook,
  },
  {
    type: PIECES.SNIPER as PieceType,
    count: 2,
    emoji: "🎯",
    bold: "♝︎",
    outlined: "♗︎",
    custom: SniperIcon,
    lucide: ChessBishop,
  },
  {
    type: PIECES.HORSEMAN as PieceType,
    count: 2,
    emoji: "🏇",
    bold: "♞︎",
    outlined: "♘︎",
    custom: HorsemanIcon,
    lucide: ChessKnight,
  },
  {
    type: PIECES.BOT as PieceType,
    count: 8,
    emoji: "🤖",
    bold: "♟︎",
    outlined: "♙︎",
    custom: BotIcon,
    lucide: ChessPawn,
  },
];

// --- Unit Intel (simple tooltips) ---
export const UNIT_INTEL: Record<string, UnitIntelEntry> = {
  [PIECES.COMMANDER]: {
    title: "Commander",
    desc: "The Leader. Moves 2 spaces in a straight line or 1 space diagonally. Cannot pass through a square guarded by an enemy. Capture to win.",
  },
  [PIECES.BATTLEKNIGHT]: {
    title: "BattleKnight",
    desc: "Elite unit. Moves like a Queen AND a Horseman. Can occupy any terrain. Cannot pass through walls but can jump them in L-shape moves.",
  },
  [PIECES.TANK]: {
    title: "Tank",
    desc: "Heavy Armor. Moves like a Rook. Cannot enter Forest or Mountains. Thrives in Swamp. Only unit that can traverse Tundra.",
  },
  [PIECES.SNIPER]: {
    title: "Sniper",
    desc: "Ranged Specialist. Moves diagonally like a Bishop. Gains cover in Forest. Blocked by Swamp and Mountains.",
  },
  [PIECES.HORSEMAN]: {
    title: "Horseman",
    desc: "Cavalry. Moves in an L-shape, jumping over units and walls. Thrives in Mountains. Bogs down in Swamp and Forest.",
  },
  [PIECES.BOT]: {
    title: "Bot",
    desc: "Infantry. Moves forward 1 tile. In 4P mode, can move towards the center in two directions. Captures diagonally.",
  },
};

// --- Terrain Intel (simple tooltips) ---
export const TERRAIN_INTEL: Record<string, TerrainIntelEntry> = {
  [TERRAIN_TYPES.PONDS]: {
    label: "Swamp",
    icon: Waves,
    color: "text-blue-500",
    desc: "Sanctuary for Rooks. Grants protection from Bishops and Knights. Difficult terrain that slows movement.",
  },
  [TERRAIN_TYPES.TREES]: {
    label: "Forests",
    icon: Trees,
    color: "text-emerald-500",
    desc: "Sanctuary for Kings, Queens, Bishops, and Pawns. Grants protection from Rooks and Knights. Impassable for Rooks and Knights.",
  },
  [TERRAIN_TYPES.RUBBLE]: {
    label: "Mountains",
    icon: Mountain,
    color: "text-stone-500",
    desc: "Sanctuary for Knights. Grants protection from Rooks and Bishops. High peaks that block direct movement.",
  },
  [TERRAIN_TYPES.DESERT]: {
    label: "Desert",
    icon: DesertIcon,
    color: "text-amber-500",
    desc: "Exclusive zone for Rooks. Immune to non-Rook attacks. Deserts end movement; must exit next turn.",
  },
};

// --- Board Styling ---
export const getQuadrantBaseStyle = (
  r: number,
  c: number,
  mode: string,
): string => {
  const isAlt = (r + c) % 2 === 1;
  const isInner = r >= 2 && r <= 9 && c >= 2 && c <= 9;

  const getStyle = (color: string): string => {
    if (color === "red") {
      if (isInner)
        return isAlt
          ? "bg-red-900/80 dark:bg-red-950/90"
          : "bg-red-700/80 dark:bg-red-900/80";
      return isAlt
        ? "bg-red-300/60 dark:bg-red-800/40"
        : "bg-red-200/60 dark:bg-red-700/40";
    }
    if (color === "blue") {
      if (isInner)
        return isAlt
          ? "bg-blue-900/80 dark:bg-blue-950/90"
          : "bg-blue-700/80 dark:bg-blue-900/80";
      return isAlt
        ? "bg-blue-300/60 dark:bg-blue-800/40"
        : "bg-blue-200/60 dark:bg-blue-700/40";
    }
    if (color === "yellow") {
      if (isInner)
        return isAlt
          ? "bg-yellow-700/80 dark:bg-yellow-950/90"
          : "bg-yellow-500/80 dark:bg-yellow-800/80";
      return isAlt
        ? "bg-yellow-300/60 dark:bg-yellow-700/40"
        : "bg-yellow-200/60 dark:bg-yellow-600/40";
    }
    if (color === "green") {
      if (isInner)
        return isAlt
          ? "bg-emerald-900/80 dark:bg-emerald-950/90"
          : "bg-emerald-700/80 dark:bg-emerald-900/80";
      return isAlt
        ? "bg-emerald-300/60 dark:bg-emerald-800/40"
        : "bg-emerald-200/60 dark:bg-emerald-700/40";
    }
    // Fallback slate (Neutral - Bland Mode)
    // Matches Main Board Pattern: Inner = Dark/Saturated, Outer = Light/Desaturated
    if (isInner)
      return isAlt
        ? "bg-slate-800/90 dark:bg-slate-700"
        : "bg-slate-700/90 dark:bg-slate-600";
    return isAlt
      ? "bg-slate-300/60 dark:bg-slate-800/40"
      : "bg-slate-200/60 dark:bg-slate-700/40";
  };

  if (mode === "2p-ns") {
    if (r < 6) return getStyle("red");
    return getStyle("blue");
  }
  if (mode === "2p-ew") {
    if (c < 6) return getStyle("green");
    return getStyle("yellow");
  }

  if (mode === "2v2") {
    // 1. Center "King of the Hill" + Corner Start Zones - Classic White/Black
    const isCenter = r >= 5 && r <= 6 && c >= 5 && c <= 6;
    const isCorner = (r === 0 || r === 11) && (c === 0 || c === 11);

    if (isCenter || isCorner) {
      return isAlt
        ? "bg-slate-900 dark:bg-black border-2 border-slate-700"
        : "bg-slate-200 dark:bg-slate-300 border-2 border-slate-400";
    }
    // 2. Blended Borders (Solid "Mix" Colors)

    // Top border (Red + Yellow = Orange)
    if (r < 5 && (c === 5 || c === 6)) {
      return isAlt
        ? "bg-orange-600/80 dark:bg-orange-900/80"
        : "bg-orange-400/60 dark:bg-orange-700/60";
    }

    // Right border (Yellow + Green = Lime/Chartreuse)
    if (c > 6 && (r === 5 || r === 6)) {
      return isAlt
        ? "bg-lime-600/80 dark:bg-lime-900/80"
        : "bg-lime-400/60 dark:bg-lime-700/60";
    }

    // Bottom border (Green + Blue = Cyan/Teal)
    if (r > 6 && (c === 5 || c === 6)) {
      return isAlt
        ? "bg-cyan-600/80 dark:bg-cyan-900/80"
        : "bg-cyan-400/60 dark:bg-cyan-700/60";
    }

    // Left border (Blue + Red = Purple/Violet)
    if (c < 5 && (r === 5 || r === 6)) {
      return isAlt
        ? "bg-purple-600/80 dark:bg-purple-900/80"
        : "bg-purple-400/60 dark:bg-purple-700/60";
    }

    // 3. Standard Quadrants
    if (r < 6 && c < 6) return getStyle("red");
    if (r < 6 && c >= 6) return getStyle("yellow");
    if (r >= 6 && c < 6) return getStyle("green");
    return getStyle("blue");
  }

  if (mode === "4p") {
    // NW=Red, NE=Yellow, SW=Green, SE=Blue
    if (r < 6 && c < 6) return getStyle("red");
    if (r < 6 && c >= 6) return getStyle("yellow");
    if (r >= 6 && c < 6) return getStyle("green");
    return getStyle("blue");
  }

  return getStyle("slate");
};

// --- Piece Style Options ---
export const PIECE_STYLES = [
  "emoji",
  "bold",
  "outlined",
  "custom",
  "lucide",
] as const;
export type PieceStyle = (typeof PIECE_STYLES)[number];
