import React from "react";
import { PLAYER_CONFIGS } from "@/constants";
import { INITIAL_ARMY } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import { Box, Flex } from "@atoms";
import type { ArmyUnit, PieceType, TerrainType } from "@/shared/types/game";

interface PiecePlacementPreviewProps {
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  turn: string;
  rotationStyle: React.CSSProperties;
  getIcon: (unit: ArmyUnit, className?: string) => React.ReactNode;
}

export const PiecePlacementPreview: React.FC<PiecePlacementPreviewProps> = ({
  placementPiece,
  placementTerrain,
  turn,
  rotationStyle,
  getIcon,
}) => {
  if (placementPiece) {
    return (
      <Flex
        align="center"
        justify="center"
        className={`absolute inset-0 opacity-50 ${PLAYER_CONFIGS[turn].text} z-20`}
        style={rotationStyle}
      >
        {getIcon(
          INITIAL_ARMY.find((u) => u.type === placementPiece)!,
          "w-3/4 h-3/4",
        )}
      </Flex>
    );
  }

  if (placementTerrain) {
    return (
      <Box
        className={`absolute inset-0 border-4 opacity-50 ${placementTerrain === TERRAIN_TYPES.TREES ? "border-emerald-500" : placementTerrain === TERRAIN_TYPES.PONDS ? "border-brand-blue" : placementTerrain === TERRAIN_TYPES.DESERT ? "border-amber-500" : "border-brand-red"}`}
      />
    );
  }

  return null;
};
