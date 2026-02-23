import React from "react";
import { SpectatorLayout } from "./components/templates/SpectatorLayout";
import Header from "@/shared/components/organisms/Header";
import GameBoard from "@/client/game/components/organisms/GameBoard";
import Shoutbox from "@/client/game/components/organisms/Shoutbox";
import type { useGameState } from "@hooks/useGameState";

interface SpectatorViewProps {
  game: ReturnType<typeof useGameState>;
  onMenuClick: () => void;
  onHowToPlayClick: () => void;
  onLibraryClick: () => void;
}

/**
 * Spectator view: read-only game observation with chat.
 * No deployment controls — spectators watch the action unfold.
 */
const SpectatorView: React.FC<SpectatorViewProps> = ({
  game,
  onMenuClick,
  onHowToPlayClick,
  onLibraryClick,
}) => {
  return (
    <SpectatorLayout
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
          turn={game.turn}
          activePlayers={game.activePlayers}
          darkMode={game.darkMode}
          pieceStyle={game.pieceStyle}
          toggleTheme={game.toggleTheme}
          togglePieceStyle={game.togglePieceStyle}
          onZenGarden={() => game.setGameState("zen-garden")}
        />
      }
      gameBoard={
        <GameBoard
          board={game.board}
          terrain={game.terrain}
          mode={game.mode}
          gameState={game.gameState}
          turn={game.turn}
          pieceStyle={game.pieceStyle}
          selectedCell={null}
          hoveredCell={null}
          validMoves={[]}
          previewMoves={[]}
          placementPiece={null}
          placementTerrain={null}
          setupMode={game.setupMode}
          winner={game.winner}
          getIcon={game.getIcon}
          getPlayerDisplayName={game.getPlayerDisplayName}
          handleCellClick={() => {}}
          handleCellHover={() => {}}
          setHoveredCell={() => {}}
          setPreviewMoves={() => {}}
          setGameState={game.setGameState}
          isFlipped={game.isFlipped}
          localPlayerName={game.localPlayerName}
        />
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

export default SpectatorView;
