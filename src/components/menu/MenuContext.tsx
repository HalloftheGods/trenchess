import React, { createContext, useContext } from "react";
import type { GameMode, TerrainType } from "../../types/game";
import type { PieceStyle } from "../../constants";

export interface PreviewConfig {
  mode: GameMode | null;
  protocol?:
    | "classic"
    | "quick"
    | "terrainiffic"
    | "custom"
    | "zen-garden"
    | null;
  showIcons?: boolean;
  hideUnits?: boolean;
  forcedTerrain?: TerrainType | null;
  useDefaultFormation?: boolean;
}

export interface MenuContextType {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  hoveredMenu: string | null;
  setHoveredMenu: (menu: string | null) => void;
  hoveredTerrain: TerrainType | null;
  setHoveredTerrain: (terrain: TerrainType | null) => void;
  terrainSeed: number;
  setTerrainSeed: (seed: number) => void;
  selectedPreset: string | null;
  setSelectedPreset: (preset: any) => void;
  selectedBoard: GameMode | null;
  setSelectedBoard: (mode: GameMode | null) => void;
  seeds: any[];
  previewSeedIndex: number;
  setPreviewSeedIndex: React.Dispatch<React.SetStateAction<number>>;
  previewConfig: PreviewConfig;
  setPreviewConfig: React.Dispatch<React.SetStateAction<PreviewConfig>>;
  playerConfig: Record<string, "human" | "computer">;
  setPlayerConfig: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
  togglePlayerType: (pid: string) => void;
  multiplayer: any;
  onStartGame: (
    mode: GameMode,
    preset: any,
    playerTypes?: any,
    seed?: string,
  ) => void;
  onTutorial: () => void;
  onCtwGuide: () => void;
  onChessGuide: () => void;
  onTrenchGuide: (terrain?: TerrainType) => void;
  onOpenLibrary: () => void;
}

export const MenuContext = createContext<MenuContextType | undefined>(
  undefined,
);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuLayout");
  }
  return context;
};
