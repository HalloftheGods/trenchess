import { RouteProvider, TerminalProvider, GameProvider } from "@context";
import { ScrollToTop } from "@atoms/ScrollToTop";
import { AnalyticsTracker } from "@atoms/AnalyticsTracker";
import { useAppInitialization } from "@hooks/navigation/useAppInitialization";
import { useRouteContextValue } from "@hooks/navigation/useRouteContextValue";
import { GlobalDebugPortal } from "@organisms";
import { AppRoutes } from "@/app/App.Routes";

const AppContent = () => {
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

const App = () => {
  return (
    <TerminalProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </TerminalProvider>
  );
};

export default App;
