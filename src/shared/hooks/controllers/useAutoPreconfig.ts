import { useEffect, useRef } from "react";
import { PHASES } from "@constants/game";
import type { GameMode } from "@tc.types";

import { useMatchState } from "@/shared/context/MatchStateContext";

/**
 * useAutoPreconfig — Auto-initializes the game board based on a preconfig style.
 * This hook is used within the preconfig views (Alpha, Pi, Chi, Omega).
 *
 * @param style - The preconfig style to load ('alpha' | 'pi' | 'chi' | 'omega')
 */
export const useAutoPreconfig = (style?: "alpha" | "pi" | "chi" | "omega") => {
  const game = useMatchState();
  const { gameState, mode, initGameWithPreset, isMercenary } = game;
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Only initialize if we haven't already and we are in a setup-compatible phase
    const isSetupPhase =
      gameState === PHASES.MENU ||
      gameState === PHASES.GAMEMASTER ||
      gameState === PHASES.GENESIS;

    if (isSetupPhase && !hasInitializedRef.current && style) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlMode = urlParams.get("mode") as GameMode;
      const activeMode = urlMode || mode || "4p";

      // Map URL styles to engine presets
      const styleMap: Record<string, string> = {
        pi: "pi",
        alpha: "alpha",
        chi: "chi",
        omega: "omega",
      };

      const preset = styleMap[style] || style;

      // Extract player configuration from URL if available
      const newPlayerTypes: Record<string, "human" | "computer"> = {};
      ["red", "blue", "yellow", "green"].forEach((pid) => {
        const type = urlParams.get(pid);
        if (type === "human" || type === "computer") {
          newPlayerTypes[pid] = type;
        }
      });
      const hasPlayerConfig = Object.keys(newPlayerTypes).length > 0;

      initGameWithPreset(
        activeMode,
        preset,
        hasPlayerConfig ? newPlayerTypes : undefined,
        undefined,
        !!isMercenary,
      );
      hasInitializedRef.current = true;
    }
  }, [style, gameState, mode, initGameWithPreset, isMercenary]);

  return game;
};
