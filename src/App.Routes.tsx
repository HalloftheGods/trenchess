import { Suspense, useMemo, lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import type { RouteProps } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { LoadingFallback } from "@/shared/components/molecules/LoadingFallback";
import { LoadingScreen } from "./shared/components";

import {
  playRoutes,
  debugRoutes,
  devRoutes,
  getLearnRoutes,
  getHomeRoutes,
  getGameRoutes,
  getOtherRoutes,
} from "./client/routes";

import type { AppRoutesProps, RouteConfig, GameMode } from "@/shared/types";

const LazyRouteLayout = lazy(() => import("@/shared/components/templates/RouteLayout"));
const LearnManualLazy = ROUTES.LEARN_MANUAL.component(() => import("@/client/learn/manual"));

export const AppRoutes = ({
  game,
  routeContextValue,
  handleBackToMenu,
}: AppRoutesProps) => {
  const navigate = useNavigate();

  const {
    multiplayer,
    mode,
    setMode,
    selectedPreset,
    setSelectedPreset,
    playerTypes,
    activePlayers,
    darkMode,
    pieceStyle,
    toggleTheme,
    togglePieceStyle,
    initFromSeed,
  } = game;

  const gameScreenProps = useMemo(
    () => ({
      game,
      isStarting: routeContextValue.isStarting,
      onMenuClick: handleBackToMenu,
      onHowToPlayClick: () => navigate(ROUTES.LEARN_MANUAL.url),
      onLibraryClick: () => navigate(ROUTES.LIBRARY.url),
    }),
    [game, routeContextValue.isStarting, handleBackToMenu, navigate],
  );

  const menuRoutes = useMemo(
    () => [
      ...getHomeRoutes().filter((r) => r.index), // only index for home
      ...playRoutes,
      ...getLearnRoutes(navigate),
      ...getOtherRoutes(darkMode, handleBackToMenu, navigate).filter(
        (r) => r.path !== ROUTES.TUTORIAL.path,
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
      ...devRoutes,
      ...getOtherRoutes(darkMode, handleBackToMenu, navigate).filter(
        (r) =>
          r.path === ROUTES.TUTORIAL.path ||
          r.path === ROUTES.LEARN_MANUAL.path,
      ),
      ROUTES.LEARN_MANUAL.define(
        <LearnManualLazy onBack={handleBackToMenu} darkMode={darkMode} pieceStyle={pieceStyle} />
      ),
      ...getHomeRoutes().filter((r) => r.path === "*"),
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
          <Route
            path={ROUTES.HOME.path}
            element={
              <LazyRouteLayout
                darkMode={darkMode}
                pieceStyle={pieceStyle}
                toggleTheme={toggleTheme}
                togglePieceStyle={togglePieceStyle}
                onTutorial={routeContextValue.onTutorial}
                onLogoClick={routeContextValue.onLogoClick}
                onZenGarden={routeContextValue.onZenGarden}
                multiplayer={multiplayer}
                onStartGame={routeContextValue.onStartGame}
                onCtwGuide={routeContextValue.onCtwGuide}
                onChessGuide={routeContextValue.onChessGuide}
                onTrenchGuide={routeContextValue.onTrenchGuide}
                onOpenLibrary={routeContextValue.onOpenLibrary}
                selectedBoard={mode}
                setSelectedBoard={(m: GameMode | null) => m && setMode(m)}
                selectedPreset={selectedPreset}
                setSelectedPreset={(p: string | null) => setSelectedPreset(p)}
                playerTypes={playerTypes}
                activePlayers={activePlayers}
              />
            }
          >
            {menuRoutes.map(renderRoute)}
          </Route>

          {topLevelRoutes.map(renderRoute)}
        </Routes>
      </Suspense>
    </>
  );
};
