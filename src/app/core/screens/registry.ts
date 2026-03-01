import React from "react";
import CombatScreen from "./CombatScreen";
import StartScreen from "./StartScreen";
import WinScreen from "./WinScreen";
import LoadingScreen from "./LoadingScreen";
import GenesisScreen from "./GenesisScreen";
import MainLoadoutScreen from "./MainLoadoutScreen";

import type { GameStateHook } from "@tc.types";

export type ScreenId =
  | "combat"
  | "start"
  | "win"
  | "loading"
  | "genesis"
  | "main";

export interface BaseScreenProps {
  game?: GameStateHook;
  isOnline?: boolean;
  onMenuClick?: () => void;
  onHowToPlayClick?: () => void;
  onLibraryClick?: () => void;
  boardType?: "omega" | "pi" | "chi" | "standard";
  initialLayout?: string;
}

export interface ScreenRegistryItem {
  id: ScreenId;
  component: React.FC<BaseScreenProps>;
}

export const SCREEN_REGISTRY: Record<ScreenId, React.FC<BaseScreenProps>> = {
  combat: CombatScreen as React.FC<BaseScreenProps>,
  start: StartScreen as React.FC<BaseScreenProps>,
  win: WinScreen as React.FC<BaseScreenProps>,
  loading: LoadingScreen as React.FC<BaseScreenProps>,
  genesis: GenesisScreen as React.FC<BaseScreenProps>,
  main: MainLoadoutScreen as React.FC<BaseScreenProps>,
};

export const getScreen = (id: ScreenId) => SCREEN_REGISTRY[id];
