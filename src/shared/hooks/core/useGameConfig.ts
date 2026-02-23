import { useState, useEffect } from "react";
import type { GameMode, GameState, SetupMode } from "@/core/types/game";

export interface GameConfigState {
  mode: GameMode;
  setMode: React.Dispatch<React.SetStateAction<GameMode>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setupMode: SetupMode;
  setSetupMode: React.Dispatch<React.SetStateAction<SetupMode>>;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  autoFlip: boolean;
  setAutoFlip: React.Dispatch<React.SetStateAction<boolean>>;
  layoutName: string;
  setLayoutName: React.Dispatch<React.SetStateAction<string>>;
  selectedPreset:
    | "classic"
    | "quick"
    | "terrainiffic"
    | "custom"
    | "zen-garden"
    | null;
  setSelectedPreset: React.Dispatch<
    React.SetStateAction<
      "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden" | null
    >
  >;
  showBgDebug: boolean;
  setShowBgDebug: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useGameConfig(): GameConfigState {
  const [setupMode, setSetupMode] = useState<SetupMode>("terrain");
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [layoutName, setLayoutName] = useState("Zen Garden Layout");
  const [showBgDebug, setShowBgDebug] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState<
    "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden" | null
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trenchess_preset");
      if (saved)
        return saved as
          | "classic"
          | "quick"
          | "terrainiffic"
          | "custom"
          | "zen-garden";
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedPreset) {
        localStorage.setItem("trenchess_preset", selectedPreset);
      } else {
        localStorage.removeItem("trenchess_preset");
      }
    }
  }, [selectedPreset]);

  const [mode, setMode] = useState<GameMode>("2p-ns");
  const [gameState, setGameState] = useState<GameState>("menu");

  return {
    mode,
    setMode,
    gameState,
    setGameState,
    setupMode,
    setSetupMode,
    isFlipped,
    setIsFlipped,
    autoFlip,
    setAutoFlip,
    layoutName,
    setLayoutName,
    selectedPreset,
    setSelectedPreset,
    showBgDebug,
    setShowBgDebug,
  };
}
