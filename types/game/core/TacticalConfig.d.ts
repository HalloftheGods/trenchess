import type { s, n, b, PlayerID } from "../../base";
import type { GameMode } from "./GameMode";

export interface TacticalConfig {
  id: GameMode;
  name: s;
  players: PlayerID[];
  quota: n;
  layout: "vertical" | "horizontal" | "quadrant";
  isCoop?: b;
}
