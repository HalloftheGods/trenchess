import { lazy } from "react";
import type { NavigateFunction } from "react-router-dom";
import {
  TrenchGuideWrapper,
  ChessGuideWrapper,
} from "./components/RouteWrappers";
import type { RouteConfig } from "@/App.routes.tsx";

export const LEARN_PATHS = {
  LEARN: "/learn",
  LEARN_MANUAL: "/learn/manual",
  LEARN_ENDGAME: "/learn/endgame",
  LEARN_ENDGAME_WORLD: "/learn/endgame/capture-the-world",
  LEARN_ENDGAME_KING: "/learn/endgame/capture-the-king",
  LEARN_ENDGAME_ARMY: "/learn/endgame/capture-the-army",
  LEARN_TRENCH: "/learn/trench",
  LEARN_TRENCH_DETAIL: "/learn/trench/:terrain",
  LEARN_CHESS: "/learn/chess",
  LEARN_CHESSMEN: "/learn/chess/chessmen",
  LEARN_CHESSMEN_DETAIL: "/learn/chess/chessmen/:unitType",
  LEARN_CHESSMEN_MANUAL: "/learn/chess/chessmen",
  LEARN_MATH: "/learn/math",
} as const;

export const LearnLazyRoutes = {
  view: lazy(() => import("./index")),
  manual: lazy(() => import("./manual")),
  endgame: {
    main: lazy(() => import("./endgame/index")),
    world: lazy(() => import("./endgame/capture-the-world")),
    king: lazy(() => import("./endgame/capture-the-king")),
    army: lazy(() => import("./endgame/capture-the-army")),
  },
  trench: {
    main: lazy(() => import("./trench/index")),
    detail: lazy(() => import("./trench/detail")),
  },
  chess: {
    main: lazy(() => import("./chess/index")),
    chessmen: lazy(() => import("./chess/chessmen")),
    detail: lazy(() => import("./chess/detail")),
  },
  math: {
    main: lazy(() => import("./math/index")),
  },
};

export const getLearnRoutes = (navigate: NavigateFunction): RouteConfig[] => [
  { path: "learn", element: <LearnLazyRoutes.view /> },
  { path: "learn/endgame", element: <LearnLazyRoutes.endgame.main /> },
  {
    path: "learn/endgame/capture-the-world",
    element: (
      <LearnLazyRoutes.endgame.world
        onBack={() => navigate(LEARN_PATHS.LEARN_ENDGAME)}
      />
    ),
  },
  {
    path: "learn/endgame/capture-the-king",
    element: (
      <LearnLazyRoutes.endgame.king
        onBack={() => navigate(LEARN_PATHS.LEARN_ENDGAME)}
      />
    ),
  },
  {
    path: "learn/endgame/capture-the-army",
    element: (
      <LearnLazyRoutes.endgame.army
        onBack={() => navigate(LEARN_PATHS.LEARN_ENDGAME)}
      />
    ),
  },
  { path: "learn/trench", element: <LearnLazyRoutes.trench.main /> },
  {
    path: "learn/trench/:terrain",
    element: <TrenchGuideWrapper onBack={() => navigate(LEARN_PATHS.LEARN_TRENCH)} />,
  },
  { path: "learn/chess", element: <LearnLazyRoutes.chess.main /> },
  {
    path: "learn/chess/chessmen",
    element: <LearnLazyRoutes.chess.chessmen />,
  },
  {
    path: "learn/chess/chessmen/:unitType",
    element: (
      <ChessGuideWrapper onBack={() => navigate(LEARN_PATHS.LEARN_CHESSMEN_MANUAL)} />
    ),
  },
  { path: "learn/math", element: <LearnLazyRoutes.math.main /> },
];
