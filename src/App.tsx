import { RouteProvider } from "@/shared/context";
import { ScrollToTop } from "@/shared/components/atoms/ScrollToTop";
import { AnalyticsTracker } from "@/shared/components/atoms/AnalyticsTracker";
import { useAppInitialization } from "@/shared/hooks/useAppInitialization";
import { useRouteContextValue } from "@/shared/hooks/useRouteContextValue";
import { GlobalDebugPortal } from "@/shared/components/organisms";
import { AppRoutes } from "./App.Routes";

const App = () => {
  const {
    game,
    seeds,
    previewSeedIndex,
    setPreviewSeedIndex,
    handleBackToMenu,
  } = useAppInitialization();

  const routeContextValue = useRouteContextValue({
    game,
    seeds,
    previewSeedIndex,
    setPreviewSeedIndex,
  });

  return (
    <RouteProvider value={routeContextValue}>
      <AnalyticsTracker />
      <ScrollToTop />
      <AppRoutes
        game={game}
        routeContextValue={routeContextValue}
        handleBackToMenu={handleBackToMenu}
      />
      <GlobalDebugPortal game={game} />
    </RouteProvider>
  );
};

export default App;
