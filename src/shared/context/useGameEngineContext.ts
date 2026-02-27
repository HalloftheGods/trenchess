import { useContext } from "react";
import { GameContext } from "./GameContextDef";

export const useGameEngineContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameEngineContext must be used within a GameProvider");
  }
  return context;
};
