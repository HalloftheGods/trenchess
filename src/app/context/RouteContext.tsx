import React, { createContext, useContext, useState } from "react";

interface RouteContextType {
  hoveredMenu: string | null;
  setHoveredMenu: (menu: string | null) => void;
  darkMode: boolean;
  multiplayer?: any;
  pieceStyle: any;
  toggleTheme?: () => void;
  togglePieceStyle?: () => void;
  onTutorial?: () => void;
  onLogoClick?: () => void;
  onZenGarden?: () => void;
  onStartGame: (mode: any, preset: any, playerConfig: any, seed?: any) => void;
  selectedBoard: any;
  setSelectedBoard: (m: any) => void;
  selectedPreset: any;
  setSelectedPreset: (p: any) => void;
  onCtwGuide?: () => void;
  onChessGuide?: () => void;
  onTrenchGuide?: (t?: string) => void;
  onOpenLibrary?: () => void;
  playerConfig: any;
  previewConfig: any;
  setPreviewConfig: (config: any) => void;
  playerCount: number;
  playMode: string;
  setHoveredTerrain: (terrain: string | null) => void;
  seeds: any[];
  previewSeedIndex: number;
  setPreviewSeedIndex: (i: number) => void;
  terrainSeed: number | undefined;
  setTerrainSeed: (seed: number | null) => void;
  backAction: { label?: string; onClick: () => void } | null;
  setBackAction: (
    action: { label?: string; onClick: () => void } | null,
  ) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider: React.FC<{
  children: React.ReactNode;
  value: any;
}> = ({ children, value }) => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [_hoveredTerrain, setHoveredTerrain] = useState<string | null>(null);
  const [terrainSeed, setTerrainSeed] = useState<number | undefined>(
    value?.terrainSeed,
  );
  const [previewSeedIndex, setPreviewSeedIndex] = useState<number>(
    value?.previewSeedIndex || 0,
  );
  const [previewConfig, setPreviewConfig] = useState<any>(
    value?.previewConfig || {},
  );
  const [backAction, setBackAction] = useState<{
    label?: string;
    onClick: () => void;
  } | null>(null);

  return (
    <RouteContext.Provider
      value={{
        ...value,
        hoveredMenu,
        setHoveredMenu,
        setHoveredTerrain,
        terrainSeed: terrainSeed ?? value?.terrainSeed,
        setTerrainSeed,
        previewSeedIndex: previewSeedIndex ?? value?.previewSeedIndex,
        setPreviewSeedIndex,
        previewConfig: previewConfig || value?.previewConfig,
        setPreviewConfig,
        backAction,
        setBackAction,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = () => {
  const context = useContext(RouteContext);
  if (!context)
    throw new Error("useRouteContext must be used within RouteProvider");
  return context;
};
