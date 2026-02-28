import type { RouteConfig } from "@tc.types";
import {
  PlayScreen,
  PlayLocalScreen,
  PlayLobbyScreen,
  PlaySetupScreen,
} from "./screens";
import PLAY_ROUTES from "./constants";

export const playRoutes: RouteConfig[] = [
  { path: PLAY_ROUTES.index, element: <PlayScreen /> },
  { path: PLAY_ROUTES.local, element: <PlayLocalScreen /> },
  { path: PLAY_ROUTES.lobby, element: <PlayLobbyScreen /> },
  { path: PLAY_ROUTES.setup, element: <PlaySetupScreen /> },
];
