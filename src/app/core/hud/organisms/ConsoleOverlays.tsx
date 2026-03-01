import React from "react";
import { GameStartOverlay } from "../atoms";
import { RulesOverlay } from "./RulesOverlay";
import { useConsoleLogic } from "@/shared/hooks/interface/useConsoleLogic";
import { PHASES } from "@constants/game";
import type { GameStateHook } from "@tc.types";

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
            if (game.gameState === PHASES.MAIN) {
              game.setPhase(PHASES.COMBAT);
            } else {
              game.ready();
              game.startGame();
            }
          }}
        />
      )}

      <RulesOverlay />

      {children}
    </>
  );
};
