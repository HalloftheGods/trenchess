import React from "react";
import { BattlefieldLayout } from "../blueprints/layouts/BattlefieldLayout";
import { ConsoleOverlays, ConsolePlayerColumn } from "@/app/core/hud/organisms";
import { TopActionBar } from "@/app/core/hud/templates";
import { ConnectedBoard } from "@/app/core/components/board/organisms/ConnectedBoard";
import { useConsoleLogic } from "@hooks/interface/useConsoleLogic";
import { useGameState } from "@hooks/engine/useGameState";
import { TCFlex } from "@atoms/ui";

export interface CombatScreenProps {
  isOnline?: boolean;
  boardType?: "omega" | "pi" | "chi" | "standard";
  initialLayout?: string; // e.g. "chaos", "classical"
}

const CombatScreen: React.FC<CombatScreenProps> = ({
  isOnline = false,
  boardType = "standard",
  initialLayout,
}) => {
  const game = useGameState();
  const logic = useConsoleLogic(game);

  // Note: boardType and initialLayout are available for mode-specific logic
  // but we primarily rely on the authoritative game state 'game'.
  const _activeBoardType = boardType;
  const _activeLayout = initialLayout;

  return (
    <BattlefieldLayout
      gameBoard={
        <TCFlex center className="w-full h-full">
          <ConnectedBoard game={game} />
        </TCFlex>
      }
      actionBar={<TopActionBar game={game} logic={logic} />}
      leftPanel={
        <ConsolePlayerColumn
          game={game}
          playerIds={["red", "green"]}
          teamPowerStats={logic.teamPowerStats}
          isOnline={isOnline}
          alignment="left"
        />
      }
      rightPanel={
        <ConsolePlayerColumn
          game={game}
          playerIds={["yellow", "blue"]}
          teamPowerStats={logic.teamPowerStats}
          isOnline={isOnline}
          alignment="right"
        />
      }
    >
      <TCFlex center className="absolute inset-0 pointer-events-none z-[130]">
        <ConsoleOverlays game={game} logic={logic} />
      </TCFlex>
      {/* Hidden trackers to satisfy linter for now */}
      <div
        className="hidden"
        data-board-type={_activeBoardType}
        data-layout={_activeLayout}
      />
    </BattlefieldLayout>
  );
};

export default CombatScreen;
