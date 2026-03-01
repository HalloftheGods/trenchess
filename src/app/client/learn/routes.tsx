import { getPath } from "@/app/router/router";
import {
  TrenchGuideWrapper,
  ChessGuideWrapper,
} from "./components/RouteWrappers";
import type { RouteConfig } from "@tc.types";

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
  { path: getPath("learn.index"), element: <LearnIndexScreen /> },
  {
    path: getPath("learn.endgame.index"),
    element: <LearnEndgameIndexScreen />,
  },

  {
    path: getPath("learn.endgame.captureTheWorld"),
    element: <LearnEndgameWorldScreen />,
  },

  {
    path: getPath("learn.endgame.captureTheKing"),
    element: <LearnEndgameKingScreen />,
  },

  {
    path: getPath("learn.endgame.captureTheArmy"),
    element: <LearnEndgameArmyScreen />,
  },

  { path: getPath("learn.trench.index"), element: <LearnTrenchIndexScreen /> },

  {
    path: getPath("learn.trench.detail"),
    element: <TrenchGuideWrapper />,
  },

  { path: getPath("learn.chess.index"), element: <LearnChessIndexScreen /> },

  {
    path: getPath("learn.chess.chessmen"),
    element: <LearnChessmenIndexScreen />,
  },

  {
    path: getPath("learn.chess.chessmenDetail"),
    element: <ChessGuideWrapper />,
  },

  { path: getPath("learn.math"), element: <LearnMathIndexScreen /> },
];
