import React from "react";
export type * from "./game";
export type * from "./guide";
export type * from "./multiplayer";
export type * from "./ui";
export type * from "./hooks";
export type * from "./state";
export type * from "./core";
export type * from "./route";

import type { GameMode, PreviewConfig, SeedItem, ArmyUnit } from "./game";
import type { MultiplayerState } from "./multiplayer";
import type { GameStateHook } from "./state";
export type { GameStateHook };

export interface AppRoutesProps {
  game: GameStateHook;
  routeContextValue: RouteContextType;
  handleBackToMenu: () => void;
}

export interface RouteContextType {
  hoveredMenu: string | null;
  setHoveredMenu: (menu: string | null) => void;
  darkMode: boolean;
  multiplayer?: MultiplayerState;
  pieceStyle: "bold" | "emoji" | "outlined" | "custom" | "lucide";
  toggleTheme?: () => void;
  togglePieceStyle?: () => void;
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    size?: number | string,
    filled?: boolean,
  ) => React.ReactNode;
  onTutorial?: () => void;
  onLogoClick?: () => void;
  onZenGarden?: () => void;
  onGamemaster?: () => void;
  setPlayerTypes: (types: Record<string, "human" | "computer">) => void;
  onStartGame: (
    mode: GameMode,
    preset: string | null,
    playerConfig: Record<string, "human" | "computer">,
    seed?: string,
    isMercenary?: boolean,
  ) => void;
  isStarting: boolean;
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
