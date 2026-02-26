import React from "react";
import MmoActionBar from "./MmoActionBar";
import { useRouteContext } from "@context";
import { useConsoleLogic } from "@/shared/hooks/interface/useConsoleLogic";
import type { GameStateHook } from "@/shared/types";

interface ConsoleActionBarProps {
  game: GameStateHook;
  logic: ReturnType<typeof useConsoleLogic>;
}

export const ConsoleActionBar: React.FC<ConsoleActionBarProps> = ({
  game,
  logic,
}) => {
  const ctx = useRouteContext();
  const { darkMode, pieceStyle, toggleTheme, togglePieceStyle } = ctx;

  return (
    <MmoActionBar
      game={game}
      logic={logic}
      darkMode={darkMode}
      pieceStyle={pieceStyle}
      toggleTheme={toggleTheme ?? (() => {})}
      togglePieceStyle={togglePieceStyle ?? (() => {})}
    />
  );
};
