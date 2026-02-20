import React from "react";
import { GameLayout } from "./GameLayout";
import Header from "./Header";
import DeploymentPanel from "./DeploymentPanel";
import GameBoard from "./GameBoard";
import IntelPanel from "./IntelPanel";
import { Pencil } from "lucide-react";
import { serializeGame } from "../utils/gameUrl";
import type { useGameState } from "../hooks/useGameState";

interface GameScreenProps {
  game: ReturnType<typeof useGameState>;
  onMenuClick: () => void;
  onHowToPlayClick: () => void; // For in-game help
  onLibraryClick: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  game,
  onMenuClick,
  onHowToPlayClick,
  onLibraryClick,
}) => {
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
            // window.location.reload(); // Don't reload in SPA if possible, but maybe needed for seed init?
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
          onMenuClick={onMenuClick}
          onHowToPlayClick={onHowToPlayClick}
          onLibraryClick={onLibraryClick}
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
          isCurrentPlayerReady={game.isPlayerReady(localPlayerId || game.turn)}
          getIcon={game.getIcon}
          getPlayerDisplayName={game.getPlayerDisplayName}
          setTurn={game.setTurn}
          setGameState={game.setGameState}
          setSelectedCell={game.setSelectedCell}
          setValidMoves={game.setValidMoves}
          randomizeTerrain={game.randomizeTerrain}
          generateElementalTerrain={game.generateElementalTerrain}
          randomizeUnits={game.randomizeUnits}
          resetTerrain={game.resetTerrain}
          resetUnits={game.resetUnits}
          setClassicalFormation={game.setClassicalFormation}
          mirrorBoard={game.mirrorBoard}
          inCheck={game.inCheck}
          board={game.board}
          setBoard={game.setBoard}
          layoutName={game.layoutName}
          setInventory={game.setInventory}
          playerTypes={game.playerTypes}
          setPlayerTypes={game.setPlayerTypes}
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

export default GameScreen;
