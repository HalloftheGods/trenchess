import type { RouteProps } from "react-router-dom";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Suspense, useMemo, lazy } from "react";
import { ROUTES } from "@/app/routes";
import { LoadingScreen, LoadingFallback } from "@shared";

import {
  playRoutes,
  debugRoutes,
  getDevRoutes,
  getLearnRoutes,
  getHomeRoutes,
  getGameRoutes,
  getOtherRoutes,
} from "@client/routes";

import type { AppRoutesProps, RouteConfig } from "@tc.types";

const LazyRouteLayout = lazy(
  () => import("@/shared/components/templates/RouteLayout"),
);
const LearnManualScreen = lazy(() => import("@client/learn/manual"));

export const AppRoutes = ({
  game,
  routeContextValue,
  handleBackToMenu,
}: AppRoutesProps) => {
  const navigate = useNavigate();

  const { mode, darkMode, pieceStyle, initFromSeed } = game;

  const gameScreenProps = useMemo(
    () => ({
      game,
      isStarting: routeContextValue.isStarting,
      onMenuClick: handleBackToMenu,
      onHowToPlayClick: () => navigate(ROUTES.learn.manual),
      onLibraryClick: () => navigate(ROUTES.library),
    }),
    [game, routeContextValue.isStarting, handleBackToMenu, navigate],
  );

  const menuRoutes = useMemo(
    () => [
      ...getHomeRoutes().filter((r: RouteConfig) => r.index), // only index for home
      ...playRoutes,
      ...getLearnRoutes(navigate),
      ...getOtherRoutes(darkMode, handleBackToMenu, navigate).filter(
        (r: RouteConfig) => r.path !== ROUTES.tutorial,
      ), // Tutorial is top-level
    ],
    [darkMode, handleBackToMenu, navigate],
  );

  const topLevelRoutes = useMemo(
    () => [
      ...getGameRoutes(
        game,
        gameScreenProps,
        handleBackToMenu,
        mode,
        initFromSeed,
      ),
      ...debugRoutes,
      ...getDevRoutes(game),
      ...getOtherRoutes(darkMode, handleBackToMenu, navigate).filter(
        (r: RouteConfig) =>
          r.path === ROUTES.tutorial || r.path === ROUTES.learn.manual,
      ),
      {
        path: ROUTES.learn.manual,
        element: (
          <LearnManualScreen
            onBack={handleBackToMenu}
            darkMode={darkMode}
            pieceStyle={pieceStyle}
          />
        ),
      },
      ...getHomeRoutes().filter((r: RouteConfig) => r.path === "*"),
    ],
    [
      game,
      gameScreenProps,
      handleBackToMenu,
      mode,
      initFromSeed,
      darkMode,
      navigate,
      pieceStyle,
    ],
  );

  const renderRoute = (route: RouteConfig) => {
    if (route.index) {
      return <Route key="index" index element={route.element} />;
    }
    const routeProps: RouteProps = {
      element: route.element,
    };

    return (
      <Route key={route.path || "wrapper"} path={route.path} {...routeProps}>
        {route.children?.map(renderRoute)}
      </Route>
    );
  };

  const showGlobalLoader =
    routeContextValue.isStarting || (game.isStarted && !game.bgioState);

  return (
    <>
      {showGlobalLoader && <LoadingScreen />}
      <Suspense fallback={<LoadingFallback fullScreen={true} />}>
        <Routes>
          <Route path={ROUTES.home} element={<LazyRouteLayout />}>
            {menuRoutes.map(renderRoute)}
          </Route>

          {topLevelRoutes.map(renderRoute)}
        </Routes>
      </Suspense>
    </>
  );
};
