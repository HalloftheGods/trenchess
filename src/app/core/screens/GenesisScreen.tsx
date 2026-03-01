import React, { useState } from "react";
import { ZenGardenLayout } from "../blueprints/layouts/ZenGardenLayout";
import Header from "@/shared/components/organisms/Header";
import {
  ConnectedBoard,
  DeploymentPanel,
} from "@/app/client/console/components";
import { useGameState } from "@hooks/engine/useGameState";
import { PHASES } from "@constants/game";
import { TCFlex, TCButton, TCStack } from "@atoms/ui";
import { useConsoleLogic } from "@/shared/hooks/interface/useConsoleLogic";
import { ConsoleOverlays } from "../hud/organisms";
import { Save, FolderInput } from "lucide-react";

const GenesisScreen: React.FC = () => {
  const game = useGameState();
  const logic = useConsoleLogic(game);
  const [hasStoredConfig, setHasStoredConfig] = useState(
    !!localStorage.getItem("trenchess_board_config"),
  );

  const handleSave = () => {
    game.saveConfig();
    setHasStoredConfig(true);
  };

  const handleLoad = () => {
    if (game.loadConfig()) {
      // Success feedback could go here
    }
  };

  return (
    <>
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
          />
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
            ready={game.ready}
            startGame={game.startGame}
            localPlayerName={game.localPlayerName}
          />
        }
        gameBoard={
          <TCFlex center className="w-full h-full min-h-[600px]">
            <ConnectedBoard game={game} />
          </TCFlex>
        }
      />
      
      {/* Quick FAB Buttons */}
      <TCStack
        className="fixed bottom-8 right-8 z-[140]"
        direction="col"
        gap={4}
      >
        {hasStoredConfig && (
          <TCButton
            variant="secondary"
            className="rounded-full w-14 h-14 shadow-2xl p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white border-none min-w-0"
            onClick={handleLoad}
            title="Load Saved Board"
          >
            <FolderInput size={24} />
          </TCButton>
        )}
        <TCButton
          variant="secondary"
          className="rounded-full w-14 h-14 shadow-2xl p-0 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white border-none min-w-0"
          onClick={handleSave}
          title="Save Board Config"
        >
          <Save size={24} />
        </TCButton>
      </TCStack>

      <TCFlex center className="absolute inset-0 pointer-events-none z-[130]">
        <ConsoleOverlays game={game} logic={logic} />
      </TCFlex>
    </>
  );
};

export default GenesisScreen;
