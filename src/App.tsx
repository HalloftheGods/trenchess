import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  matchPath,
} from "react-router-dom";
import { useGameState } from "@hooks/useGameState";
import * as RoutesConfig from "@/app/routes/lazy.routes";
import { ROUTES } from "@/app/routes/lazy.routes";
import type { TerrainType } from "@engineTypes/game";
import { LoadingFallback } from "@/shared/components/molecules/LoadingFallback";
import { RouteProvider } from "@/app/context/RouteContext";
import { DEFAULT_SEEDS } from "@engineConfigs/defaultSeeds";

const TrenchGuideWrapper = (props: any) => {
  const { terrain } = useParams();
  return (
    <RoutesConfig.LazyLearnTrenchDetailView
      {...props}
      initialTerrain={terrain as TerrainType}
    />
  );
};

const ChessGuideWrapper = (props: any) => {
  const { unitType } = useParams();
  return (
    <RoutesConfig.LazyLearnChessDetailView {...props} initialUnit={unitType} />
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const DebugErrorThrower = () => {
  throw new Error("Intentional 500 error triggered for debugging purposes.");
  return null;
};

const App = () => {
  const game = useGameState();
  const navigate = useNavigate();
  const location = useLocation();
  const match = matchPath(ROUTES.GAME_DETAIL, location.pathname);
  const routeRoomId = match?.params.roomId;

  useEffect(() => {
    if (routeRoomId && game.multiplayer.roomId !== routeRoomId) {
      console.log("App: Room ID detected in URL, joining:", routeRoomId);
      game.multiplayer.joinGame(routeRoomId);
    }
  }, [routeRoomId, game.multiplayer.roomId, game.multiplayer.joinGame]);

  useEffect(() => {
    const isGameRoute = location.pathname.startsWith(ROUTES.GAME);
    if (!isGameRoute) return;

    if (location.pathname === ROUTES.GAME_MMO) {
      if (game.gameState === "menu") {
        const urlParams = new URLSearchParams(window.location.search);
        const seed = urlParams.get("seed");
        if (seed) {
          game.initFromSeed(seed);
        } else {
          game.initGameWithPreset("2p-ns", "2p-ns");
        }
      }
      return;
    }
    if (location.pathname === ROUTES.ZEN) {
      game.initGameWithPreset("2p-ns", "zen-garden");
      return;
    }
  }, [game.gameState, location.pathname]);

  useEffect(() => {
    if (
      location.pathname === ROUTES.GAME &&
      !location.pathname.startsWith(ROUTES.GAME_MMO) &&
      game.gameState === "menu"
    ) {
      navigate(ROUTES.HOME);
    }
  }, [location.pathname, game.gameState, navigate]);

  const handleBackToMenu = () => {
    game.setGameState("menu");
    navigate(ROUTES.HOME);
  };

  // State lifted for global RouteContext
  const [seeds, setSeeds] = useState<any[]>([]);
  const [previewSeedIndex, setPreviewSeedIndex] = useState(0);

  // Load seeds on mount
  useEffect(() => {
    const stored = localStorage.getItem("trenchess_seeds");
    let loadedSeeds: any[] = [];
    if (stored) {
      try {
        loadedSeeds = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    setSeeds([...loadedSeeds.reverse(), ...DEFAULT_SEEDS]);
  }, []);

  const routeContextValue = useMemo(() => {
    const isOnline = !!game.multiplayer?.roomId;
    const playMode = isOnline
      ? "online"
      : location.pathname.includes("/play/local")
        ? "local"
        : "practice";

    return {
      darkMode: game.darkMode,
      multiplayer: game.multiplayer,
      pieceStyle: game.pieceStyle,
      toggleTheme: game.toggleTheme,
      togglePieceStyle: game.togglePieceStyle,
      onTutorial: () => {
        game.setGameState("tutorial");
        navigate(ROUTES.TUTORIAL);
      },
      onLogoClick: () => {
        game.setGameState("menu");
        navigate(ROUTES.HOME);
      },
      onZenGarden: () => navigate(ROUTES.ZEN),
      onStartGame: (mode: any, preset: any, playerTypes: any, seed: any) => {
        game.initGameWithPreset(mode, preset, playerTypes, seed);
        const target = game.multiplayer?.roomId
          ? `${ROUTES.GAME}/${game.multiplayer.roomId}`
          : ROUTES.GAME_MMO;
        navigate(target);
      },
      onCtwGuide: () => navigate(ROUTES.LEARN_ENDGAME_CTW),
      onChessGuide: () => navigate(ROUTES.LEARN_CHESS),
      onTrenchGuide: (t?: string) =>
        navigate(t ? `${ROUTES.LEARN_TRENCH}/${t}` : ROUTES.LEARN_TRENCH),
      onOpenLibrary: () => navigate(ROUTES.LIBRARY),
      selectedBoard: game.mode,
      setSelectedBoard: (m: any) => m && game.setMode(m),
      selectedPreset: game.selectedPreset,
      setSelectedPreset: game.setSelectedPreset,
      playerConfig: game.playerTypes,
      activePlayers: game.activePlayers,
      playMode,
      playerCount: game.activePlayers.length,
      previewConfig: { mode: game.mode },
      seeds,
      previewSeedIndex,
      setPreviewSeedIndex,
    };
  }, [game, location.pathname, navigate, seeds, previewSeedIndex]);

  // Shared game screen props
  const gameScreenProps = {
    game,
    onMenuClick: handleBackToMenu,
    onHowToPlayClick: () => navigate(ROUTES.LEARN_MANUAL),
    onLibraryClick: () => navigate(ROUTES.LIBRARY),
  };

  // Menu sub-routes (rendered inside RouteLayout)
  const menuSubRoutes: {
    path?: string;
    index?: true;
    element: React.ReactNode;
  }[] = [
    { index: true, element: <RoutesConfig.LazyHomeView /> },
    { path: "play", element: <RoutesConfig.LazyPlayView /> },
    { path: "play/local", element: <RoutesConfig.LazyPlayLocalView /> },
    { path: "play/lobby", element: <RoutesConfig.LazyPlayLobbyView /> },
    { path: "play/setup", element: <RoutesConfig.LazyPlaySetupView /> },
    { path: "learn", element: <RoutesConfig.LazyLearnView /> },
    {
      path: "learn/endgame",
      element: <RoutesConfig.LazyLearnEndgameMainView />,
    },
    {
      path: "learn/endgame/capture-the-world",
      element: (
        <RoutesConfig.LazyLearnEndgameCtwView
          onBack={() => navigate(ROUTES.LEARN_ENDGAME)}
        />
      ),
    },
    {
      path: "learn/endgame/capture-the-king",
      element: (
        <RoutesConfig.LazyLearnEndgameCtkView
          onBack={() => navigate(ROUTES.LEARN_ENDGAME)}
        />
      ),
    },
    {
      path: "learn/endgame/capture-the-army",
      element: (
        <RoutesConfig.LazyLearnEndgameCtaView
          onBack={() => navigate(ROUTES.LEARN_ENDGAME)}
        />
      ),
    },
    { path: "learn/trench", element: <RoutesConfig.LazyLearnTrenchMainView /> },
    {
      path: "learn/trench/:terrain",
      element: (
        <TrenchGuideWrapper onBack={() => navigate(ROUTES.LEARN_TRENCH)} />
      ),
    },
    { path: "learn/chess", element: <RoutesConfig.LazyLearnChessMainView /> },
    {
      path: "learn/chess/:unitType",
      element: (
        <ChessGuideWrapper onBack={() => navigate(ROUTES.LEARN_CHESS)} />
      ),
    },
    { path: "learn/math", element: <RoutesConfig.LazyLearnMathMainView /> },
    {
      path: "scoreboard",
      element: (
        <RoutesConfig.LazyScoreboardView
          darkMode={game.darkMode}
          pieceStyle={game.pieceStyle}
        />
      ),
    },
    {
      path: "rules",
      element: (
        <RoutesConfig.LazyRulesView
          onBack={() => navigate(-1)}
          darkMode={game.darkMode}
        />
      ),
    },
    { path: "stats", element: <RoutesConfig.LazyStatsView /> },
    { path: "zen", element: <div /> }, // Effect in App handles the loading state / transition
  ];

  // Top-level routes outside the menu layout
  const topLevelRoutes: { path: string; element: React.ReactNode }[] = [
    {
      path: ROUTES.GAME_MMO,
      element: <RoutesConfig.LazyMmoView game={game} />,
    },
    {
      path: ROUTES.GAME,
      element: <RoutesConfig.LazyGameScreen {...gameScreenProps} />,
    },
    {
      path: ROUTES.GAME_DETAIL,
      element: <RoutesConfig.LazyGameScreen {...gameScreenProps} />,
    },
    {
      path: ROUTES.TUTORIAL,
      element: (
        <RoutesConfig.LazyTutorialView
          onBack={handleBackToMenu}
          darkMode={game.darkMode}
        />
      ),
    },
    {
      path: ROUTES.LEARN_MANUAL,
      element: (
        <RoutesConfig.LazyLearnManualView
          onBack={handleBackToMenu}
          darkMode={game.darkMode}
          pieceStyle={game.pieceStyle}
        />
      ),
    },
    {
      path: ROUTES.LIBRARY,
      element: (
        <RoutesConfig.LazySeedLibrary
          onBack={handleBackToMenu}
          onLoadSeed={(seed) => game.initFromSeed(seed)}
          onEditInZen={(seed) => game.initFromSeed(seed, "zen-garden")}
          activeMode={game.mode}
        />
      ),
    },
    { path: ROUTES.DEBUG_LOADING, element: <LoadingFallback /> },
    { path: ROUTES.DEBUG_404, element: <RoutesConfig.LazyNotFoundView /> },
    { path: ROUTES.DEBUG_500, element: <DebugErrorThrower /> },
    { path: "*", element: <RoutesConfig.LazyNotFoundView /> },
  ];

  return (
    <RouteProvider value={routeContextValue}>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback fullScreen={true} />}>
        <Routes>
          {/* Menu layout with nested sub-routes */}
          <Route
            path={ROUTES.HOME}
            element={
              <RoutesConfig.LazyRouteLayout
                darkMode={game.darkMode}
                pieceStyle={game.pieceStyle}
                toggleTheme={game.toggleTheme}
                togglePieceStyle={game.togglePieceStyle}
                onTutorial={routeContextValue.onTutorial}
                onLogoClick={routeContextValue.onLogoClick}
                onZenGarden={routeContextValue.onZenGarden}
                multiplayer={game.multiplayer}
                onStartGame={routeContextValue.onStartGame}
                onCtwGuide={routeContextValue.onCtwGuide}
                onChessGuide={routeContextValue.onChessGuide}
                onTrenchGuide={routeContextValue.onTrenchGuide}
                onOpenLibrary={routeContextValue.onOpenLibrary}
                selectedBoard={game.mode}
                setSelectedBoard={routeContextValue.setSelectedBoard}
                selectedPreset={game.selectedPreset}
                setSelectedPreset={game.setSelectedPreset}
                playerTypes={game.playerTypes}
                activePlayers={game.activePlayers}
              />
            }
          >
            {menuSubRoutes.map((route) =>
              route.index ? (
                <Route key="index" index element={route.element} />
              ) : (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ),
            )}
          </Route>

          {/* Top-level routes */}
          {topLevelRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </Suspense>
    </RouteProvider>
  );
};

export default App;
