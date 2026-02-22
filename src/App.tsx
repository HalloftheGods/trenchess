import { Suspense, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useGameState } from "@hooks/useGameState";
import * as RoutesConfig from "@/app/routes/routes";
import { ROUTES } from "@/app/routes/routes";
import type { TerrainType } from "@engineTypes/game";
import { LoadingFallback } from "@/shared/components/molecules/LoadingFallback";

const TrenchGuideWrapper = (props: any) => {
  const { terrain } = useParams();
  return (
    <RoutesConfig.LazyTrenchGuide
      {...props}
      initialTerrain={terrain as TerrainType}
    />
  );
};

const ChessGuideWrapper = (props: any) => {
  const { unitType } = useParams();
  return <RoutesConfig.LazyChessGuide {...props} initialUnit={unitType} />;
};

const App = () => {
  const game = useGameState();
  const navigate = useNavigate();
  const location = useLocation();

  const { roomId: routeRoomId } = useParams();

  useEffect(() => {
    if (routeRoomId && game.multiplayer.roomId !== routeRoomId) {
      console.log("App: Room ID detected in URL, joining:", routeRoomId);
      game.multiplayer.joinGame(routeRoomId);
    }
  }, [routeRoomId, game.multiplayer.roomId, game.multiplayer.joinGame]);

  useEffect(() => {
    if (location.pathname === ROUTES.ZEN) {
      game.initGameWithPreset("2p-ns", "zen-garden");
      return;
    }
    const isGameRoute = location.pathname.startsWith(ROUTES.GAME);
    const isGameActive =
      game.gameState === "play" ||
      game.gameState === "setup" ||
      game.gameState === "zen-garden";
    if (isGameActive && !isGameRoute) {
      const target = game.multiplayer.roomId
        ? `${ROUTES.GAME}/${game.multiplayer.roomId}`
        : ROUTES.GAME;
      navigate(target);
    }
  }, [game.gameState, navigate, location.pathname, game.multiplayer.roomId]);

  useEffect(() => {
    if (location.pathname === ROUTES.GAME && game.gameState === "menu") {
      navigate(ROUTES.HOME);
    }
  }, [location.pathname, game.gameState, navigate]);

  const handleBackToMenu = () => {
    game.setGameState("menu");
    navigate(ROUTES.HOME);
  };

  // Shared game screen props
  const gameScreenProps = {
    game,
    onMenuClick: handleBackToMenu,
    onHowToPlayClick: () => navigate(ROUTES.LEARN_MANUAL),
    onLibraryClick: () => navigate(ROUTES.LIBRARY),
  };

  // Menu sub-routes (rendered inside MenuLayout)
  const menuSubRoutes: {
    path?: string;
    index?: true;
    element: React.ReactNode;
  }[] = [
    { index: true, element: <RoutesConfig.LazyMenuHome /> },
    { path: "play", element: <RoutesConfig.LazyMenuPlay /> },
    { path: "play/local", element: <RoutesConfig.LazyMenuLocal /> },
    { path: "play/lobby", element: <RoutesConfig.LazyMenuLobby /> },
    { path: "play/setup", element: <RoutesConfig.LazyMenuSetup /> },
    { path: "learn", element: <RoutesConfig.LazyMenuLearn /> },
    { path: "learn/endgame", element: <RoutesConfig.LazyMenuEndgame /> },
    {
      path: "learn/endgame/capture-the-world",
      element: (
        <RoutesConfig.LazyCaptureTheWorldGuide
          onBack={() => navigate(ROUTES.LEARN_ENDGAME)}
        />
      ),
    },
    {
      path: "learn/endgame/capture-the-king",
      element: (
        <RoutesConfig.LazyCtkGuide
          onBack={() => navigate(ROUTES.LEARN_ENDGAME)}
        />
      ),
    },
    {
      path: "learn/endgame/capture-the-army",
      element: (
        <RoutesConfig.LazyCtaGuide
          onBack={() => navigate(ROUTES.LEARN_ENDGAME)}
        />
      ),
    },
    { path: "learn/trench", element: <RoutesConfig.LazyMenuTrench /> },
    {
      path: "learn/trench/:terrain",
      element: (
        <TrenchGuideWrapper onBack={() => navigate(ROUTES.LEARN_TRENCH)} />
      ),
    },
    { path: "learn/chess", element: <RoutesConfig.LazyMenuChess /> },
    {
      path: "learn/chess/:unitType",
      element: (
        <ChessGuideWrapper onBack={() => navigate(ROUTES.LEARN_CHESS)} />
      ),
    },
    {
      path: "scoreboard",
      element: (
        <RoutesConfig.LazyMenuScoreboard
          darkMode={game.darkMode}
          pieceStyle={game.pieceStyle}
        />
      ),
    },
    {
      path: "rules",
      element: (
        <RoutesConfig.LazyRulesPage
          onBack={() => navigate(-1)}
          darkMode={game.darkMode}
        />
      ),
    },
    { path: "zen", element: <div /> }, // Effect in App handles the loading state / transition
  ];

  // Top-level routes outside the menu layout
  const topLevelRoutes: { path: string; element: React.ReactNode }[] = [
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
        <RoutesConfig.LazyInteractiveTutorial
          onBack={handleBackToMenu}
          darkMode={game.darkMode}
        />
      ),
    },
    {
      path: ROUTES.LEARN_MANUAL,
      element: (
        <RoutesConfig.LazyHowToPlay
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
    { path: ROUTES.LOADING, element: <LoadingFallback /> },
  ];

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Menu layout with nested sub-routes */}
        <Route
          path={ROUTES.HOME}
          element={
            <RoutesConfig.LazyMenuLayout
              darkMode={game.darkMode}
              pieceStyle={game.pieceStyle}
              toggleTheme={game.toggleTheme}
              togglePieceStyle={game.togglePieceStyle}
              onTutorial={() => {
                game.setGameState("tutorial");
                navigate(ROUTES.TUTORIAL);
              }}
              onLogoClick={() => {
                game.setGameState("menu");
                navigate(ROUTES.HOME);
              }}
              onZenGarden={() => navigate(ROUTES.ZEN)}
              multiplayer={game.multiplayer}
              onStartGame={(mode, preset, playerTypes, seed) =>
                game.initGameWithPreset(mode, preset, playerTypes, seed)
              }
              onCtwGuide={() => navigate(ROUTES.LEARN_ENDGAME_CTW)}
              onChessGuide={() => navigate(ROUTES.LEARN_CHESS)}
              onTrenchGuide={(t?: string) =>
                navigate(
                  t ? `${ROUTES.LEARN_TRENCH}/${t}` : ROUTES.LEARN_TRENCH,
                )
              }
              onOpenLibrary={() => navigate(ROUTES.LIBRARY)}
              selectedBoard={game.mode}
              setSelectedBoard={(m: any) => m && game.setMode(m)}
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
  );
};

export default App;
