import { ROUTES } from "@constants/routes";
import type { RouteConfig } from "@/shared/types/route";

const DevCliLazy = ROUTES.DEV_CLI.component(() => import("@/client/dev/cli"));
const DevRuleSetLazy = ROUTES.DEV_RULESET.component(
  () => import("@/client/dev/ruleset"),
);

const DEV_ROUTES: RouteConfig[] = [
  ROUTES.DEV_CLI.define(<DevCliLazy />),
  ROUTES.DEV_RULESET.define(<DevRuleSetLazy />),
];

export default DEV_ROUTES;
