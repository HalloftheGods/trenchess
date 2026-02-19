import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useGameState } from "./hooks/useGameState"; // Assuming this path
import GameScreen from "./components/GameScreen";
import HowToPlay from "./components/HowToPlay";
import SeedLibrary from "./components/SeedLibrary";
import InteractiveTutorial from "./components/InteractiveTutorial";
import CaptureTheFlagGuide from "./components/CaptureTheFlagGuide";
import TrenchGuide from "./components/TrenchGuide";
import ChessGuide from "./components/ChessGuide";

// Menu Components
import MenuLayout from "./components/menu/MenuLayout";
import MenuHome from "./components/menu/MenuHome";
import MenuPlay from "./components/menu/MenuPlay";
import MenuLearn from "./components/menu/MenuLearn";
import MenuEndgame from "./components/menu/MenuEndgame";
import MenuTrench from "./components/menu/MenuTrench";
import MenuLobby from "./components/menu/MenuLobby";
import MenuSetup from "./components/menu/MenuSetup";
import MenuChess from "./components/menu/MenuChess";

import type { TerrainType } from "./types";

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
  const [prevState, setPrevState] = useState<string>("menu"); // Keep for "Back" functionality in wrappers if needed

  // Sync GameState with Route (Basic)
  useEffect(() => {
    // If we are in specific routes, update game state if needed, or vice-versa
    // For now, simpler: If game state transitions to 'play'/'setup'/'zen-garden', go to /game
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
            multiplayer={game.multiplayer}
            onStartGame={(mode, preset, playerTypes, seed) => {
              // This triggers the state change, which triggers the useEffect to navigate to /game
              game.initGameWithPreset(mode, preset, playerTypes, seed);
            }}
            // These props are largely unused by the new Menu Components which navigate directly,
            // but required by MenuLayout interface (which populates context)
            onCtfGuide={() => navigate("/learn/ctf")}
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
        <Route path="play/lobby" element={<MenuLobby />} />
        <Route path="play/setup" element={<MenuSetup />} />
        {/* We might want a route for setup like /play/setup?mode=... but for now simple */}

        <Route path="learn" element={<MenuLearn />} />
        <Route path="learn/endgame" element={<MenuEndgame />} />
        <Route path="learn/trench" element={<MenuTrench />} />
        <Route path="learn/chess" element={<MenuChess />} />
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
      <Route
        path="/learn/ctf"
        element={
          <CaptureTheFlagGuide
            onBack={handleBackToLearn}
            darkMode={game.darkMode}
            pieceStyle={game.pieceStyle}
            toggleTheme={game.toggleTheme}
            togglePieceStyle={game.togglePieceStyle}
            onTutorial={() => navigate("/tutorial")}
          />
        }
      />
      {/* Updated Chess Navigation */}
      <Route
        path="/learn/chess/:unitType"
        element={
          <ChessGuideWrapper
            onBack={() => navigate("/learn/chess")}
            darkMode={game.darkMode}
            pieceStyle={game.pieceStyle}
            toggleTheme={game.toggleTheme}
            togglePieceStyle={game.togglePieceStyle}
            onTutorial={() => navigate("/tutorial")}
          />
        }
      />
      {/* Dynamic Route for Trench Guide */}
      <Route
        path="/learn/trench/:terrain"
        element={
          <TrenchGuideWrapper
            onBack={handleBackToLearn}
            darkMode={game.darkMode}
            pieceStyle={game.pieceStyle}
            toggleTheme={game.toggleTheme}
            togglePieceStyle={game.togglePieceStyle}
            onTutorial={() => navigate("/tutorial")}
          />
        }
      />
    </Routes>
  );
};

export default App;
