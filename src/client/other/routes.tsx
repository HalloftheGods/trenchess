import { lazy } from "react";
import type { NavigateFunction } from "react-router-dom";
import type { RouteConfig } from "@/App.routes.tsx";

export const OTHER_PATHS = {
  SCOREBOARD: "/scoreboard",
  RULES: "/rules",
  STATS: "/stats",
  ZEN: "/zen",
  TUTORIAL: "/tutorial",
} as const;

export const OtherLazyRoutes = {
  scoreboard: lazy(() => import("@/client/scoreboard")),
  rules: lazy(() => import("@/client/rules")),
  stats: lazy(() => import("@/client/stats")),
  tutorial: lazy(() => import("@/client/tutorial")),
};

export const getOtherRoutes = (
  darkMode: boolean,
  handleBackToMenu: () => void,
  navigate: NavigateFunction,
): RouteConfig[] => [
  {
    path: "scoreboard",
    element: <OtherLazyRoutes.scoreboard.view darkMode={darkMode} />,
  },
  {
    path: "rules",
    element: (
      <OtherLazyRoutes.rules.view
        onBack={() => navigate(-1)}
        darkMode={darkMode}
      />
    ),
  },
  { path: "stats", element: <OtherLazyRoutes.stats.view /> },
  { path: "zen", element: <div /> },
  {
    path: "tutorial",
    element: (
      <OtherLazyRoutes.tutorial.view
        onBack={handleBackToMenu}
        darkMode={darkMode}
      />
    ),
  },
];
