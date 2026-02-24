import React from "react";
import type { TerrainType } from "@/shared/types/game";
import { TERRAIN_DETAILS } from "@/constants";
import { Mountain, Trees, Waves } from "lucide-react";
import { DesertIcon } from "@/client/game/shared/components/atoms/UnitIcons";
import { TERRAIN_TYPES } from "@/constants";
import { Box } from "@atoms";

interface TerrainIconBadgeProps {
  terrainKey: TerrainType;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export const TerrainIconBadge: React.FC<TerrainIconBadgeProps> = ({
  terrainKey,
  className = "",
  onClick,
  active = false,
}) => {
  const terrainInfo = TERRAIN_DETAILS.find((t) => t.key === terrainKey);

  if (terrainInfo) {
    const Icon = terrainInfo.icon;
    let badgeType = "terrain-badge-blue";
    if (terrainKey === TERRAIN_TYPES.MOUNTAINS) badgeType = "terrain-badge-red";
    if (terrainKey === TERRAIN_TYPES.FORESTS) badgeType = "terrain-badge-green";
    if (terrainKey === TERRAIN_TYPES.DESERT) badgeType = "terrain-badge-amber";

    return (
      <Box
        as="button"
        className={`terrain-badge clickable-unit ${badgeType} ${active ? "ring-4 ring-white shadow-2xl scale-110 z-10" : "opacity-60 hover:opacity-100"} ${className}`}
        onClick={onClick}
      >
        {Icon && <Icon size={28} className="fill-current" />}
      </Box>
    );
  }

  // Fallback if not in TERRAIN_DETAILS
  let badgeType = "terrain-badge-blue";
  let IconComp: React.ElementType = Waves;

  if (terrainKey === TERRAIN_TYPES.MOUNTAINS) {
    badgeType = "terrain-badge-red";
    IconComp = Mountain;
  } else if (terrainKey === TERRAIN_TYPES.FORESTS) {
    badgeType = "terrain-badge-green";
    IconComp = Trees;
  } else if (terrainKey === TERRAIN_TYPES.DESERT) {
    badgeType = "terrain-badge-amber";
    IconComp = DesertIcon;
  }

  return (
    <Box
      as="button"
      className={`terrain-badge clickable-unit ${badgeType} ${active ? "ring-4 ring-white shadow-2xl scale-110 z-10" : "opacity-60 hover:opacity-100"} ${className}`}
      onClick={onClick}
    >
      <IconComp size={28} className="fill-current" />
    </Box>
  );
};
