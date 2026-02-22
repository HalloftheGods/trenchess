import React from "react";
import { OnlineGameLayout } from "../templates/OnlineGameLayout";
import Header from "@/shared/components/organisms/Header";
import DeploymentPanel from "@/app/routes/game/components/organisms/DeploymentPanel";
import GameBoard from "@/app/routes/game/components/organisms/GameBoard";
import IntelPanel from "@/app/routes/game/components/organisms/IntelPanel";
import Shoutbox from "@/app/routes/game/components/organisms/Shoutbox";
import { LoadingFallback } from "@/shared/components/molecules/LoadingFallback";
import type { useGameState } from "@hooks/useGameState";

interface OnlineGameViewProps {
  game: ReturnType<typeof useGameState>;
  onMenuClick: () => void;
  onHowToPlayClick: () => void;
  onLibraryClick: () => void;
}

const OnlineGameView: React.FC<OnlineGameViewProps> = ({
  game,
  onMenuClick,
  onHowToPlayClick,
  onLibraryClick,
}) => {
  const localPlayerId =
    game.multiplayer?.playerIndex !== null &&
    game.multiplayer?.playerIndex !== undefined &&
    game.activePlayers[game.multiplayer.playerIndex]
      ? game.activePlayers[game.multiplayer.playerIndex]
      : undefined;

  return (
    <OnlineGameLayout
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
          onZenGarden={() => game.setGameState("zen-garden")}
        />
      }
      deploymentPanel={
        game.gameState === "setup" || game.gameState === "play" ? (
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
            isCurrentPlayerReady={game.isPlayerReady(
              localPlayerId || game.turn,
            )}
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
            localPlayerName={game.localPlayerName}
          />
        ) : null
      }
      gameBoard={
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
          localPlayerName={game.localPlayerName}
        />
      }
      intelPanel={
        game.isThinking ? (
          <LoadingFallback fullScreen={false} />
        ) : (
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
        )
      }
      shoutbox={
        <Shoutbox
          multiplayer={game.multiplayer as any}
          darkMode={game.darkMode}
        />
      }
    />
  );
};

export default OnlineGameView;
