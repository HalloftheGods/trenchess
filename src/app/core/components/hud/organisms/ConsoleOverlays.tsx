import React from "react";
import { GameStartOverlay } from "../atoms";
import { RulesOverlay } from "./RulesOverlay";
import { useMatchState, useMatchHUD } from "@/shared/context";
import { PHASES } from "@constants/game";

interface ConsoleOverlaysProps {
  children?: React.ReactNode;
}

export const ConsoleOverlays: React.FC<ConsoleOverlaysProps> = ({
  children,
}) => {
  const game = useMatchState();
  const logic = useMatchHUD();
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
