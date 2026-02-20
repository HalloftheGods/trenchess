import { Suspense, lazy, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useGameState } from "./hooks/useGameState"; // Assuming this path

// Lazy-loaded Components
const GameScreen = lazy(() => import("./components/GameScreen"));
const HowToPlay = lazy(() => import("./components/HowToPlay"));
const SeedLibrary = lazy(() => import("./components/SeedLibrary"));
const InteractiveTutorial = lazy(
  () => import("./components/InteractiveTutorial"),
);
const CaptureTheWorldGuide = lazy(
  () => import("./components/CaptureTheWorldGuide"),
);
const CtkGuide = lazy(() => import("./components/CtkGuide"));
const CtaGuide = lazy(() => import("./components/CtaGuide"));
const TrenchGuide = lazy(() => import("./components/TrenchGuide"));
const ChessGuide = lazy(() => import("./components/ChessGuide"));

// Lazy-loaded Menu Components
const MenuLayout = lazy(() => import("./components/menu/MenuLayout"));
const MenuHome = lazy(() => import("./components/menu/MenuHome"));
const MenuPlay = lazy(() => import("./components/menu/MenuPlay"));
const MenuLearn = lazy(() => import("./components/menu/MenuLearn"));
const MenuEndgame = lazy(() => import("./components/menu/MenuEndgame"));
const MenuTrench = lazy(() => import("./components/menu/MenuTrench"));
const MenuLobby = lazy(() => import("./components/menu/MenuLobby"));
const MenuLocal = lazy(() => import("./components/menu/MenuLocal"));
const MenuSetup = lazy(() => import("./components/menu/MenuSetup"));
const MenuChess = lazy(() => import("./components/menu/MenuChess"));

import type { TerrainType } from "./types";
import TrenchessText from "./components/ui/TrenchessText";
import { Mountain, Trees, Waves } from "lucide-react";
import { DesertIcon } from "./UnitIcons";

// A simple sleek loading fallback
const LoadingFallback = () => (
  <div className="w-full h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
    <DesertIcon className="w-12 h-12" />
    <span className="mt-4 text-center  font-black uppercase tracking-widest text-slate-400">
      <Mountain className="float-right w-12 h-12 text-red-500" />
      <Trees className=" w-12 h-12 text-emerald-500" />
      <div>
        Loading <TrenchessText />
      </div>

      <div className="flex flex-row">
        <Waves className="w-12 h-12 text-blue-500" />
        <Waves className="w-12 h-12 text-blue-500 " />
        <Waves className="w-12 h-12 text-blue-500" />
        <Waves className="w-12 h-12 text-blue-500" />
      </div>
      <div>
        Please wait... <br />
      </div>
    </span>
  </div>
);

const TrenchGuideWrapper = (props: any) => {
  const { terrain } = useParams();
  return <TrenchGuide {...props} initialTerrain={terrain as TerrainType} />;
};

const ChessGuideWrapper = (props: any) => {
  const { unitType } = useParams();
  return <ChessGuide {...props} initialUnit={unitType} />;
};

const App = () => {
  const game = useGameState();
  const navigate = useNavigate();
  const location = useLocation();
  // Keep for "Back" functionality in wrappers if left out

  // Sync GameState with Route (Basic)
  useEffect(() => {
    // Handle direct navigation to /zen
    if (location.pathname === "/zen") {
      game.initGameWithPreset("2p-ns", "zen-garden");
      return;
    }

    // If we are in specific routes, update game state if needed, or vice-versa
    if (
      (game.gameState === "play" ||
        game.gameState === "setup" ||
        game.gameState === "zen-garden") &&
      location.pathname !== "/game"
    ) {
      navigate("/game");
    }
  }, [game.gameState, navigate, location.pathname]);

  // If we are at /game but gameState is menu (e.g. refresh), redirect to menu
  useEffect(() => {
    if (location.pathname === "/game" && game.gameState === "menu") {
      navigate("/");
    }
  }, [location.pathname, game.gameState, navigate]);

  // Callbacks for MenuLayout
  // Note: we can use navigate directly in components, but MenuLayout interface expects these.
  // We can pass wrappers that update GameState if we want to maintain that state logic,
  // OR we can rely on Routes.
  // However, some existing components (like HowToPlay) expect "onBack".
  // References to "setGameState" in original App.tsx imply the components use that to go back.
  // We need to update those components to use "navigate(-1)" or similar, OR pass a callback that navigates.

  const handleBackToMenu = () => {
    game.setGameState("menu"); // Reset state
    navigate("/");
  };

  const handleBackToLearn = () => {
    game.setGameState("menu");
    navigate("/learn");
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/"
          element={
            <MenuLayout
              darkMode={game.darkMode}
              pieceStyle={game.pieceStyle}
              toggleTheme={game.toggleTheme}
              togglePieceStyle={game.togglePieceStyle}
              onTutorial={() => {
                game.setGameState("tutorial");
                navigate("/tutorial");
              }}
              onLogoClick={() => {
                game.setGameState("menu");
                navigate("/");
              }}
              onZenGarden={() => {
                navigate("/zen");
              }}
              multiplayer={game.multiplayer}
              onStartGame={(mode, preset, playerTypes, seed) => {
                // This triggers the state change, which triggers the useEffect to navigate to /game
                game.initGameWithPreset(mode, preset, playerTypes, seed);
              }}
              // These props are largely unused by the new Menu Components which navigate directly,
              // but required by MenuLayout interface (which populates context)
              onCtwGuide={() => navigate("/learn/endgame/capture-the-world")}
              onChessGuide={() => navigate("/learn/chess")}
              onTrenchGuide={(t) =>
                navigate(t ? `/learn/trench/${t}` : "/learn/trench")
              }
              onOpenLibrary={() => navigate("/library")}
            />
          }
        >
          <Route index element={<MenuHome />} />
          <Route path="play" element={<MenuPlay />} />
          <Route path="play/local" element={<MenuLocal />} />
          <Route path="play/lobby" element={<MenuLobby />} />
          <Route path="play/setup" element={<MenuSetup />} />
          {/* We might want a route for setup like /play/setup?mode=... but for now simple */}

          <Route path="learn" element={<MenuLearn />} />
          <Route path="learn/endgame" element={<MenuEndgame />} />
          <Route
            path="learn/endgame/capture-the-world"
            element={<CaptureTheWorldGuide onBack={handleBackToLearn} />}
          />
          <Route
            path="learn/endgame/capture-the-king"
            element={<CtkGuide onBack={handleBackToLearn} />}
          />
          <Route
            path="learn/endgame/capture-the-army"
            element={<CtaGuide onBack={handleBackToLearn} />}
          />
          <Route path="learn/trench" element={<MenuTrench />} />
          <Route
            path="learn/trench/:terrain"
            element={<TrenchGuideWrapper onBack={handleBackToLearn} />}
          />
          <Route path="learn/chess" element={<MenuChess />} />
          <Route
            path="learn/chess/:unitType"
            element={
              <ChessGuideWrapper onBack={() => navigate("/learn/chess")} />
            }
          />
          <Route
            path="zen"
            element={<div />} // Effect in App handles the actual loading state or transition
          />
        </Route>

        <Route
          path="/game"
          element={
            <GameScreen
              game={game}
              onMenuClick={handleBackToMenu}
              onHowToPlayClick={() => navigate("/learn/manual")} // In-game help
              onLibraryClick={() => navigate("/library")}
            />
          }
        />

        <Route
          path="/tutorial"
          element={
            <InteractiveTutorial
              onBack={handleBackToMenu}
              darkMode={game.darkMode}
            />
          }
        />

        <Route
          path="/library"
          element={
            <SeedLibrary
              onBack={handleBackToMenu} // Or navigate(-1)?
              onLoadSeed={(seed) => {
                game.initFromSeed(seed); // Sets state to play/setup
                // useEffect will handle nav to /game
              }}
              onEditInZen={(seed) => {
                game.initFromSeed(seed, "zen-garden");
                // useEffect will handle nav to /game
              }}
              activeMode={game.mode}
            />
          }
        />

        {/* Guides */}
        <Route
          path="/learn/manual"
          element={
            <HowToPlay
              onBack={handleBackToMenu} // Should probably go back to where we came from
              darkMode={game.darkMode}
              pieceStyle={game.pieceStyle}
              toggleTheme={game.toggleTheme}
              togglePieceStyle={game.togglePieceStyle}
              onTutorial={() => navigate("/tutorial")}
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
