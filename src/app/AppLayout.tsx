import { Outlet } from "react-router-dom";
import { RouteProvider } from "@context";
import { ScrollToTop } from "@atoms/ScrollToTop";
import { AnalyticsTracker } from "@atoms/AnalyticsTracker";
import { useAppInitialization } from "@hooks/navigation/useAppInitialization";
import { useRouteContextValue } from "@hooks/navigation/useRouteContextValue";
import { GlobalDebugPortal } from "@organisms";
import { LoadingScreen } from "@shared";

const AppLayout = () => {
  const { game, seeds, previewSeedIndex, setPreviewSeedIndex } =
    useAppInitialization();

  const routeContextValue = useRouteContextValue({
    game,
    seeds,
    previewSeedIndex,
    setPreviewSeedIndex,
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
