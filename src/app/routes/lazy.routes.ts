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
  LEARN_ENDGAME_CTW: "/learn/endgame/capture-the-world",
  LEARN_ENDGAME_CTK: "/learn/endgame/capture-the-king",
  LEARN_ENDGAME_CTA: "/learn/endgame/capture-the-army",
  LEARN_TRENCH: "/learn/trench",
  LEARN_TRENCH_DETAIL: "/learn/trench/:terrain",
  LEARN_CHESS: "/learn/chess",
  LEARN_CHESS_DETAIL: "/learn/chess/:unitType",

  // Help
  SCOREBOARD: "/scoreboard",
  RULES: "/rules",
  ZEN: "/zen",
  TUTORIAL: "/tutorial",
  LIBRARY: "/library",

  LOADING: "/loading",
} as const;

/** Shorthand for lazy-loading a route component. */
export { lazy as lazyRoute } from "react";

export const LazyRouteLayout = lazy(
  () => import("@/app/routes/shared/components/templates/RouteLayout"),
);

// All lazy-loaded components are exported from their respective sub-route files:
export * from "@/app/routes/game/_lazy.routes";
export * from "@/app/routes/home/_lazy.routes";
export * from "@/app/routes/play/_lazy.routes";
export * from "@/app/routes/learn/_lazy.routes";
export * from "@/app/routes/scoreboard/lazy.routes";
export * from "@/app/routes/rules/lazy.routes";
export * from "@/app/routes/tutorial/_lazy.routes";
