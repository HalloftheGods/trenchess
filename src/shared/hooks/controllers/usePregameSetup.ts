import { useEffect, useRef } from "react";
import { useMatchState } from "@/shared/context/MatchStateContext";
import { PHASES } from "@constants/game";
import type { GameMode, SetupMode } from "@tc.types/game";

type PregamePreset = "omega" | "chi";

interface PregameConfig {
  preset: PregamePreset;
  mode: GameMode;
  playerConfig: Record<string, "human" | "computer">;
}

export const usePregameSetup = (config: PregameConfig) => {
  const game = useMatchState();
  const hasInitializedRef = useRef(false);

  const { preset, mode, playerConfig } = config;
  const { gameState, initGameWithPreset, setSetupMode } = game;

  const isTerrainStageAvailable = preset === "omega";
  const isPiecesStageAvailable = true;
  const initialSetupMode: SetupMode = isTerrainStageAvailable ? "terrain" : "pieces";

  useEffect(() => {
    const isSetupPhase =
      gameState === PHASES.MENU ||
      gameState === PHASES.GENESIS ||
      gameState === PHASES.GAMEMASTER;

    if (!isSetupPhase || hasInitializedRef.current) return;

    const presetMap: Record<PregamePreset, string> = {
      omega: "custom",
      chi: "terrainiffic",
    };

    initGameWithPreset(mode, presetMap[preset], playerConfig);
    setSetupMode(initialSetupMode);
    hasInitializedRef.current = true;
  }, [gameState, mode, preset, playerConfig, initGameWithPreset, setSetupMode, initialSetupMode]);

  return {
    ...game,
    isTerrainStageAvailable,
    isPiecesStageAvailable,
    initialSetupMode,
    preset,
  };
};
