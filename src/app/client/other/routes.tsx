import type { NavigateFunction } from "react-router-dom";
import type { RouteConfig } from "@tc.types";
import { ROUTES } from "@/app/routes";
import {
  ScoreboardScreen,
  RulesScreen,
  StatsScreen,
  TutorialScreen,
} from "./screens";

export const getOtherRoutes = (
  darkMode: boolean,
  handleBackToMenu: () => void,
  navigate: NavigateFunction,
): RouteConfig[] => [
  {
    path: ROUTES.scoreboard,
    element: <ScoreboardScreen darkMode={darkMode} />,
  },

  {
    path: ROUTES.rules,
    element: <RulesScreen onBack={() => navigate(-1)} darkMode={darkMode} />,
  },

  { path: ROUTES.stats, element: <StatsScreen /> },

  { path: ROUTES.zen, element: <div /> },

  {
    path: ROUTES.tutorial,
    element: <TutorialScreen onBack={handleBackToMenu} darkMode={darkMode} />,
  },
];
