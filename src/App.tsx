import { RouteProvider } from "@/route.context";
import { ScrollToTop } from "@/shared/components/atoms/ScrollToTop";
import { useAppInitialization } from "@/shared/hooks/useAppInitialization";
import { useRouteContextValue } from "@/shared/hooks/useRouteContextValue";
import { AppRoutes } from "./App.routes";

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
      <ScrollToTop />
      <AppRoutes
        game={game}
        routeContextValue={routeContextValue}
        handleBackToMenu={handleBackToMenu}
      />
    </RouteProvider>
  );
};

export default App;
