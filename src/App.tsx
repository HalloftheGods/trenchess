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
import type { GameMode, SeedItem } from "@engineTypes/game";

const TrenchGuideWrapper = (props: { onBack?: () => void }) => {
  const { terrain } = useParams();
  return (
    <RoutesConfig.LazyLearnTrenchDetailView
      {...props}
      initialTerrain={terrain as TerrainType}
      onBack={props.onBack || (() => {})}
    />
  );
};

const ChessGuideWrapper = (props: { onBack?: () => void }) => {
  const { unitType } = useParams();
  return (
    <RoutesConfig.LazyLearnChessDetailView
      {...props}
      initialUnit={unitType}
      onBack={props.onBack || (() => {})}
    />
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
  const {
    gameState,
    multiplayer,
    initFromSeed,
    initGameWithPreset,
    setGameState,
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
  } = game;

  const navigate = useNavigate();
  const location = useLocation();
  const match = matchPath(ROUTES.GAME_DETAIL, location.pathname);
  const routeRoomId = match?.params.roomId;

  useEffect(() => {
    // Exclude 'mmo' from auto-joining as it represents a special view mode
    if (
      routeRoomId &&
      routeRoomId !== "mmo" &&
      multiplayer.roomId !== routeRoomId
    ) {
      console.log("App: Room ID detected in URL, joining:", routeRoomId);
      multiplayer.joinGame(routeRoomId);
    }
  }, [routeRoomId, multiplayer]);

  useEffect(() => {
    const isGameRoute = location.pathname.startsWith(ROUTES.GAME);
    if (!isGameRoute) return;

    if (location.pathname === ROUTES.GAME_MMO) {
      if (gameState === "menu") {
        const urlParams = new URLSearchParams(window.location.search);
        const seed = urlParams.get("seed");
        if (seed) {
          initFromSeed(seed);
        } else {
          initGameWithPreset("2p-ns", null);
        }
      }
      return;
    }
    if (location.pathname === ROUTES.ZEN) {
      initGameWithPreset("2p-ns", "zen-garden");
      return;
    }
  }, [gameState, location.pathname, initFromSeed, initGameWithPreset]);

  useEffect(() => {
    if (
      location.pathname === ROUTES.GAME &&
      !location.pathname.startsWith(ROUTES.GAME_MMO) &&
      gameState === "menu"
    ) {
      navigate(ROUTES.HOME);
    }
  }, [location.pathname, gameState, navigate]);

  const handleBackToMenu = () => {
    setGameState("menu");
    navigate(ROUTES.HOME);
  };

  // State lifted for global RouteContext
  const [seeds, setSeeds] = useState<SeedItem[]>([]);
  const [previewSeedIndex, setPreviewSeedIndex] = useState(0);

  // Load seeds on mount
  useEffect(() => {
    const stored = localStorage.getItem("trenchess_seeds");
    let loadedSeeds: SeedItem[] = [];
    if (stored) {
      try {
        loadedSeeds = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeeds([...loadedSeeds.reverse(), ...DEFAULT_SEEDS]);
  }, []);

  const routeContextValue = useMemo(() => {
    const isOnline = !!multiplayer?.roomId;
    const playMode = isOnline
      ? "online"
      : location.pathname.includes("/play/local")
        ? "local"
        : "practice";

    return {
      darkMode,
      multiplayer,
      pieceStyle,
      toggleTheme,
      togglePieceStyle,
      onTutorial: () => {
        setGameState("tutorial");
        navigate(ROUTES.TUTORIAL);
      },
      onLogoClick: () => {
        setGameState("menu");
        navigate(ROUTES.HOME);
      },
      onZenGarden: () => navigate(ROUTES.ZEN),
      onStartGame: (
        startGameMode: GameMode,
        preset: string | null,
        playerTypesConfig: Record<string, "human" | "computer">,
        seed?: string,
      ) => {
        initGameWithPreset(
          startGameMode,
          preset,
          playerTypesConfig,
          seed || "",
        );
        const target = multiplayer?.roomId
          ? `${ROUTES.GAME}/${multiplayer.roomId}`
          : ROUTES.GAME_MMO;
        navigate(target);
      },
      onCtwGuide: () => navigate(ROUTES.LEARN_ENDGAME_CTW),
      onChessGuide: () => navigate(ROUTES.LEARN_CHESS),
      onTrenchGuide: (t?: string) =>
        navigate(t ? `${ROUTES.LEARN_TRENCH}/${t}` : ROUTES.LEARN_TRENCH),
      onOpenLibrary: () => navigate(ROUTES.LIBRARY),
      selectedBoard: mode,
      setSelectedBoard: (m: GameMode | null) => m && setMode(m),
      selectedPreset,
      setSelectedPreset: (
        p:
          | "classic"
          | "quick"
          | "terrainiffic"
          | "custom"
          | "zen-garden"
          | null,
      ) => setSelectedPreset(p),
      playerConfig: playerTypes,
      activePlayers,
      playMode,
      playerCount: activePlayers.length,
      previewConfig: { mode },
      seeds,
      previewSeedIndex,
      setPreviewSeedIndex,
    };
  }, [
    multiplayer,
    location.pathname,
    darkMode,
    pieceStyle,
    toggleTheme,
    togglePieceStyle,
    setGameState,
    navigate,
    initGameWithPreset,
    mode,
    setMode,
    selectedPreset,
    setSelectedPreset,
    playerTypes,
    activePlayers,
    seeds,
    previewSeedIndex,
  ]);

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
          darkMode={darkMode}
          pieceStyle={pieceStyle}
        />
      ),
    },
    {
      path: "rules",
      element: (
        <RoutesConfig.LazyRulesView
          onBack={() => navigate(-1)}
          darkMode={darkMode}
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
          darkMode={darkMode}
        />
      ),
    },
    {
      path: ROUTES.LEARN_MANUAL,
      element: (
        <RoutesConfig.LazyLearnManualView
          onBack={handleBackToMenu}
          darkMode={darkMode}
          pieceStyle={pieceStyle}
        />
      ),
    },
    {
      path: ROUTES.LIBRARY,
      element: (
        <RoutesConfig.LazySeedLibrary
          onBack={handleBackToMenu}
          onLoadSeed={(seed) => initFromSeed(seed)}
          onEditInZen={(seed) => initFromSeed(seed, "zen-garden")}
          activeMode={mode}
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
                setSelectedBoard={routeContextValue.setSelectedBoard}
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
