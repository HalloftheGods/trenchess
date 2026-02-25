import React from "react";
import type { useGameState } from "@hooks/useGameState";
import MmoView from "./mmo";
import ZenGardenView from "./zen";

interface GameScreenProps {
  game: ReturnType<typeof useGameState>;
  isStarting?: boolean;
  onMenuClick: () => void;
  onHowToPlayClick: () => void;
  onLibraryClick: () => void;
}

/**
 * GameScreen — View dispatcher.
 *
 * Picks the correct view based on game state and multiplayer status:
 * - Zen Garden → ZenGardenView
 * - Default: (Local & Online) → MmoView
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

  // MMO view handles both local and online modes natively
  return <MmoView game={game} />;
};

export default GameScreen;
