import React from "react";
import { GameStateDebug } from "../molecules";
import { useConsoleLogic } from "@/shared/hooks/interface/useConsoleLogic";
import type { GameStateHook } from "@tc.types";

interface ConsoleDebugPanelProps {
  game: GameStateHook;
  logic: ReturnType<typeof useConsoleLogic>;
}

export const ConsoleDebugPanel: React.FC<ConsoleDebugPanelProps> = ({
  game,
  logic,
}) => {
  return (
    <GameStateDebug
      game={game}
      onlineInfo={logic.onlineInfo}
      placedCount={logic.placedCount}
      maxPlacement={logic.maxPlacement}
      inventoryCounts={logic.inventoryCounts}
      terrainInventoryCounts={logic.terrainInventoryCounts}
      isSheet={true}
    />
  );
};
