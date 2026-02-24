import React from "react";
import { Box, Flex } from "@atoms";
import { PLAYER_CONFIGS, INITIAL_ARMY } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import type { ArmyUnit, PieceType, TerrainType } from "@/shared/types/game";

interface CellPlacementPreviewProps {
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  turn: string;
  rotationStyle: React.CSSProperties;
  getIcon: (unit: ArmyUnit, className?: string) => React.ReactNode;
}

/**
 * CellPlacementPreview — Atom for showing the ghost of what's about to be built.
 */
export const CellPlacementPreview: React.FC<CellPlacementPreviewProps> = ({
  placementPiece,
  placementTerrain,
  turn,
  rotationStyle,
  getIcon,
}) => {
  if (placementPiece) {
    const unitTheme = INITIAL_ARMY.find((u) => u.type === placementPiece);
    if (!unitTheme) return null;

    return (
      <Flex
        align="center"
        justify="center"
        className={`absolute inset-0 opacity-50 ${PLAYER_CONFIGS[turn]?.text || ""} z-20`}
        style={rotationStyle}
      >
        {getIcon(unitTheme, "w-3/4 h-3/4")}
      </Flex>
    );
  }

  if (placementTerrain) {
    const terrainBorderMap: Record<string, string> = {
      [TERRAIN_TYPES.TREES]: "border-emerald-500",
      [TERRAIN_TYPES.PONDS]: "border-brand-blue",
      [TERRAIN_TYPES.DESERT]: "border-amber-500",
      [TERRAIN_TYPES.RUBBLE]: "border-brand-red",
    };

    return (
      <Box
        className={`absolute inset-0 border-4 opacity-50 ${terrainBorderMap[placementTerrain] || "border-brand-red"} z-20`}
      />
    );
  }

  return null;
};
