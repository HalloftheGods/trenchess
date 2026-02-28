import type { PHASES } from "@constants/game";

export type GameState = (typeof PHASES)[keyof typeof PHASES];
