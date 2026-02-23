/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Board preview wrapper for menu views.
 */
import React from "react";
import { useRouteContext } from "@/app/context/RouteContext";
import BoardPreview from "@/app/routes/game/components/organisms/BoardPreview";

interface MenuBoardPreviewProps {
  className?: string;
}

export const RouteBoardPreview: React.FC<MenuBoardPreviewProps> = ({
  className = "",
}) => {
  const {
    previewConfig,
    darkMode,
    pieceStyle,
    seeds,
    previewSeedIndex,
    terrainSeed,
  } = useRouteContext();

  if (
    !previewConfig?.mode &&
    !previewConfig?.forcedTerrain &&
    previewConfig?.protocol !== "terrainiffic" &&
    !previewConfig?.label &&
    !previewConfig?.highlightOuterSquares
  )
    return null;

  const currentSeed = seeds?.[previewSeedIndex];
  const activeCustomSeed = previewConfig.useDefaultFormation
    ? undefined
    : previewConfig.protocol === "terrainiffic"
      ? seeds?.[
          Math.floor(Math.abs(terrainSeed || 0) * (seeds?.length || 1)) %
            (seeds?.length || 1)
        ]?.seed
      : currentSeed?.seed;

  const defaultClassName =
    "hidden lg:block fixed right-20 top-1/2 -translate-y-1/2 w-[400px] z-40 animate-in fade-in slide-in-from-right-8 duration-500 pointer-events-none";

  return (
    <div className={className || defaultClassName}>
      <BoardPreview
        selectedMode={previewConfig.mode || null}
        selectedProtocol={previewConfig.protocol || null}
        darkMode={darkMode}
        pieceStyle={pieceStyle}
        showTerrainIcons={previewConfig.showIcons || undefined}
        hideUnits={previewConfig.hideUnits || undefined}
        labelOverride={previewConfig.label}
        forcedTerrain={previewConfig.forcedTerrain || null}
        customSeed={activeCustomSeed}
        terrainSeed={terrainSeed}
      />
    </div>
  );
};
