import React from "react";
import MmoActionBar from "./MmoActionBar";
import { useRouteContext } from "@context";
import { useConsoleLogic } from "../../../../shared/hooks/useConsoleLogic";
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
      gameState={game.gameState}
      darkMode={darkMode}
      pieceStyle={pieceStyle}
      toggleTheme={toggleTheme ?? (() => {})}
      togglePieceStyle={togglePieceStyle ?? (() => {})}
      getIcon={game.getIcon}
      turn={game.turn}
      activePlayers={game.activePlayers}
      inventory={game.inventory}
      placementPiece={game.placementPiece}
      placementTerrain={game.placementTerrain}
      setPlacementPiece={game.setPlacementPiece}
      setPlacementTerrain={game.setPlacementTerrain}
      setSetupMode={game.setSetupMode}
      placedCount={logic.placedCount}
      maxPlacement={logic.maxPlacement}
      randomizeTerrain={game.randomizeTerrain}
      randomizeUnits={game.randomizeUnits}
      setClassicalFormation={game.setClassicalFormation}
      applyChiGarden={game.applyChiGarden}
      resetToOmega={game.resetToOmega}
    />
  );
};
