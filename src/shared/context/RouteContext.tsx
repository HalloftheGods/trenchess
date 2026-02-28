/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo } from "react";
import type { RouteContextType, PreviewConfig } from "@tc.types";

export const RouteContext = createContext<RouteContextType | undefined>(
  undefined,
);

export const RouteProvider: React.FC<{
  children: React.ReactNode;
  value: Partial<RouteContextType>;
}> = ({ children, value }) => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [_hoveredTerrain, setHoveredTerrain] = useState<string | null>(null);
  const [terrainSeed, setTerrainSeed] = useState<number | undefined>(
    value?.terrainSeed,
  );
  const [previewSeedIndex, setPreviewSeedIndex] = useState<number>(
    value?.previewSeedIndex || 0,
  );
  const [previewConfig, setPreviewConfig] = useState<PreviewConfig>(
    value?.previewConfig || {},
  );
  const [backAction, setBackAction] = useState<{
    label?: string;
    onClick: () => void;
  } | null>(null);

  const contextValue = useMemo(
    () => ({
      ...(value as RouteContextType),
      hoveredMenu,
      setHoveredMenu,
      setHoveredTerrain,
      terrainSeed: terrainSeed ?? value?.terrainSeed,
      setTerrainSeed,
      previewSeedIndex: previewSeedIndex ?? value?.previewSeedIndex ?? 0,
      setPreviewSeedIndex,
      previewConfig: previewConfig || value?.previewConfig || {},
      setPreviewConfig,
      backAction,
      setBackAction,
    }),
    [
      value,
      hoveredMenu,
      terrainSeed,
      previewSeedIndex,
      previewConfig,
      backAction,
    ],
  );

  return (
    <RouteContext.Provider value={contextValue}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRouteContext must be used within RouteProvider");
  }
  return context;
};
