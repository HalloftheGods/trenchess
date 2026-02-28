import type { RouteConfig, GameStateHook } from "@tc.types";
import { DevCliScreen, DevRuleSetScreen } from "./screens";
import DEV_ROUTES from "./constants";

export const getDevRoutes = (game: GameStateHook): RouteConfig[] => [
  { path: DEV_ROUTES.cli, element: <DevCliScreen game={game} /> },
  { path: DEV_ROUTES.ruleset, element: <DevRuleSetScreen game={game} /> },
];
