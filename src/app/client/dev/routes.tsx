import type { RouteConfig } from "@tc.types";
import { ROUTES } from "@/app/router/router";
import { DevCliScreen, DevRuleSetScreen } from "./screens";

export const getDevRoutes = (): RouteConfig[] => [
  { path: ROUTES.dev.cli, element: <DevCliScreen /> },
  { path: ROUTES.dev.ruleset, element: <DevRuleSetScreen /> },
];
