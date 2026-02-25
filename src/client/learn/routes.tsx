import type { NavigateFunction } from "react-router-dom";
import {
  TrenchGuideWrapper,
  ChessGuideWrapper,
} from "./components/RouteWrappers";
import type { RouteConfig } from "@/shared/types/route";
import { ROUTES } from "@constants/routes";

const LearnIndexLazy = ROUTES.LEARN.component(() => import("./index"));
const LearnEndgameIndexLazy = ROUTES.LEARN_ENDGAME.component(() => import("./endgame/index"));
const LearnEndgameWorldLazy = ROUTES.LEARN_ENDGAME_WORLD.component(() => import("./endgame/capture-the-world"));
const LearnEndgameKingLazy = ROUTES.LEARN_ENDGAME_KING.component(() => import("./endgame/capture-the-king"));
const LearnEndgameArmyLazy = ROUTES.LEARN_ENDGAME_ARMY.component(() => import("./endgame/capture-the-army"));
const LearnTrenchIndexLazy = ROUTES.LEARN_TRENCH.component(() => import("./trench/index"));
const LearnChessIndexLazy = ROUTES.LEARN_CHESS.component(() => import("./chess/index"));
const LearnChessmenIndexLazy = ROUTES.LEARN_CHESSMEN.component(() => import("./chess/chessmen"));
const LearnMathIndexLazy = ROUTES.LEARN_MATH.component(() => import("./math/index"));

export const getLearnRoutes = (navigate: NavigateFunction): RouteConfig[] => [
  ROUTES.LEARN.define(<LearnIndexLazy />),
  ROUTES.LEARN_ENDGAME.define(<LearnEndgameIndexLazy />),
  
  ROUTES.LEARN_ENDGAME_WORLD.define(
    <LearnEndgameWorldLazy onBack={() => navigate(ROUTES.LEARN_ENDGAME.url)} />
  ),
  
  ROUTES.LEARN_ENDGAME_KING.define(
    <LearnEndgameKingLazy onBack={() => navigate(ROUTES.LEARN_ENDGAME.url)} />
  ),
  
  ROUTES.LEARN_ENDGAME_ARMY.define(
    <LearnEndgameArmyLazy onBack={() => navigate(ROUTES.LEARN_ENDGAME.url)} />
  ),
  
  ROUTES.LEARN_TRENCH.define(<LearnTrenchIndexLazy />),
  
  ROUTES.LEARN_TRENCH_DETAIL.define(
    <TrenchGuideWrapper onBack={() => navigate(ROUTES.LEARN_TRENCH.url)} />
  ),
  
  ROUTES.LEARN_CHESS.define(<LearnChessIndexLazy />),
  
  ROUTES.LEARN_CHESSMEN.define(<LearnChessmenIndexLazy />),
  
  ROUTES.LEARN_CHESSMEN_DETAIL.define(
    <ChessGuideWrapper onBack={() => navigate(ROUTES.LEARN_CHESSMEN.url)} />
  ),
  
  ROUTES.LEARN_MATH.define(<LearnMathIndexLazy />),
];
