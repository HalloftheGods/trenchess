import { getPath } from "@/app/router/router";
import type { RouteConfig } from "@tc.types";

import {
  PlayScreen,
  PlayLocalScreen,
  PlayLobbyScreen,
  PlaySetupScreen,
} from "./screens";

export const playRoutes: RouteConfig[] = [
  { path: getPath("play.index"), element: <PlayScreen /> },
  { path: getPath("play.local"), element: <PlayLocalScreen /> },
  { path: getPath("play.lobby"), element: <PlayLobbyScreen /> },
  { path: getPath("play.setup"), element: <PlaySetupScreen /> },
];
