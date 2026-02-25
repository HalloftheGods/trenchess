import { Suspense, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ROUTES, LazyRoutes } from "@/constants/routes.ts";
import { LoadingFallback } from "@/shared/components/molecules/LoadingFallback";
import { LoadingScreen } from "@/shared/components/atoms";

import { getPlayRoutes } from "./client/play/routes.tsx";
import { getLearnRoutes } from "./client/learn/routes.tsx";
import { getHomeRoutes } from "./client/home/routes.tsx";
import { getGameRoutes } from "./client/game/routes.tsx";
import { getDebugRoutes } from "./client/debug/routes.tsx";
import { getOtherRoutes } from "./client/other/routes.tsx";

import type { AppRoutesProps, RouteConfig } from "@/shared/types";

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
      onHowToPlayClick: () => navigate(ROUTES.LEARN_MANUAL),
      onLibraryClick: () => navigate(ROUTES.LIBRARY),
    }),
    [game, routeContextValue.isStarting, handleBackToMenu, navigate],
  );

  const menuRoutes = useMemo(
    () => [
      ...getHomeRoutes().filter((r) => r.index), // only index for home
      ...getPlayRoutes(),
      ...getLearnRoutes(navigate),
      ...getOtherRoutes(darkMode, handleBackToMenu, navigate).filter(
        (r) => r.path !== "tutorial",
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
      ...getDebugRoutes(),
      ...getOtherRoutes(darkMode, handleBackToMenu, navigate).filter(
        (r) => r.path === "tutorial" || r.path === "learn/manual",
      ),
      {
        path: ROUTES.LEARN_MANUAL,
        element: (
          <LazyRoutes.learn.manual
            onBack={handleBackToMenu}
            darkMode={darkMode}
            pieceStyle={pieceStyle}
          />
        ),
      },
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

  const renderRoute = (route: RouteConfig) => (
    <Route
      key={route.path || "index"}
      index={route.index}
      path={route.path}
      element={route.element}
    />
  );

  const showGlobalLoader =
    routeContextValue.isStarting || (game.isStarted && !game.bgioState);

  return (
    <>
      {showGlobalLoader && <LoadingScreen />}
      <Suspense fallback={<LoadingFallback fullScreen={true} />}>
        <Routes>
          <Route
            path={ROUTES.HOME}
            element={
              <LazyRoutes.shared.layout
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
                setSelectedBoard={(m) => m && setMode(m)}
                selectedPreset={selectedPreset}
                setSelectedPreset={(
                  p:
                    | "classic"
                    | "quick"
                    | "terrainiffic"
                    | "custom"
                    | "zen-garden"
                    | null,
                ) => setSelectedPreset(p)}
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
