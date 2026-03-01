/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useConsoleLogic } from "@hooks/interface/useConsoleLogic";
import { useMatchState } from "./MatchStateContext";

type MatchHUDHook = ReturnType<typeof useConsoleLogic>;

const MatchHUDContext = createContext<MatchHUDHook | null>(null);

export const MatchHUDProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const matchState = useMatchState();
  const hudState = useConsoleLogic(matchState);

  return (
    <MatchHUDContext.Provider value={hudState}>
      {children}
    </MatchHUDContext.Provider>
  );
};

export const useMatchHUD = (): MatchHUDHook => {
  const context = useContext(MatchHUDContext);
  if (!context) {
    throw new Error("useMatchHUD must be used within a MatchHUDProvider");
  }
  return context;
};
