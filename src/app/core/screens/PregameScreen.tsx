import React from "react";
import { PregameLayout } from "@engine/blueprints/layouts/PregameLayout";
import Header from "@organisms/Header";
import {
  ConnectedBoard,
  DeploymentPanel,
} from "@/app/client/console/components";
import { PHASES } from "@constants/game";
import { TCFlex } from "@atoms/ui";
import { ConsoleOverlays } from "@engine/components/hud/organisms";
import { usePregameSetup } from "@controllers/usePregameSetup";
import type { GameMode } from "@tc.types/game";

interface PregameScreenContentProps {
  preset: "omega" | "chi";
  mode: GameMode;
  playerConfig: Record<string, "human" | "computer">;
}

const PregameScreenContent: React.FC<PregameScreenContentProps> = ({
  preset,
  mode,
  playerConfig,
}) => {
  const game = usePregameSetup({ preset, mode, playerConfig });
  const { isTerrainStageAvailable } = game;

  return (
    <>
      <PregameLayout
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
            setupMode={isTerrainStageAvailable ? game.setupMode : "pieces"}
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
            isTerrainStageAvailable={isTerrainStageAvailable}
          />
        }
        gameBoard={
          <TCFlex center className="w-full h-full min-h-[600px]">
            <ConnectedBoard />
          </TCFlex>
        }
      />

      <TCFlex center className="absolute inset-0 pointer-events-none z-[130]">
        <ConsoleOverlays />
      </TCFlex>
    </>
  );
};

export default PregameScreenContent;
