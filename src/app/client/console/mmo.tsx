import React from "react";
import { BattlefieldLayout as TheBattlefield } from "@blueprints/layouts/BattlefieldLayout";
import {
  ConnectedBoard,
  ConsoleOverlays,
  ConsolePlayerColumn,
} from "./components";
import { TopActionBar } from "@/app/core/components/hud/templates";
import {
  useMatchState,
  MatchStateProvider,
  MatchHUDProvider,
} from "@/shared/context";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PHASES } from "@constants/game";
import { ROUTES } from "@/app/router/router";

const MmoViewContent: React.FC = () => {
  const game = useMatchState();
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
      gameBoard={<ConnectedBoard />}
      actionBar={<TopActionBar />}
      leftPanel={
        <ConsolePlayerColumn
          playerIds={["red", "green"]}
          isOnline={false}
          alignment="left"
        />
      }
      rightPanel={
        <ConsolePlayerColumn
          playerIds={["yellow", "blue"]}
          isOnline={false}
          alignment="right"
        />
      }
    >
      <ConsoleOverlays />
    </TheBattlefield>
  );
};

const MmoView: React.FC = () => (
  <MatchStateProvider>
    <MatchHUDProvider>
      <MmoViewContent />
    </MatchHUDProvider>
  </MatchStateProvider>
);

export default MmoView;
