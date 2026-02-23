import React from "react";
import { Trees, Waves, Mountain } from "lucide-react";
import { DesertIcon } from "@/client/game/components/atoms/UnitIcons";
import { TERRAIN_TYPES } from "@/core/configs/terrainDetails";

// --- Terrain Limits & Deck ---
export const MAX_TERRAIN_PER_PLAYER = {
  TWO_PLAYER: 16,
  FOUR_PLAYER: 8, // 8 per player = 32 total
};

// Cards per type in the deck.
// 4 types * 18 = 72 cards total. Enough for 4 players * 16 = 64 cards.
export const TERRAIN_CARDS_PER_TYPE = 32;

export interface TerrainDef {
  name: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  terrainTypeKey: string;
  key?: string;
  ring: string;
}

export const TERRAIN_LIST: TerrainDef[] = [
  {
    name: "Forests",
    icon: <Trees />,
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/40",
    ring: "ring-emerald-500/50",
    terrainTypeKey: TERRAIN_TYPES.TREES,
    key: "tr",
  },
  {
    name: "Swamps",
    icon: <Waves />,
    bg: "bg-brand-blue/10",
    text: "text-brand-blue",
    border: "border-brand-blue/40",
    ring: "ring-brand-blue/50",
    terrainTypeKey: TERRAIN_TYPES.PONDS,
    key: "wv",
  },
  {
    name: "Mountains",
    icon: <Mountain />,
    bg: "bg-brand-red/10",
    text: "text-brand-red",
    border: "border-brand-red/40",
    ring: "ring-brand-red/50",
    terrainTypeKey: TERRAIN_TYPES.RUBBLE,
    key: "mt",
  },
  {
    name: "Desert",
    icon: <DesertIcon className="w-6 h-6" />,
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/40",
    ring: "ring-amber-500/50",
    terrainTypeKey: TERRAIN_TYPES.DESERT,
    key: "ds",
  },
];
