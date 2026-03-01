import type { RouteConfig } from "@tc.types";
import { ROUTES } from "@/app/router/router";
import {
  PlayScreen,
  PlayLocalScreen,
  PlayLobbyScreen,
  PlaySetupScreen,
} from "./screens";

export const playRoutes: RouteConfig[] = [
  { path: ROUTES.play.index, element: <PlayScreen /> },
  { path: ROUTES.play.local, element: <PlayLocalScreen /> },
  { path: ROUTES.play.lobby, element: <PlayLobbyScreen /> },
  { path: ROUTES.play.setup, element: <PlaySetupScreen /> },
];
