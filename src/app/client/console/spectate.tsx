import React from "react";
import { SpectatorLayout } from "@blueprints/layouts/SpectatorLayout";
import Header from "@organisms/Header";
import { ConnectedBoard, Shoutbox } from "@game/components";
import type { GameStateHook } from "@tc.types";
import { PHASES } from "@constants/game";

interface SpectatorViewProps {
  game: GameStateHook;
  onMenuClick?: () => void;
  onHowToPlayClick?: () => void;
  onLibraryClick?: () => void;
}

/**
 * Spectator view: read-only game observation with chat.
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
          darkMode={game.darkMode}
          pieceStyle={game.pieceStyle}
          toggleTheme={game.toggleTheme}
          togglePieceStyle={game.togglePieceStyle}
          onZenGarden={() => game.setGameState(PHASES.ZEN_GARDEN)}
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
