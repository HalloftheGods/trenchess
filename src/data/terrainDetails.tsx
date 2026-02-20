import React from "react";
import { Trees, Waves, Mountain } from "lucide-react";
import { DesertIcon } from "../UnitIcons";
import { TERRAIN_TYPES, PIECES } from "../constants";
import type { TerrainType } from "../types";

export interface TerrainDetail {
  key: TerrainType;
  label: string;
  subtitle: string;
  tagline: string;
  icon: React.ElementType;
  color: {
    text: string;
    bg: string;
    border: string;
    headerBg: string;
    glow: string;
    iconBg: string;
    iconBorder: string;
    badgeBg: string;
  };
  flavorTitle: string;
  flavorStats: string[];
  rule?: string;
  allowedUnits: string[];
  blockedUnits: string[];
  sanctuaryUnits: string[];
}

export const TERRAIN_DETAILS: TerrainDetail[] = [
  {
    key: TERRAIN_TYPES.RUBBLE as TerrainType,
    label: "Mountains",
    subtitle: "You discovered a new Trench!",
    tagline: "Sanctuary of the Shadow Knights",
    icon: Mountain,
    color: {
      text: "text-brand-red",
      bg: "bg-brand-red/10",
      border: "border-brand-red/40",
      headerBg: "bg-brand-red/70",
      glow: "shadow-brand-red/20",
      iconBg: "bg-brand-red/70",
      iconBorder: "border-brand-red/50",
      badgeBg: "bg-brand-red/20",
    },
    flavorTitle: "Treacherous Peaks",
    flavorStats: [
      "Agile Knights leap across the crags with ease.",
      "Rooks and Bishops cannot navigate the steep inclines.",
      "Units camped here are shielded from Rook and Bishop attacks.",
    ],
    allowedUnits: [
      PIECES.HORSEMAN,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
    blockedUnits: [PIECES.TANK, PIECES.SNIPER],
    sanctuaryUnits: [
      PIECES.HORSEMAN,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
  },
  {
    key: TERRAIN_TYPES.PONDS as TerrainType,
    label: "Swamp",
    subtitle: "You discovered a new Trench!",
    tagline: "Sanctuary of the Twilight",
    icon: Waves,
    color: {
      text: "text-brand-blue",
      bg: "bg-brand-blue/10",
      border: "border-brand-blue/40",
      headerBg: "bg-brand-blue/70",
      glow: "shadow-brand-blue/20",
      iconBg: "bg-brand-blue/80",
      iconBorder: "border-brand-blue/50",
      badgeBg: "bg-brand-blue/20",
    },
    flavorTitle: "Murky Wetlands",
    flavorStats: [
      "Rooks push through the mire with ease.",
      "Knights and Bishops sink — movement through here is impossible for them.",
      "Units resting here are invisible to Bishop and Knight attacks.",
    ],
    allowedUnits: [
      PIECES.TANK,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
    blockedUnits: [PIECES.HORSEMAN, PIECES.SNIPER],
    sanctuaryUnits: [
      PIECES.TANK,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
  },
  {
    key: TERRAIN_TYPES.TREES as TerrainType,
    label: "Forests",
    subtitle: "You discovered a new Trench!",
    tagline: "Sanctuary of Light",
    icon: Trees,
    color: {
      text: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      headerBg: "bg-emerald-700",
      glow: "shadow-emerald-900/20",
      iconBg: "bg-emerald-800/80",
      iconBorder: "border-emerald-600/50",
      badgeBg: "bg-emerald-500/20",
    },
    flavorTitle: "Dense Forest Cover",
    flavorStats: [
      "Bishops, Queens, Pawns, and Kings slip through the canopy.",
      "Rooks and Knights are too heavy — the forest denies their passage.",
      "Units sheltered here vanish from Rook and Knight targeting.",
    ],
    allowedUnits: [
      PIECES.SNIPER,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
    blockedUnits: [PIECES.TANK, PIECES.HORSEMAN],
    sanctuaryUnits: [
      PIECES.SNIPER,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
  },
  {
    key: TERRAIN_TYPES.DESERT as TerrainType,
    label: "Desert",
    subtitle: "You discovered a new Trench!",
    tagline: "Sanctuary of the Sacred",
    icon: DesertIcon,
    color: {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
      headerBg: "bg-amber-700",
      glow: "shadow-amber-900/20",
      iconBg: "bg-amber-700/80",
      iconBorder: "border-amber-500/50",
      badgeBg: "bg-amber-500/20",
    },
    flavorTitle: "⚠ Desert Rule",
    flavorStats: [
      "The shifting sands are open to all who dare enter.",
      "Movement stops on entry. You cannot pass straight through.",
      "Exit on your very next turn or your piece is lost to the desert forever.",
    ],
    rule: "Desert Rule",
    allowedUnits: [
      PIECES.TANK,
      PIECES.SNIPER,
      PIECES.HORSEMAN,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
    blockedUnits: [],
    sanctuaryUnits: [],
  },
];
