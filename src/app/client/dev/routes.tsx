import type { RouteConfig, GameStateHook } from "@tc.types";
import { ROUTES } from "@/app/routes";
import { DevCliScreen, DevRuleSetScreen } from "./screens";

export const getDevRoutes = (game: GameStateHook): RouteConfig[] => [
  { path: ROUTES.dev.cli, element: <DevCliScreen game={game} /> },
  { path: ROUTES.dev.ruleset, element: <DevRuleSetScreen game={game} /> },
];
