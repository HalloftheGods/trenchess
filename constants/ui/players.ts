import type { PlayerConfig } from "@/shared/types/game";

export const PLAYER_CONFIGS: Record<string, PlayerConfig> = {
  red: {
    name: "Red",
    color: "brand-red",
    text: "text-brand-red",
    bg: "bg-brand-red",
    shadow: "shadow-brand-red/40",
  },
  yellow: {
    name: "Yellow",
    color: "yellow-500",
    text: "text-yellow-500",
    bg: "bg-yellow-500",
    shadow: "shadow-yellow-900/40",
  },
  green: {
    name: "Green",
    color: "green-600",
    text: "text-green-500",
    bg: "bg-green-600",
    shadow: "shadow-green-900/40",
  },
  blue: {
    name: "Blue",
    color: "brand-blue",
    text: "text-brand-blue",
    bg: "bg-brand-blue",
    shadow: "shadow-brand-blue/40",
  },
};
