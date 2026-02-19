/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of Trenchess.
 */
import { useState } from "react";
import { Pencil } from "lucide-react";
import { useGameState } from "./hooks/useGameState";
import { serializeGame } from "./utils/gameUrl";
import MenuScreen from "./components/MenuScreen";
import GameBoard from "./components/GameBoard";
import DeploymentPanel from "./components/DeploymentPanel";
import IntelPanel from "./components/IntelPanel";
import HowToPlay from "./components/HowToPlay";
import SeedLibrary from "./components/SeedLibrary";
import Header from "./components/Header";
import { GameLayout } from "./components/GameLayout";
import InteractiveTutorial from "./components/InteractiveTutorial";
import CaptureTheFlagGuide from "./components/CaptureTheFlagGuide";
import TrenchGuide from "./components/TrenchGuide";
import ChessGuide from "./components/ChessGuide";

import type { TerrainType } from "./types";

const App = () => {
  const game = useGameState();
  const [prevState, setPrevState] = useState<string>("menu");
  const [selectedTerrain, setSelectedTerrain] = useState<TerrainType | null>(
    null,
  );

  const localPlayerId =
    game.multiplayer?.isConnected &&
    game.multiplayer?.socketId &&
    game.multiplayer.players.indexOf(game.multiplayer.socketId) >= 0 &&
    game.activePlayers[
      game.multiplayer.players.indexOf(game.multiplayer.socketId)
    ]
      ? game.activePlayers[
          game.multiplayer.players.indexOf(game.multiplayer.socketId)
        ]
      : undefined;

  // --- Render Functions for different states ---

  if (game.gameState === "menu") {
    return (
      <MenuScreen
        darkMode={game.darkMode}
        pieceStyle={game.pieceStyle}
        toggleTheme={game.toggleTheme}
        togglePieceStyle={game.togglePieceStyle}
        initGame={game.initGame}
        onStartGame={(mode, preset, playerTypes, seed) =>
          game.initGameWithPreset(mode, preset, playerTypes, seed)
        }
        onHowToPlay={() => {
          setPrevState("menu");
          game.setGameState("how-to-play");
        }}
        onTutorial={() => {
          setPrevState("menu");
          game.setGameState("tutorial");
        }}
        onCtfGuide={() => {
          setPrevState("menu");
          game.setGameState("ctf-guide");
        }}
        onChessGuide={() => {
          setPrevState("menu");
          game.setGameState("chess-guide");
        }}
        onTrenchGuide={(terrain) => {
          setPrevState("menu");
          setSelectedTerrain(terrain || null);
          game.setGameState("trench-guide");
        }}
        onOpenLibrary={() => {
          setPrevState("menu");
          game.setGameState("library");
        }}
        multiplayer={game.multiplayer}
      />
    );
  }

  if (game.gameState === "tutorial") {
    return (
      <InteractiveTutorial
        onBack={() => game.setGameState(prevState as any)}
        darkMode={game.darkMode}
      />
    );
  }

  if (game.gameState === "how-to-play") {
    return (
      <HowToPlay
        onBack={() => game.setGameState(prevState as any)}
        darkMode={game.darkMode}
        pieceStyle={game.pieceStyle}
        toggleTheme={game.toggleTheme}
        togglePieceStyle={game.togglePieceStyle}
        onTutorial={() => game.setGameState("tutorial")}
      />
    );
  }

  if (game.gameState === "ctf-guide") {
    return (
      <CaptureTheFlagGuide
        onBack={() => game.setGameState(prevState as any)}
        darkMode={game.darkMode}
        pieceStyle={game.pieceStyle}
        toggleTheme={game.toggleTheme}
        togglePieceStyle={game.togglePieceStyle}
        onTutorial={() => game.setGameState("tutorial")}
      />
    );
  }

  if (game.gameState === "trench-guide") {
    return (
      <TrenchGuide
        onBack={() => game.setGameState(prevState as any)}
        darkMode={game.darkMode}
        pieceStyle={game.pieceStyle}
        toggleTheme={game.toggleTheme}
        togglePieceStyle={game.togglePieceStyle}
        onTutorial={() => game.setGameState("tutorial")}
        initialTerrain={selectedTerrain}
      />
    );
  }

  if (game.gameState === "chess-guide") {
    return (
      <ChessGuide
        onBack={() => game.setGameState(prevState as any)}
        darkMode={game.darkMode}
        pieceStyle={game.pieceStyle}
        toggleTheme={game.toggleTheme}
        togglePieceStyle={game.togglePieceStyle}
        onTutorial={() => game.setGameState("tutorial")}
      />
    );
  }

  if (game.gameState === "library") {
    return (
      <SeedLibrary
        onBack={() => game.setGameState(prevState as any)}
        onLoadSeed={(seed) => {
          game.initFromSeed(seed);
        }}
        onEditInZen={(seed) => {
          game.initFromSeed(seed, "zen-garden");
        }}
        activeMode={game.mode}
      />
    );
  }

  const renderZenGardenControls = () => {
    if (game.gameState !== "zen-garden") return null;
    return (
      <div className="flex items-center gap-2 group">
        <input
          value={game.layoutName}
          onChange={(e) => game.setLayoutName(e.target.value)}
          className="bg-transparent border-b border-transparent group-hover:border-slate-300 dark:group-hover:border-slate-700 text-slate-800 dark:text-slate-200 font-black text-sm uppercase tracking-widest focus:outline-none focus:border-amber-500 w-48 text-center transition-all placeholder:text-slate-300"
          placeholder="NAME LAYOUT..."
        />
        <Pencil
          size={12}
          className="text-slate-300 group-hover:text-slate-400"
        />
      </div>
    );
  };

  const renderZenGardenSeedButton = () => {
    if (game.gameState !== "zen-garden") return null;
    return (
      <button
        onClick={() => {
          const seed = serializeGame(
            game.mode,
            game.board,
            game.terrain,
            game.layoutName,
          );
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("seed", seed);
            window.history.pushState({}, "", url);
            navigator.clipboard.writeText(url.toString());
            window.location.reload();
          }
        }}
        className="absolute right-0 top-20 xl:top-auto xl:static px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/20 cursor-pointer z-50 mr-4 xl:mr-0"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Seed
      </button>
    );
  };

  return (
    <GameLayout
      header={
        <Header
          onMenuClick={() => game.setGameState("menu")}
          onHowToPlayClick={() => {
            setPrevState(game.gameState);
            game.setGameState("how-to-play");
          }}
          onLibraryClick={() => {
            setPrevState(game.gameState);
            game.setGameState("library");
          }}
          isFlipped={game.isFlipped}
          setIsFlipped={(v) => {
            game.setIsFlipped(v);
            if (game.autoFlip) game.setAutoFlip(false);
          }}
          gameState={game.gameState}
          gameMode={game.mode}
          turn={localPlayerId || game.turn}
          activePlayers={game.activePlayers}
          darkMode={game.darkMode}
          pieceStyle={game.pieceStyle}
          toggleTheme={game.toggleTheme}
          togglePieceStyle={game.togglePieceStyle}
        >
          {renderZenGardenControls()}
          {renderZenGardenSeedButton()}
        </Header>
      }
    >
      {(game.gameState === "setup" ||
        game.gameState === "play" ||
        game.gameState === "zen-garden") && (
        <DeploymentPanel
          gameState={game.gameState}
          turn={localPlayerId || game.turn}
          mode={game.mode}
          terrain={game.terrain}
          setTerrain={game.setTerrain}
          setupMode={game.setupMode}
          setSetupMode={game.setSetupMode}
          multiplayer={game.multiplayer}
          localPlayerId={localPlayerId}
          pieceStyle={game.pieceStyle}
          inventory={game.inventory}
          terrainInventory={game.terrainInventory}
          placementPiece={game.placementPiece}
          setPlacementPiece={game.setPlacementPiece}
          placementTerrain={game.placementTerrain}
          setPlacementTerrain={game.setPlacementTerrain}
          activePlayers={game.activePlayers}
          isAllPlaced={game.isAllPlaced}
          getIcon={game.getIcon}
          getPlayerDisplayName={game.getPlayerDisplayName}
          setTurn={game.setTurn}
          setGameState={game.setGameState}
          setSelectedCell={game.setSelectedCell}
          setValidMoves={game.setValidMoves}
          randomizeTerrain={game.randomizeTerrain}
          randomizeUnits={game.randomizeUnits}
          setClassicalFormation={game.setClassicalFormation}
          mirrorBoard={game.mirrorBoard}
          inCheck={game.inCheck}
          board={game.board}
          setBoard={game.setBoard}
          layoutName={game.layoutName}
          setInventory={game.setInventory}
        />
      )}

      <GameBoard
        board={game.board}
        terrain={game.terrain}
        mode={game.mode}
        gameState={game.gameState}
        turn={localPlayerId || game.turn}
        pieceStyle={game.pieceStyle}
        selectedCell={game.selectedCell}
        hoveredCell={game.hoveredCell}
        validMoves={game.validMoves}
        previewMoves={game.previewMoves}
        placementPiece={game.placementPiece}
        placementTerrain={game.placementTerrain}
        setupMode={game.setupMode}
        winner={game.winner}
        getIcon={game.getIcon}
        getPlayerDisplayName={game.getPlayerDisplayName}
        handleCellClick={(r, c) =>
          game.handleCellClick(r, c, localPlayerId || undefined)
        }
        handleCellHover={(r, c) =>
          game.handleCellHover(r, c, localPlayerId || undefined)
        }
        setHoveredCell={game.setHoveredCell}
        setPreviewMoves={game.setPreviewMoves}
        setGameState={game.setGameState}
        isFlipped={game.isFlipped}
      />

      <IntelPanel
        gameState={game.gameState}
        setupMode={game.setupMode}
        placementPiece={game.placementPiece}
        placementTerrain={game.placementTerrain}
        selectedCell={game.selectedCell}
        board={game.board}
        terrain={game.terrain}
        pieceStyle={game.pieceStyle}
        getIcon={game.getIcon}
        activePlayers={game.activePlayers}
        capturedBy={game.capturedBy}
      />
    </GameLayout>
  );
};

export default App;
