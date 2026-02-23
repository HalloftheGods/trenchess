/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import type {
  GameMode,
  PreviewConfig,
  SeedItem,
  MultiplayerState,
} from "@/types";

interface RouteContextType {
  hoveredMenu: string | null;
  setHoveredMenu: (menu: string | null) => void;
  darkMode: boolean;
  multiplayer?: MultiplayerState;
  pieceStyle: "bold" | "emoji" | "outlined" | "custom" | "lucide";
  toggleTheme?: () => void;
  togglePieceStyle?: () => void;
  onTutorial?: () => void;
  onLogoClick?: () => void;
  onZenGarden?: () => void;
  onStartGame: (
    mode: GameMode,
    preset: string | null,
    playerConfig: Record<string, "human" | "computer">,
    seed?: string,
  ) => void;
  selectedBoard: GameMode | null;
  setSelectedBoard: (m: GameMode | null) => void;
  selectedPreset:
    | "classic"
    | "quick"
    | "terrainiffic"
    | "custom"
    | "zen-garden"
    | null;
  setSelectedPreset: (
    p: "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden" | null,
  ) => void;
  onCtwGuide?: () => void;
  onChessGuide?: () => void;
  onTrenchGuide?: (t?: string) => void;
  onOpenLibrary?: () => void;
  playerConfig: Record<string, "human" | "computer">;
  previewConfig: PreviewConfig;
  setPreviewConfig: (config: PreviewConfig) => void;
  playerCount: number;
  playMode: string;
  setHoveredTerrain: (terrain: string | null) => void;
  seeds: SeedItem[];
  previewSeedIndex: number;
  setPreviewSeedIndex: (i: number) => void;
  terrainSeed: number | undefined;
  setTerrainSeed: (seed: number | undefined) => void;
  backAction: { label?: string; onClick: () => void } | null;
  setBackAction: (
    action: { label?: string; onClick: () => void } | null,
  ) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

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

  return (
    <RouteContext.Provider
      value={{
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
