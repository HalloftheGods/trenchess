import React from "react";
import { Trees as TreeIcon, Waves, Mountain } from "lucide-react";
import { DesertIcon } from "@/shared/components/atoms/UnitIcons";
import { TERRAIN_TYPES } from "@constants";
import { Flex } from "@atoms";
import type { TerrainType } from "@tc.types/game";

interface TerrainOverlayProps {
  terrainType: TerrainType;
  hasUnit: boolean;
  rotationStyle: React.CSSProperties;
  fogged: boolean;
}

const TERRAIN_CONFIG: Record<
  string,
  {
    Icon: React.FC<{ className?: string }>;
    border: string;
    bgUnit: string;
    bgEmpty: string;
    iconColor: string;
    iconOpacity: string;
  }
> = {
  [TERRAIN_TYPES.TREES]: {
    Icon: TreeIcon,
    border: "border-emerald-600/50 dark:border-emerald-400/50",
    bgUnit: "bg-emerald-900 dark:bg-emerald-950",
    bgEmpty: "bg-emerald-600/10 dark:bg-emerald-400/10",
    iconColor: "text-emerald-800 dark:text-emerald-300",
    iconOpacity: "opacity-40",
  },
  [TERRAIN_TYPES.PONDS]: {
    Icon: Waves,
    border: "border-blue-600/50 dark:border-blue-400/50",
    bgUnit: "bg-blue-900 dark:bg-blue-950",
    bgEmpty: "bg-blue-600/10 dark:bg-blue-400/10",
    iconColor: "text-blue-800 dark:text-blue-300",
    iconOpacity: "opacity-40",
  },
  [TERRAIN_TYPES.RUBBLE]: {
    Icon: Mountain,
    border: "border-brand-red/50 dark:border-brand-red/50",
    bgUnit: "bg-red-800 dark:bg-red-900",
    bgEmpty: "bg-brand-red/10 dark:bg-brand-red/10",
    iconColor: "text-brand-red dark:text-brand-red",
    iconOpacity: "opacity-40",
  },
  [TERRAIN_TYPES.DESERT]: {
    Icon: DesertIcon,
    border: "border-amber-600/50 dark:border-amber-400/50",
    bgUnit: "bg-amber-900/50 dark:bg-amber-950/50",
    bgEmpty: "bg-amber-600/30 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconOpacity: "opacity-60",
  },
};

export const TerrainOverlay: React.FC<TerrainOverlayProps> = ({
  terrainType,
  hasUnit,
  rotationStyle,
  fogged,
}) => {
  if (fogged) return null;

  const config = TERRAIN_CONFIG[terrainType];
  if (!config) return null;

  const { Icon, border, bgUnit, bgEmpty, iconColor, iconOpacity } = config;

  return (
    <Flex
      align="center"
      justify="center"
      className={`absolute inset-0 border ${border} ${hasUnit ? bgUnit : bgEmpty}`}
      style={rotationStyle}
    >
      {!hasUnit && (
        <Icon className={`w-[70%] h-[70%] ${iconColor} ${iconOpacity}`} />
      )}
    </Flex>
  );
};
