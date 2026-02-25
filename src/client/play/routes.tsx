import { lazy } from "react";
import type { RouteConfig } from "@/constants/routes";

export const PLAY_PATHS = {
  PLAY: "/play",
  PLAY_LOCAL: "/play/local",
  PLAY_LOBBY: "/play/lobby",
  PLAY_SETUP: "/play/setup",
} as const;

export const PlayLazyRoutes = {
  view: lazy(() => import("./play")),
  local: lazy(() => import("./local")),
  lobby: lazy(() => import("./lobby")),
  setup: lazy(() => import("./setup")),
};

export const getPlayRoutes = (): RouteConfig[] => [
  { path: "play", element: <PlayLazyRoutes.view /> },
  { path: "play/local", element: <PlayLazyRoutes.local /> },
  { path: "play/lobby", element: <PlayLazyRoutes.lobby /> },
  { path: "play/setup", element: <PlayLazyRoutes.setup /> },
];
