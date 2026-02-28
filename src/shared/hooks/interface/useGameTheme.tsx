import type { GameTheme } from "@tc.types";
import { useTheme } from "@shared/context/ThemeContext";

export function useGameTheme(): GameTheme {
  return useTheme();
}
