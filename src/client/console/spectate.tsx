import React from "react";
import { SpectatorLayout } from "./components/templates/SpectatorLayout";
import Header from "@/shared/components/organisms/Header";
import {
  ConsoleGameBoard,
  Shoutbox,
} from "./components/organisms";
import type { GameStateHook } from "@/shared/types";

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
          onZenGarden={() => game.setGameState("zen-garden")}
        />
      }
      gameBoard={<ConsoleGameBoard game={game} />}
      shoutbox={
        <Shoutbox multiplayer={game.multiplayer} darkMode={game.darkMode} />
      }
    />
  );
};

export default SpectatorView;
