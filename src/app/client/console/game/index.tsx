import { getPath } from "@/app/router/router";
import React from "react";
import { useParams } from "react-router-dom";
import AlphaView from "./alpha";
import BattleView from "./battle";
import PiView from "./pi";
import ChiView from "./chi";
import OmegaView from "./omega";
import PlayView from "./play";
import MmoView from "../mmo";
import ZenView from "../design/zen";
import GamemasterView from "../gamemaster";
import SpectatorView from "../spectate";
import { useGameState } from "@hooks/engine/useGameState";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { PHASES } from "@constants/game";

/**
 * ConsoleViewDispatcher — Picks the correct playstyle view based on the :style route param.
 */
import { SCREEN_REGISTRY } from "@/app/core/screens/registry";
import type { ScreenId } from "@/app/core/screens/registry";

const ConsoleViewDispatcher: React.FC = () => {
  const game = useGameState();
  const navigate = useNavigate();
  const location = useLocation();
  const { style } = useParams<{ style: string }>();

  const { gameState, initGameWithPreset, startGame } = game;

  // 1. Redirect to home if on base game route and game hasn't started (MENU phase)
  useEffect(() => {
    const isBaseGameRoute = location.pathname === getPath("console.index");
    const isNotMmo = !location.pathname.startsWith(
      getPath("console.mmo") as string,
    );
    const isNotOnlineMatch = !location.pathname.includes("/match/");

    if (
      isBaseGameRoute &&
      isNotMmo &&
      isNotOnlineMatch &&
      gameState === PHASES.MENU
    ) {
      navigate(getPath("home"));
    }
  }, [location.pathname, gameState, navigate]);

  // 2. Zen/Gamemaster specific initialization
  useEffect(() => {
    const isZenOrMaster =
      location.pathname === (getPath("zen") as string) ||
      location.pathname === getPath("console.gamemaster");

    if (isZenOrMaster && gameState === PHASES.MENU) {
      initGameWithPreset("4p", "zen-garden");
      const timer = setTimeout(() => startGame(), 100);
      return () => clearTimeout(timer);
    }
  }, [gameState, location.pathname, initGameWithPreset, startGame]);

  // Prioritize activeScreen override from engine state
  const activeScreenId = game.bgioState?.G?.activeScreen as ScreenId;
  const OverrideScreen = activeScreenId
    ? SCREEN_REGISTRY[activeScreenId]
    : null;

  if (OverrideScreen) {
    console.log(`[DISPATCHER] Rendering override screen: ${activeScreenId}`);
    return <OverrideScreen />;
  }

  console.log(`[DISPATCHER] Style: ${style}. Phase: ${gameState}`);

  switch (style) {
    case "alpha":
      return <AlphaView />;
    case "battle":
      return <BattleView />;
    case "pi":
      return <PiView />;
    case "chi":
      return <ChiView />;
    case "omega":
      return <OmegaView />;
    case "play":
      return <PlayView />;
    case "mmo":
      return <MmoView />;
    case "zen":
      return <ZenView />;
    case PHASES.GAMEMASTER:
      return <GamemasterView />;
    case "spectator":
      return <SpectatorView />;
    default:
      return <MmoView />;
  }
};

export default ConsoleViewDispatcher;
