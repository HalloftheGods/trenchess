import React from "react";
import type { GameMode } from "../../game/core";
import type { PieceStyle, ArmyUnit } from "../../ux";
import type { PreviewConfig, SeedItem } from "../config/PreviewConfig";
import type { MultiplayerState } from "../../game/multiplayer";
import type { Dictionary, IconProps } from "../../base";

export interface RouteContextType {
  hoveredMenu: string | null;
  setHoveredMenu: (menu: string | null) => void;
  darkMode: boolean;
  multiplayer?: MultiplayerState;
  pieceStyle: PieceStyle;
  toggleTheme?: () => void;
  togglePieceStyle?: () => void;
  getIcon: (
    unit: ArmyUnit,
    props?: IconProps | string,
    size?: number | string,
    filled?: boolean,
  ) => React.ReactNode;
  onTutorial?: () => void;
  onLogoClick?: () => void;
  onZenGarden?: () => void;
  onGamemaster?: () => void;
  setPlayerTypes: (types: Dictionary<"human" | "computer">) => void;
  onStartGame: (
    mode: GameMode,
    preset: string | null,
    playerConfig: Dictionary<"human" | "computer">,
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
  playerConfig: Dictionary<"human" | "computer">;
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
