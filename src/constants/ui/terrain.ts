import { Trees, Waves, Mountain } from "lucide-react";
import { DesertIcon } from "@/client/game/shared/components/atoms/UnitIcons";
import { TERRAIN_TYPES, CORE_TERRAIN_INTEL } from "../terrain";

const { FORESTS, SWAMPS, MOUNTAINS, DESERT } = TERRAIN_TYPES;

export const TERRAIN_THEME_DATA = {
  [FORESTS]: {
    icon: Trees,
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
  [SWAMPS]: {
    icon: Waves,
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
  [MOUNTAINS]: {
    icon: Mountain,
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
  [DESERT]: {
    icon: DesertIcon,
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

const mapToTerrainIntel = (acc: Record<string, Record<string, unknown>>, key: string) => {
  acc[key] = {
    ...CORE_TERRAIN_INTEL[key],
    ...TERRAIN_THEME_DATA[key as keyof typeof TERRAIN_THEME_DATA],
  };
  return acc;
};

export const TERRAIN_INTEL: Record<string, Record<string, unknown>> = Object.keys(CORE_TERRAIN_INTEL).reduce(
  mapToTerrainIntel,
  {} as Record<string, Record<string, unknown>>,
);

const mapToTerrainDetail = (key: string) => ({
  key,
  terrainTypeKey: key as TerrainType,
  ...TERRAIN_INTEL[key],
});

export const TERRAIN_DETAILS = Object.keys(TERRAIN_INTEL).map(mapToTerrainDetail);

export const TERRAIN_LIST = TERRAIN_DETAILS;
