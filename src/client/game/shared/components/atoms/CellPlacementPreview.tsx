import React from "react";
import { Box, Flex } from "@atoms";
import { PLAYER_CONFIGS, INITIAL_ARMY, TERRAIN_INTEL } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import { canPlaceUnit } from "@/core/setup/validation";
import { Ban } from "lucide-react";
import type {
  ArmyUnit,
  PieceType,
  TerrainType,
  BoardPiece,
} from "@/shared/types/game";

interface CellPlacementPreviewProps {
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  currentPiece: BoardPiece | null;
  currentTerrain: TerrainType;
  turn: string;
  rotationStyle: React.CSSProperties;
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    size?: number | string,
    filled?: boolean,
  ) => React.ReactNode;
}

/**
 * CellPlacementPreview — Atom for showing the ghost of what's about to be built.
 */
export const CellPlacementPreview: React.FC<CellPlacementPreviewProps> = ({
  placementPiece,
  placementTerrain,
  currentPiece,
  currentTerrain,
  turn,
  rotationStyle,
  getIcon,
}) => {
  const isUnitPlacement = !!placementPiece;
  const isTerrainPlacement = !!placementTerrain;

  if (isUnitPlacement) {
    const unitTheme = INITIAL_ARMY.find((u) => u.type === placementPiece);
    if (!unitTheme) return null;

    const isCompatible = canPlaceUnit(placementPiece!, currentTerrain);

    return (
      <Flex
        align="center"
        justify="center"
        className={`absolute inset-0 z-20 transition-all duration-300 ${
          isCompatible
            ? `opacity-50 ${PLAYER_CONFIGS[turn]?.text || ""}`
            : "bg-brand-red/20 text-brand-red opacity-80"
        }`}
        style={rotationStyle}
      >
        {getIcon(unitTheme, "w-3/4 h-3/4")}
        {!isCompatible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Ban className="w-1/2 h-1/2 opacity-60" strokeWidth={3} />
          </div>
        )}
      </Flex>
    );
  }

  if (isTerrainPlacement) {
    const terrainInfo = TERRAIN_INTEL[placementTerrain!];
    const TerrainIcon = terrainInfo?.icon as React.ElementType;
    const isCompatible = currentPiece
      ? canPlaceUnit(currentPiece.type, placementTerrain!)
      : true;

    const terrainBorderMap: Record<string, string> = {
      [TERRAIN_TYPES.TREES]: "border-emerald-500",
      [TERRAIN_TYPES.PONDS]: "border-brand-blue",
      [TERRAIN_TYPES.DESERT]: "border-amber-500",
      [TERRAIN_TYPES.RUBBLE]: "border-brand-red",
    };

    const terrainColorMap: Record<string, string> = {
      [TERRAIN_TYPES.TREES]: "text-emerald-800 dark:text-emerald-300",
      [TERRAIN_TYPES.PONDS]: "text-blue-800 dark:text-blue-300",
      [TERRAIN_TYPES.DESERT]: "text-amber-600 dark:text-amber-400",
      [TERRAIN_TYPES.RUBBLE]: "text-brand-red dark:text-brand-red",
    };

    return (
      <Box
        className={`absolute inset-0 z-20 flex items-center justify-center border-4 transition-all duration-300 ${
          isCompatible
            ? `opacity-50 ${terrainBorderMap[placementTerrain!] || "border-brand-red"}`
            : "bg-brand-red/20 border-brand-red opacity-80"
        }`}
        style={rotationStyle}
      >
        {TerrainIcon && (
          <TerrainIcon
            className={`w-[70%] h-[70%] transition-transform duration-500 ${
              isCompatible
                ? terrainColorMap[placementTerrain!] || "text-white"
                : "opacity-40 grayscale text-brand-red"
            }`}
          />
        )}
        {!isCompatible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Ban
              className="w-1/2 h-1/2 text-brand-red opacity-60"
              strokeWidth={3}
            />
          </div>
        )}
      </Box>
    );
  }

  return null;
};
