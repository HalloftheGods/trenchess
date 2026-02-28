import React from "react";
import { LocalGameLayout } from "../blueprints/layouts/LocalGameLayout";
import Header from "@/shared/components/organisms/Header";
import {
  ConnectedBoard,
  DeploymentPanel,
} from "@/app/client/console/components";
import { useRouteContext } from "@context";
import type { GameStateHook } from "@tc.types";
import { PHASES } from "@constants/game";
import { TCFlex } from "@atoms/ui";

export interface MainLoadoutScreenProps {
  game: GameStateHook;
  onMenuClick?: () => void;
  onHowToPlayClick?: () => void;
  onLibraryClick?: () => void;
}

const MainLoadoutScreen: React.FC<MainLoadoutScreenProps> = ({
  game,
  onMenuClick,
  onHowToPlayClick,
  onLibraryClick,
}) => {
  const ctx = useRouteContext();

  return (
    <LocalGameLayout
      header={
        <Header
          onMenuClick={onMenuClick || (() => {})}
          onHowToPlayClick={onHowToPlayClick || (() => {})}
          onLibraryClick={onLibraryClick || (() => {})}
          isFlipped={game.isFlipped}
          setIsFlipped={(v) => {
            game.setIsFlipped(v);
            if (game.autoFlip) game.setAutoFlip(false);
          }}
          gameState={game.gameState}
          gameMode={game.mode}
          turn={game.turn}
          activePlayers={game.activePlayers}
          darkMode={ctx.darkMode}
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
          localPlayerName={game.localPlayerName}
        />
      }
      gameBoard={
        <TCFlex center className="w-full h-full min-h-[600px]">
          <ConnectedBoard game={game} />
        </TCFlex>
      }
      intelPanel={null} // Intel panel for drafting?
    />
  );
};

export default MainLoadoutScreen;
