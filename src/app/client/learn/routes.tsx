import type { NavigateFunction } from "react-router-dom";
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
import LEARN_ROUTES from "./constants";

export const getLearnRoutes = (navigate: NavigateFunction): RouteConfig[] => [
  { path: LEARN_ROUTES.index, element: <LearnIndexScreen /> },
  {
    path: LEARN_ROUTES.endgame.index,
    element: <LearnEndgameIndexScreen />,
  },

  {
    path: LEARN_ROUTES.endgame.captureTheWorld,
    element: (
      <LearnEndgameWorldScreen
        onBack={() => navigate(LEARN_ROUTES.endgame.index)}
      />
    ),
  },

  {
    path: LEARN_ROUTES.endgame.captureTheKing,
    element: (
      <LearnEndgameKingScreen
        onBack={() => navigate(LEARN_ROUTES.endgame.index)}
      />
    ),
  },

  {
    path: LEARN_ROUTES.endgame.captureTheArmy,
    element: (
      <LearnEndgameArmyScreen
        onBack={() => navigate(LEARN_ROUTES.endgame.index)}
      />
    ),
  },

  { path: LEARN_ROUTES.trench.index, element: <LearnTrenchIndexScreen /> },

  {
    path: LEARN_ROUTES.trench.detail,
    element: (
      <TrenchGuideWrapper onBack={() => navigate(LEARN_ROUTES.trench.index)} />
    ),
  },

  { path: LEARN_ROUTES.chess.index, element: <LearnChessIndexScreen /> },

  {
    path: LEARN_ROUTES.chess.chessmen,
    element: <LearnChessmenIndexScreen />,
  },

  {
    path: LEARN_ROUTES.chess.chessmenDetail,
    element: (
      <ChessGuideWrapper onBack={() => navigate(LEARN_ROUTES.chess.chessmen)} />
    ),
  },

  { path: LEARN_ROUTES.math, element: <LearnMathIndexScreen /> },
];
