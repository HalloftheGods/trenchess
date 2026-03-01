import { getPath } from "@/app/router/router";

import type { RouteConfig } from "@tc.types";
import { HomeScreen, NotFoundScreen } from "./screens";

export const getHomeRoutes = (): RouteConfig[] => [
  { path: getPath("home"), element: <HomeScreen />, index: true },

  {
    path: "*",
    element: <NotFoundScreen />,
  },
];
