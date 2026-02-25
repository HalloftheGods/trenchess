import { lazy } from "react";
import type { RouteConfig } from "@/constants/routes";
import { LoadingFallback } from "@/shared/components/molecules/LoadingFallback";
import { DebugErrorThrower } from "@/shared/components/atoms/DebugErrorThrower";

export const DEBUG_PATHS = {
  DEBUG_LOADING: "/debug/loading",
  DEBUG_404: "/debug/404",
  DEBUG_500: "/debug/500",
  DEBUG_START: "/debug/start",
  DEBUG_WIN: "/debug/win",
  DEBUG_LOSE: "/debug/lose",
} as const;

export const DebugLazyRoutes = {
  start: lazy(() => import("./StartDebug")),
  win: lazy(() => import("./WinDebug")),
  lose: lazy(() => import("./LoseDebug")),
};

export const getDebugRoutes = (): RouteConfig[] => [
  { path: "debug/loading", element: <LoadingFallback /> },
  { path: "debug/500", element: <DebugErrorThrower /> },
  { path: "debug/start", element: <DebugLazyRoutes.start /> },
  { path: "debug/win", element: <DebugLazyRoutes.win /> },
  { path: "debug/lose", element: <DebugLazyRoutes.lose /> },
];
