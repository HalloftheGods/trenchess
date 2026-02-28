import React from "react";
import { useParams } from "react-router-dom";
import AlphaView from "./alpha";
import BattleView from "./battle";
import PiView from "./pi";
import ChiView from "./chi";
import OmegaView from "./omega";
import MmoView from "../mmo";
import ZenView from "../design/zen";
import GamemasterView from "../gamemaster";
import SpectatorView from "../spectate";
import { PHASES } from "@constants/game";
import type { GameStateHook } from "@tc.types";

interface ConsoleViewDispatcherProps {
  game: GameStateHook;
  onMenuClick?: () => void;
  onHowToPlayClick?: () => void;
  onLibraryClick?: () => void;
}

/**
 * ConsoleViewDispatcher — Picks the correct playstyle view based on the :style route param.
 */
import { SCREEN_REGISTRY } from "@/app/core/screens/registry";
import type { ScreenId } from "@/app/core/screens/registry";

const ConsoleViewDispatcher: React.FC<ConsoleViewDispatcherProps> = ({
  game,
  onMenuClick,
  onHowToPlayClick,
  onLibraryClick,
}) => {
  const { style } = useParams<{ style: string }>();
  const viewProps = { game, onMenuClick, onHowToPlayClick, onLibraryClick };

  // Prioritize activeScreen override from engine state
  const activeScreenId = game.bgioState?.G?.activeScreen as ScreenId;
  const OverrideScreen = activeScreenId
    ? SCREEN_REGISTRY[activeScreenId]
    : null;

  if (OverrideScreen) {
    return <OverrideScreen {...viewProps} />;
  }

  switch (style) {
    case "alpha":
      return <AlphaView game={game} />;
    case "battle":
      return <BattleView game={game} />;
    case "pi":
      return <PiView game={game} />;
    case "chi":
      return <ChiView game={game} />;
    case "omega":
      return <OmegaView game={game} />;
    case "mmo":
      return <MmoView game={game} />;
    case "zen":
      return <ZenView {...viewProps} />;
    case PHASES.GAMEMASTER:
      return <GamemasterView game={game} />;
    case "spectator":
      return <SpectatorView {...viewProps} />;
    default:
      return <MmoView game={game} />;
  }
};

export default ConsoleViewDispatcher;
