import { lazy } from "react";
import type { RouteConfig } from "@/constants/routes";

export const HOME_PATHS = {
  HOME: "/",
} as const;

export const HomeLazyRoutes = {
  view: lazy(() => import("./index")),
  notFound: lazy(() => import("./components/views/NotFoundView")),
};

export const getHomeRoutes = (): RouteConfig[] => [
  { index: true, element: <HomeLazyRoutes.view /> },
  { path: "*", element: <HomeLazyRoutes.notFound /> },
];
