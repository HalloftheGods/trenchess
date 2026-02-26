import { ROUTES } from "@constants/routes";
import type { RouteConfig, GameStateHook } from "@/shared/types";

const DevCliLazy = ROUTES.DEV_CLI.component(() => import("@/client/dev/cli"));
const DevRuleSetLazy = ROUTES.DEV_RULESET.component(
  () => import("@/client/dev/ruleset"),
);

export const getDevRoutes = (game: GameStateHook): RouteConfig[] => [
  ROUTES.DEV_CLI.define(<DevCliLazy game={game} />),
  ROUTES.DEV_RULESET.define(<DevRuleSetLazy game={game} />),
];

export default getDevRoutes;
