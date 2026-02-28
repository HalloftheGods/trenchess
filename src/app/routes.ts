// --- Route Definitions ---

import { learn, play, game, dev } from "./client/routes";

export const ROUTES = {
  home: "/",
  console: {
    gamemaster: "/console/gamemaster",
  },
  game,
  dev,
  learn,
  library: "/library",
  play,
  rules: "/rules",
  scoreboard: "/scoreboard",
  stats: "/stats",
  tutorial: "/tutorial",
  zen: "/zen",
} as const;

export const ROUTE_NAME_MAP: Record<string, string> = {
  [ROUTES.home]: "Home",
  [ROUTES.play.index]: "Battle",
  [ROUTES.learn.index]: "Academy",
  [ROUTES.stats]: "Hall of Fame",
  [ROUTES.rules]: "Rulebook",
  [ROUTES.scoreboard]: "Leaderboard",
  [ROUTES.tutorial]: "Training Grounds",
  [ROUTES.console.gamemaster]: "Game Master",
};
