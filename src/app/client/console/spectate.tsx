import React from "react";
import { SpectatorLayout } from "@blueprints/layouts/SpectatorLayout";
import Header from "@organisms/Header";
import { ConnectedBoard, Shoutbox } from "@game/components";
import {
  useMatchState,
  MatchStateProvider,
  MatchHUDProvider,
} from "@/shared/context";

/**
 * Spectator view: read-only game observation with chat.
 */
const SpectatorViewContent: React.FC = () => {
  const game = useMatchState();
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
      gameBoard={<ConnectedBoard />}
      shoutbox={
        <Shoutbox multiplayer={game.multiplayer} darkMode={game.darkMode} />
      }
    />
  );
};

const SpectatorView: React.FC = () => (
  <MatchStateProvider>
    <MatchHUDProvider>
      <SpectatorViewContent />
    </MatchHUDProvider>
  </MatchStateProvider>
);

export default SpectatorView;
