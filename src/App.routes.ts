import { lazy } from "react";
import { PLAY_PATHS, PlayLazyRoutes } from "./client/play/routes.tsx";
import { LEARN_PATHS, LearnLazyRoutes } from "./client/learn/routes.tsx";
import { GAME_PATHS, GameLazyRoutes } from "./client/game/routes.tsx";
import { HOME_PATHS, HomeLazyRoutes } from "./client/home/routes.tsx";
import { DEBUG_PATHS, DebugLazyRoutes } from "./client/debug/routes.tsx";
import { OTHER_PATHS, OtherLazyRoutes } from "./client/other/routes.tsx";

// Aggregated Route Paths
export const ROUTES = {
  ...HOME_PATHS,
  ...GAME_PATHS,
  ...PLAY_PATHS,
  ...LEARN_PATHS,
  ...OTHER_PATHS,
  ...DEBUG_PATHS,
} as const;

export const ROUTE_NAME_MAP: Record<string, string> = {
  [ROUTES.HOME]: "Home",
  [ROUTES.PLAY]: "Battle",
  [ROUTES.LEARN]: "Academy",
  [ROUTES.STATS]: "Hall of Fame",
  [ROUTES.RULES]: "Rulebook",
  [ROUTES.SCOREBOARD]: "Leaderboard",
  [ROUTES.TUTORIAL]: "Training Grounds",
};

/** Shorthand for lazy-loading a route component. */
export { lazy as lazyRoute } from "react";

export const LazyRoutes = {
  shared: {
    layout: lazy(() => import("@/shared/components/templates/RouteLayout")),
  },
  home: HomeLazyRoutes,
  game: GameLazyRoutes,
  play: PlayLazyRoutes,
  learn: LearnLazyRoutes,
  debug: DebugLazyRoutes,
  other: OtherLazyRoutes,
};
