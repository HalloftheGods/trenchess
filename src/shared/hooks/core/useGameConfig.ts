import { useState, useEffect } from "react";
import type {
  GameConfigState,
  GameMode,
  GameState,
  SetupMode,
} from "@/shared/types";

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
