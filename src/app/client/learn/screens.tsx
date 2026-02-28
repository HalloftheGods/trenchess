import { lazy } from "react";

export const LearnIndexScreen = lazy(() => import("./index"));
export const LearnEndgameIndexScreen = lazy(() => import("./endgame/index"));
export const LearnEndgameWorldScreen = lazy(
  () => import("./endgame/capture-the-world"),
);
export const LearnEndgameKingScreen = lazy(
  () => import("./endgame/capture-the-king"),
);
export const LearnEndgameArmyScreen = lazy(
  () => import("./endgame/capture-the-army"),
);
export const LearnTrenchIndexScreen = lazy(() => import("./trench/index"));
export const LearnChessIndexScreen = lazy(() => import("./chess/index"));
export const LearnChessmenIndexScreen = lazy(() => import("./chess/chessmen"));
export const LearnMathIndexScreen = lazy(() => import("./math/index"));
