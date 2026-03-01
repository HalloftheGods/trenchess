import React from "react";
import { ZenGardenLayout } from "@blueprints/layouts/ZenGardenLayout";
import Header from "@organisms/Header";
import { ConnectedBoard, DeploymentPanel } from "@game/components";
import { Pencil } from "lucide-react";
import { serializeGame } from "@/shared/utilities/gameUrl";
import { useGameState } from "@hooks/engine/useGameState";
import { PHASES, FEATURES } from "@constants";

const ZenGardenView: React.FC = () => {
  const game = useGameState();
  const renderZenGardenControls = () => (
    <div className="flex items-center gap-2 group">
      <input
        value={game.layoutName}
        onChange={(e) => game.setLayoutName(e.target.value)}
        className="bg-transparent border-b border-transparent group-hover:border-slate-300 dark:group-hover:border-slate-700 text-slate-800 dark:text-slate-200 font-black text-sm uppercase tracking-widest focus:outline-none focus:border-amber-500 w-48 text-center transition-all placeholder:text-slate-300"
        placeholder="NAME LAYOUT..."
      />
      <Pencil size={12} className="text-slate-300 group-hover:text-slate-400" />
    </div>
  );

  const renderZenGardenSeedButton = () => {
    if (!FEATURES.SEEDS) return null;

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
            window.history.pushState({}, "", url.toString());
            navigator.clipboard.writeText(url.toString());
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
    <ZenGardenLayout
      header={
        <Header
          onMenuClick={() => {}}
          onHowToPlayClick={() => {}}
          onLibraryClick={() => {}}
          isFlipped={game.isFlipped}
          setIsFlipped={(v) => {
            game.setIsFlipped(v);
            if (game.autoFlip) game.setAutoFlip(false);
          }}
          gameState={game.gameState}
          gameMode={game.mode}
          turn={game.turn}
          activePlayers={game.activePlayers}
          darkMode={game.darkMode}
          pieceStyle={game.pieceStyle}
          toggleTheme={game.toggleTheme}
          togglePieceStyle={game.togglePieceStyle}
          onZenGarden={() => game.setGameState(PHASES.ZEN_GARDEN)}
        >
          {renderZenGardenControls()}
          {renderZenGardenSeedButton()}
        </Header>
      }
      deploymentPanel={
        <DeploymentPanel
          gameState={game.gameState}
          turn={game.turn}
          mode={game.mode}
          terrain={game.terrain}
          setTerrain={game.setTerrain}
          setupMode={game.setupMode}
          setSetupMode={game.setSetupMode}
          pieceStyle={game.pieceStyle}
          inventory={game.inventory}
          terrainInventory={game.terrainInventory}
          placementPiece={game.placementPiece}
          setPlacementPiece={game.setPlacementPiece}
          placementTerrain={game.placementTerrain}
          setPlacementTerrain={game.setPlacementTerrain}
          activePlayers={game.activePlayers}
          isAllPlaced={game.isAllPlaced}
          isCurrentPlayerReady={game.isPlayerReady(game.turn)}
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
          localPlayerName={game.localPlayerName}
        />
      }
      gameBoard={<ConnectedBoard game={game} />}
    />
  );
};

export default ZenGardenView;
