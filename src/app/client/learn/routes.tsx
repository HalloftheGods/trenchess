import type { NavigateFunction } from "react-router-dom";
import {
  TrenchGuideWrapper,
  ChessGuideWrapper,
} from "./components/RouteWrappers";
import type { RouteConfig } from "@tc.types";
import { ROUTES } from "@/app/routes";
import {
  LearnIndexScreen,
  LearnEndgameIndexScreen,
  LearnEndgameWorldScreen,
  LearnEndgameKingScreen,
  LearnEndgameArmyScreen,
  LearnTrenchIndexScreen,
  LearnChessIndexScreen,
  LearnChessmenIndexScreen,
  LearnMathIndexScreen,
} from "./screens";

export const getLearnRoutes = (navigate: NavigateFunction): RouteConfig[] => [
  { path: ROUTES.learn.index, element: <LearnIndexScreen /> },
  {
    path: ROUTES.learn.endgame.index,
    element: <LearnEndgameIndexScreen />,
  },

  {
    path: ROUTES.learn.endgame.captureTheWorld,
    element: (
      <LearnEndgameWorldScreen
        onBack={() => navigate(ROUTES.learn.endgame.index)}
      />
    ),
  },

  {
    path: ROUTES.learn.endgame.captureTheKing,
    element: (
      <LearnEndgameKingScreen
        onBack={() => navigate(ROUTES.learn.endgame.index)}
      />
    ),
  },

  {
    path: ROUTES.learn.endgame.captureTheArmy,
    element: (
      <LearnEndgameArmyScreen
        onBack={() => navigate(ROUTES.learn.endgame.index)}
      />
    ),
  },

  { path: ROUTES.learn.trench.index, element: <LearnTrenchIndexScreen /> },

  {
    path: ROUTES.learn.trench.detail,
    element: (
      <TrenchGuideWrapper onBack={() => navigate(ROUTES.learn.trench.index)} />
    ),
  },

  { path: ROUTES.learn.chess.index, element: <LearnChessIndexScreen /> },

  {
    path: ROUTES.learn.chess.chessmen,
    element: <LearnChessmenIndexScreen />,
  },

  {
    path: ROUTES.learn.chess.chessmenDetail,
    element: (
      <ChessGuideWrapper onBack={() => navigate(ROUTES.learn.chess.chessmen)} />
    ),
  },

  { path: ROUTES.learn.math, element: <LearnMathIndexScreen /> },
];
