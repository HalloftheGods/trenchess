import { getPath } from "@/app/router/router";
import type { RouteConfig } from "@tc.types";

import { DevCliScreen, DevRuleSetScreen } from "./screens";

export const getDevRoutes = (): RouteConfig[] => [
  { path: getPath("dev.cli"), element: <DevCliScreen /> },
  { path: getPath("dev.ruleset"), element: <DevRuleSetScreen /> },
];
