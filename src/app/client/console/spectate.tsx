import React from "react";
import { SpectatorLayout } from "@blueprints/layouts/SpectatorLayout";
import Header from "@organisms/Header";
import { ConnectedBoard, Shoutbox } from "@game/components";
import { useGameState } from "@hooks/engine/useGameState";

/**
 * Spectator view: read-only game observation with chat.
 */
const SpectatorView: React.FC = () => {
  const game = useGameState();
  return (
    <SpectatorLayout
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
        />
      }
      gameBoard={<ConnectedBoard game={game} />}
      shoutbox={
        <Shoutbox multiplayer={game.multiplayer} darkMode={game.darkMode} />
      }
    />
  );
};

export default SpectatorView;
