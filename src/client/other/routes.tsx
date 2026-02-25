import type { NavigateFunction } from "react-router-dom";
import type { RouteConfig } from "@/shared/types/route";
import { ROUTES } from "@constants/routes";

const ScoreboardLazy = ROUTES.SCOREBOARD.component(() => import("@/client/scoreboard"));
const RulesLazy = ROUTES.RULES.component(() => import("@/client/rules"));
const StatsLazy = ROUTES.STATS.component(() => import("@/client/stats"));
const TutorialLazy = ROUTES.TUTORIAL.component(() => import("@/client/tutorial"));

export const getOtherRoutes = (
  darkMode: boolean,
  handleBackToMenu: () => void,
  navigate: NavigateFunction,
): RouteConfig[] => [
  ROUTES.SCOREBOARD.define(<ScoreboardLazy darkMode={darkMode} />),
  
  ROUTES.RULES.define(
    <RulesLazy onBack={() => navigate(-1)} darkMode={darkMode} />
  ),
  
  ROUTES.STATS.define(<StatsLazy />),
  
  ROUTES.ZEN.define(<div />),
  
  ROUTES.TUTORIAL.define(
    <TutorialLazy onBack={handleBackToMenu} darkMode={darkMode} />
  ),
];
