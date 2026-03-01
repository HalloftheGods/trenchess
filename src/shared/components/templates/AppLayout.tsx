import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { RouteProvider } from "@context";
import { ScrollToTop } from "@atoms/ScrollToTop";
import { AnalyticsTracker } from "@atoms/AnalyticsTracker";
import { useRouteContextValue } from "@hooks/navigation/useRouteContextValue";
import { useGameState } from "@hooks/engine/useGameState";
import { GlobalDebugPortal } from "@organisms";
import { LoadingScreen } from "@shared";
import { ROUTES } from "@/app/router/router";
import { PHASES } from "@constants/game";
import { DEFAULT_SEEDS } from "@/app/core/setup/seeds";
import type { SeedItem } from "@tc.types";

const AppLayout = () => {
  const game = useGameState();
  const navigate = useNavigate();

  const [seeds] = useState<SeedItem[]>(() => {
    const stored = localStorage.getItem("trenchess_seeds");
    let loadedSeeds: SeedItem[] = [];
    if (stored) {
      try {
        loadedSeeds = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse seeds from localStorage", e);
      }
    }
    return [...loadedSeeds.reverse(), ...DEFAULT_SEEDS];
  });

  const [previewSeedIndex, setPreviewSeedIndex] = useState(0);

  const handleBackToMenu = () => {
    game.setPhase(PHASES.GAMEMASTER);
    navigate(ROUTES.home);
  };

  const routeContextValue = useRouteContextValue({
    game,
    seeds,
    previewSeedIndex,
    setPreviewSeedIndex,
    handleBackToMenu,
  });

  const showGlobalLoader =
    routeContextValue.isStarting || (game.isStarted && !game.bgioState);

  return (
    <RouteProvider value={routeContextValue}>
      <AnalyticsTracker />
      <ScrollToTop />
      {showGlobalLoader && <LoadingScreen />}
      <Outlet />
      <GlobalDebugPortal game={game} />
    </RouteProvider>
  );
};

export default AppLayout;
