import React from "react";
import { GameStartOverlay } from "../index";
import { useConsoleLogic } from "../../../../shared/hooks/useConsoleLogic";
import type { GameStateHook } from "@/shared/types";

interface ConsoleOverlaysProps {
  game: GameStateHook;
  logic: ReturnType<typeof useConsoleLogic>;
  children?: React.ReactNode;
}

export const ConsoleOverlays: React.FC<ConsoleOverlaysProps> = ({
  game,
  logic,
  children,
}) => {
  return (
    <>
      {logic.showOverlay && (
        <GameStartOverlay
          isOnline={logic.isOnline}
          isLocked={logic.isOnline ? logic.isMyPlayerLocked : false}
          onLockIn={() => game.ready()}
          onStart={() => {
            game.ready();
            game.startGame();
          }}
        />
      )}
      {children}
    </>
  );
};
