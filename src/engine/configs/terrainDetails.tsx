/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Comprehensive terrain details including flavor stats and unit interactions.
 */

import { Trees, Waves, Mountain } from "lucide-react";
import { DesertIcon } from "@/app/routes/game/components/atoms/UnitIcons";
import { PIECES } from "@engineConfigs/unitDetails";
import type { TerrainType, PieceType } from "@engineTypes/game";
import type { TerrainIntelEntry } from "@engineTypes/guide";

export const TERRAIN_TYPES: Record<string, TerrainType> = {
  FLAT: "flat",
  TREES: "trees",
  PONDS: "ponds",
  RUBBLE: "rubble",
  DESERT: "desert",
};

export interface TerrainDetail {
  key: TerrainType;
  icon: React.ElementType;
  label: string;
  subtitle: string;
  tagline: string;
  flavorTitle: string;
  flavorStats: string[];
  color: {
    bg: string;
    text: string;
    headerBg: string;
    iconBg: string;
    border: string;
  };
  sanctuaryUnits: PieceType[];
  allowedUnits: PieceType[];
  blockedUnits: PieceType[];
}

export const TERRAIN_DETAILS: TerrainDetail[] = [
  {
    key: TERRAIN_TYPES.TREES,
    icon: Trees,
    label: "Forests",
    subtitle: '"The Emerald Veils"',
    tagline: '"Nature\'s Sanctuary"',
    flavorTitle: "Verdant Cover",
    flavorStats: [
      '"Bishops find clarity in the Light of the Forest."',
      "Sanctuary for Kings, Queens, Bishops, and Pawns.",
      "Impassable for Rooks and Knights due to dense canopy.",
    ],
    color: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      headerBg: "bg-emerald-600",
      iconBg: "bg-emerald-500/20",
      border: "border-emerald-500/40",
    },
    sanctuaryUnits: [PIECES.BISHOP, PIECES.QUEEN, PIECES.PAWN, PIECES.KING],
    allowedUnits: [PIECES.BISHOP, PIECES.QUEEN, PIECES.PAWN, PIECES.KING],
    blockedUnits: [PIECES.ROOK, PIECES.KNIGHT],
  },
  {
    key: TERRAIN_TYPES.PONDS,
    icon: Waves,
    label: "Swamps",
    subtitle: '"The Twilight Mists"',
    tagline: '"Heavy Armor Haven"',
    flavorTitle: "Dusk Guardians",
    flavorStats: [
      '"Rooks guard the Swamps from Dusk-to-Dusk."',
      "Sanctuary for Rooks, Queens, Pawns, and Kings.",
      "Slows movement. Grants protection from Bishops and Knights.",
    ],
    color: {
      bg: "bg-brand-blue/10",
      text: "text-brand-blue",
      headerBg: "bg-brand-blue",
      iconBg: "bg-brand-blue/20",
      border: "border-brand-blue/40",
    },
    sanctuaryUnits: [PIECES.ROOK, PIECES.QUEEN, PIECES.PAWN, PIECES.KING],
    allowedUnits: [PIECES.ROOK, PIECES.QUEEN, PIECES.PAWN, PIECES.KING],
    blockedUnits: [PIECES.BISHOP, PIECES.KNIGHT],
  },
  {
    key: TERRAIN_TYPES.RUBBLE,
    icon: Mountain,
    label: "Mountains",
    subtitle: '"The Iron Peaks"',
    tagline: '"Cavalry\'s High Ground"',
    flavorTitle: "Shadow Knights",
    flavorStats: [
      '"Knights ride the Mountains under the cover of Dark."',
      "Sanctuary for Knights, Queens, Pawns, and Kings.",
      "High peaks block direct movement. Safe from Rooks and Bishops.",
    ],
    color: {
      bg: "bg-brand-red/10",
      text: "text-brand-red",
      headerBg: "bg-brand-red",
      iconBg: "bg-brand-red/20",
      border: "border-brand-red/40",
    },
    sanctuaryUnits: [PIECES.KNIGHT, PIECES.QUEEN, PIECES.PAWN, PIECES.KING],
    allowedUnits: [PIECES.KNIGHT, PIECES.QUEEN, PIECES.PAWN, PIECES.KING],
    blockedUnits: [PIECES.ROOK, PIECES.BISHOP],
  },
  {
    key: TERRAIN_TYPES.DESERT,
    icon: DesertIcon,
    label: "Deserts",
    subtitle: '"The Sands of Time"',
    tagline: '"Exclusive Rook Zone"',
    flavorTitle: "Endless Sands",
    flavorStats: [
      '"Only Rooks can withstand the harsh Desert sun."',
      "Immune to all non-Rook attacks within the sands.",
      "Movement ends immediately upon entry.",
    ],
    color: {
      bg: "bg-amber-600/20",
      text: "text-amber-500",
      headerBg: "bg-amber-600",
      iconBg: "bg-amber-500/20",
      border: "border-amber-500/40",
    },
    sanctuaryUnits: [PIECES.ROOK],
    allowedUnits: [
      PIECES.ROOK,
      PIECES.BISHOP,
      PIECES.KNIGHT,
      PIECES.QUEEN,
      PIECES.PAWN,
      PIECES.KING,
    ],
    blockedUnits: [],
  },
];

export const TERRAIN_INTEL: Record<string, TerrainIntelEntry> = {
  [TERRAIN_TYPES.PONDS]: {
    label: "Swamps",
    icon: Waves,
    color: "text-brand-blue",
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
    color: "text-brand-red",
    desc: "Sanctuary for Knights. Grants protection from Rooks and Bishops. High peaks that block direct movement.",
  },
  [TERRAIN_TYPES.DESERT]: {
    label: "Deserts",
    icon: DesertIcon,
    color: "text-amber-500",
    desc: "Exclusive zone for Rooks. Immune to non-Rook attacks. Deserts end movement; must exit next turn.",
  },
};
