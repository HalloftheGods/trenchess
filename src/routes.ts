import { lazy } from "react";

// Route Paths
export const ROUTES = {
  HOME: "/",
  GAME: "/game",
  GAME_MMO: "/game/mmo",
  GAME_DETAIL: "/game/:roomId",

  /////// Menu - Play
  PLAY: "/play",
  PLAY_LOCAL: "/play/local",
  PLAY_LOBBY: "/play/lobby",
  PLAY_SETUP: "/play/setup",

  /////// Menu - Learn
  LEARN: "/learn",
  LEARN_MANUAL: "/learn/manual",
  LEARN_ENDGAME: "/learn/endgame",
  LEARN_ENDGAME_WORLD: "/learn/endgame/capture-the-world",
  LEARN_ENDGAME_KING: "/learn/endgame/capture-the-king",
  LEARN_ENDGAME_ARMY: "/learn/endgame/capture-the-army",
  LEARN_TRENCH: "/learn/trench",
  LEARN_TRENCH_DETAIL: "/learn/trench/:terrain",
  LEARN_CHESS: "/learn/chess",
  LEARN_CHESS_DETAIL: "/learn/chess/:unitType",
  LEARN_MATH: "/learn/math",

  SCOREBOARD: "/scoreboard",
  RULES: "/rules",
  STATS: "/stats",
  ZEN: "/zen",
  TUTORIAL: "/tutorial",
  LIBRARY: "/library",

  DEBUG_LOADING: "/debug/loading",
  DEBUG_404: "/debug/404",
  DEBUG_500: "/debug/500",
} as const;

/** Shorthand for lazy-loading a route component. */
export { lazy as lazyRoute } from "react";

export const LazyRoutes = {
  shared: {
    layout: lazy(() => import("@/shared/components/templates/RouteLayout")),
  },
  home: {
    view: lazy(() => import("@/client/home/index")),
    notFound: lazy(() => import("@/client/home/components/views/NotFoundView")),
  },
  game: {
    screen: lazy(() => import("@/client/game/index")),
    mmo: lazy(() => import("@/client/game/mmo")),
    library: lazy(
      () => import("@/client/game/components/organisms/SeedLibrary"),
    ),
  },
  play: {
    view: lazy(() => import("@/client/play/play")),
    local: lazy(() => import("@/client/play/local")),
    lobby: lazy(() => import("@/client/play/lobby")),
    setup: lazy(() => import("@/client/play/setup")),
  },
  learn: {
    view: lazy(() => import("@/client/learn/index")),
    manual: lazy(() => import("@/client/learn/manual")),
    endgame: {
      main: lazy(() => import("@/client/learn/endgame/index")),
      world: lazy(() => import("@/client/learn/endgame/capture-the-world")),
      king: lazy(() => import("@/client/learn/endgame/capture-the-king")),
      army: lazy(() => import("@/client/learn/endgame/capture-the-army")),
    },
    trench: {
      main: lazy(() => import("@/client/learn/trench/index")),
      detail: lazy(() => import("@/client/learn/trench/detail")),
    },
    chess: {
      main: lazy(() => import("@/client/learn/chess/index")),
      detail: lazy(() => import("@/client/learn/chess/detail")),
    },
    math: {
      main: lazy(() => import("@/client/learn/math/index")),
    },
  },
  scoreboard: {
    view: lazy(() => import("@/client/scoreboard")),
  },
  rules: {
    view: lazy(() => import("@/client/rules")),
  },
  stats: {
    view: lazy(() => import("@/client/stats")),
  },
  tutorial: {
    view: lazy(() => import("@/client/tutorial")),
  },
};
