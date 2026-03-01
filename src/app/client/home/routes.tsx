import { ROUTES } from "@/app/router/router";
import type { RouteConfig } from "@tc.types";
import { HomeScreen, NotFoundScreen } from "./screens";

export const getHomeRoutes = (): RouteConfig[] => [
  { path: ROUTES.home, element: <HomeScreen />, index: true },

  {
    path: "*",
    element: <NotFoundScreen />,
  },
];
