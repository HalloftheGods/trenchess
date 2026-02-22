import React from "react";
import type { useGameState } from "@hooks/useGameState";
import LocalGameView from "./components/views/LocalGameView";
import OnlineGameView from "./components/views/OnlineGameView";
import ZenGardenView from "./components/views/ZenGardenView";

interface GameScreenProps {
  game: ReturnType<typeof useGameState>;
  onMenuClick: () => void;
  onHowToPlayClick: () => void;
  onLibraryClick: () => void;
}

/**
 * GameScreen — View dispatcher.
 *
 * Picks the correct view based on game state and multiplayer status:
 * - Zen Garden → ZenGardenView
 * - Online multiplayer → OnlineGameView
 * - Local play → LocalGameView
 */
const GameScreen: React.FC<GameScreenProps> = ({
  game,
  onMenuClick,
  onHowToPlayClick,
  onLibraryClick,
}) => {
  const viewProps = { game, onMenuClick, onHowToPlayClick, onLibraryClick };

  // Zen Garden has its own layout and controls
  if (game.gameState === "zen-garden") {
    return <ZenGardenView {...viewProps} />;
  }

  // Online multiplayer gets Shoutbox and lobby awareness
  if (game.multiplayer) {
    return <OnlineGameView {...viewProps} />;
  }

  // Default: local play
  return <LocalGameView {...viewProps} />;
};

export default GameScreen;
