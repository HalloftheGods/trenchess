import type { GameMode } from "../core/GameMode";
import type { Dictionary } from "../../base";

export interface SetupActions {
  initGame: (selectedMode: GameMode) => void;
  initGameWithPreset: (
    selectedMode: GameMode,
    preset: string | null,
    newPlayerTypes?: Dictionary<"human" | "computer">,
    seed?: string,
    isMercenary?: boolean,
  ) => void;
  randomizeTerrain: (pids?: string[]) => void;
  generateElementalTerrain: (pids?: string[]) => void;
  randomizeUnits: (pids?: string[]) => void;
  setClassicalFormation: (pids?: string[]) => void;
  applyChiGarden: (pids?: string[]) => void;
  resetToOmega: () => void;
  mirrorBoard: () => void;
  resetTerrain: () => void;
  resetUnits: () => void;
  setMode: (mode: GameMode) => void;
}
