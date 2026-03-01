/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useGameState } from "@hooks/engine/useGameState";
import type { GameStateHook } from "@tc.types";

const MatchStateContext = createContext<GameStateHook | null>(null);

export const MatchStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const gameState = useGameState();

  return (
    <MatchStateContext.Provider value={gameState}>
      {children}
    </MatchStateContext.Provider>
  );
};

export const useMatchState = (): GameStateHook => {
  const context = useContext(MatchStateContext);
  if (!context) {
    throw new Error("useMatchState must be used within a MatchStateProvider");
  }
  return context;
};
