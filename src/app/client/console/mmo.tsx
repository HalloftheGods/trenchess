import React from "react";
import { BattlefieldLayout as TheBattlefield } from "@blueprints/layouts/BattlefieldLayout";
import {
  ConnectedBoard,
  ConsoleOverlays,
  ConsolePlayerColumn,
} from "./components";
import { TopActionBar } from "@/app/core/hud/templates";
import { useConsoleLogic } from "@hooks/interface/useConsoleLogic";
import { useGameState } from "@hooks/engine/useGameState";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PHASES } from "@constants/game";
import { ROUTES } from "@/app/router/router";

const MmoView: React.FC = () => {
  const game = useGameState();
  const logic = useConsoleLogic(game);
  const location = useLocation();
  const { roomId } = useParams<{ roomId?: string }>();

  const {
    gameState,
    multiplayer,
    initFromSeed,
    initGameWithPreset,
    startGame,
  } = game;

  // Handle joining game from URL roomId
  useEffect(() => {
    const isSpecialMode =
      roomId === "mmo" || roomId === PHASES.GAMEMASTER || roomId === "board";
    const shouldJoin =
      roomId && !isSpecialMode && multiplayer.roomId !== roomId;

    if (shouldJoin) {
      multiplayer.joinGame(roomId);
    }
  }, [roomId, multiplayer]);

  // Handle game initialization for MMO
  useEffect(() => {
    if (location.pathname === ROUTES.console.mmo) {
      if (gameState === PHASES.MENU) {
        const urlParams = new URLSearchParams(window.location.search);
        const seed = urlParams.get("seed");
        if (seed) initFromSeed(seed);
        else initGameWithPreset("2p-ns", null);

        const timer = setTimeout(() => startGame(), 100);
        return () => clearTimeout(timer);
      }
    }
  }, [
    gameState,
    location.pathname,
    initFromSeed,
    initGameWithPreset,
    startGame,
  ]);

  return (
    <TheBattlefield
      gameBoard={<ConnectedBoard game={game} />}
      actionBar={<TopActionBar game={game} logic={logic} />}
      leftPanel={
        <ConsolePlayerColumn
          game={game}
          playerIds={["red", "green"]}
          teamPowerStats={logic.teamPowerStats}
          isOnline={logic.isOnline}
          alignment="left"
        />
      }
      rightPanel={
        <ConsolePlayerColumn
          game={game}
          playerIds={["yellow", "blue"]}
          teamPowerStats={logic.teamPowerStats}
          isOnline={logic.isOnline}
          alignment="right"
        />
      }
    >
      <ConsoleOverlays game={game} logic={logic} />
    </TheBattlefield>
  );
};

export default MmoView;
