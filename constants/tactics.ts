import { MAX_TERRAIN_PER_PLAYER } from "./terrain";
import type { TacticalConfig } from "@/shared/types/game";

export const TACTICAL_CONFIGS: Record<string, TacticalConfig> = {
  "2p-ns": {
    id: "2p-ns",
    name: "North vs South",
    players: ["red", "blue"],
    quota: MAX_TERRAIN_PER_PLAYER.TWO_PLAYER,
    layout: "vertical",
  },
  "2p-ew": {
    id: "2p-ew",
    name: "West vs East",
    players: ["green", "yellow"],
    quota: MAX_TERRAIN_PER_PLAYER.TWO_PLAYER,
    layout: "horizontal",
  },
  "4p": {
    id: "4p",
    name: "Quadrant Combat",
    players: ["red", "yellow", "green", "blue"],
    quota: MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER,
    layout: "quadrant",
  },
  "2v2": {
    id: "2v2",
    name: "Capture the World 2v2",
    players: ["red", "yellow", "green", "blue"],
    quota: MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER,
    layout: "quadrant",
    isCoop: true,
  },
};
