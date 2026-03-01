import {
  TrenchGuideWrapper,
  ChessGuideWrapper,
} from "./components/RouteWrappers";
import type { RouteConfig } from "@tc.types";
import { ROUTES } from "@/app/router/router";
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

export const getLearnRoutes = (): RouteConfig[] => [
  { path: ROUTES.learn.index, element: <LearnIndexScreen /> },
  {
    path: ROUTES.learn.endgame.index,
    element: <LearnEndgameIndexScreen />,
  },

  {
    path: ROUTES.learn.endgame.captureTheWorld,
    element: <LearnEndgameWorldScreen />,
  },

  {
    path: ROUTES.learn.endgame.captureTheKing,
    element: <LearnEndgameKingScreen />,
  },

  {
    path: ROUTES.learn.endgame.captureTheArmy,
    element: <LearnEndgameArmyScreen />,
  },

  { path: ROUTES.learn.trench.index, element: <LearnTrenchIndexScreen /> },

  {
    path: ROUTES.learn.trench.detail,
    element: <TrenchGuideWrapper />,
  },

  { path: ROUTES.learn.chess.index, element: <LearnChessIndexScreen /> },

  {
    path: ROUTES.learn.chess.chessmen,
    element: <LearnChessmenIndexScreen />,
  },

  {
    path: ROUTES.learn.chess.chessmenDetail,
    element: <ChessGuideWrapper />,
  },

  { path: ROUTES.learn.math, element: <LearnMathIndexScreen /> },
];
