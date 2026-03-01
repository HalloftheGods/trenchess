import React from "react";
import { useParams } from "react-router-dom";
import MmoView from "@game/mmo";
import ZenGardenView from "@game/design/zen";
import ConsoleViewDispatcher from "@game/game";
import { PHASES } from "@constants/game";

import { useGameState } from "@hooks/engine/useGameState";

/**
 * GameScreen — View dispatcher.
 *
 * Picks the correct view based on game state and multiplayer status:
 * - Zen Garden → ZenGardenView
 * - Default: (Local & Online) → MmoView
 */
const GameScreen: React.FC = () => {
  const game = useGameState();
  const { style } = useParams<{ style: string }>();
  if (style) {
    return <ConsoleViewDispatcher />;
  }

  if (game.gameState === PHASES.ZEN_GARDEN) {
    return <ZenGardenView />;
  }

  // MMO view handles both local and online modes natively
  return <MmoView />;
};

export default GameScreen;
