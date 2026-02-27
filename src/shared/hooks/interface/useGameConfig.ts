import { useState } from "react";
import { usePersistentPreset } from "./usePersistentPreset";
import type { GameConfigState, SetupMode } from "@/shared/types";

export function useGameConfig(): GameConfigState {
  const [setupMode, setSetupMode] = useState<SetupMode>("terrain");
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [layoutName, setLayoutName] = useState("Zen Garden Layout");
  const [showBgDebug, setShowBgDebug] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const [selectedPreset, setSelectedPreset] = usePersistentPreset();

  return {
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
    showRules,
    setShowRules,
  };
}
