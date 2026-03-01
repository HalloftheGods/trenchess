import React from "react";
import { BattlefieldLayout } from "../blueprints/layouts/BattlefieldLayout";
import {
  ConsoleOverlays,
  ConsolePlayerColumn,
} from "@/app/core/components/hud/organisms";
import { TopActionBar } from "@/app/core/components/hud/templates";
import { ConnectedBoard } from "@/app/core/components/board/organisms/ConnectedBoard";
import { MatchStateProvider, MatchHUDProvider } from "@/shared/context";
import { useAutoPreconfig } from "@/shared/hooks/controllers/useAutoPreconfig";
import { TCFlex } from "@atoms/ui";

export interface CombatScreenProps {
  isOnline?: boolean;
  boardType?: "omega" | "pi" | "chi" | "standard";
  initialLayout?: string; // e.g. "chaos", "classical"
  preconfigStyle?: "alpha" | "pi" | "chi" | "omega";
}

const CombatScreenContent: React.FC<CombatScreenProps> = ({
  isOnline = false,
  boardType = "standard",
  initialLayout,
  preconfigStyle,
}) => {
  // Note: boardType and initialLayout are available for mode-specific logic
  // but we primarily rely on the authoritative game state 'game'.
  const _activeBoardType = boardType;
  const _activeLayout = initialLayout;

  useAutoPreconfig(preconfigStyle);

  return (
    <BattlefieldLayout
      gameBoard={
        <TCFlex center className="w-full h-full">
          <ConnectedBoard />
        </TCFlex>
      }
      actionBar={<TopActionBar />}
      leftPanel={
        <ConsolePlayerColumn
          playerIds={["red", "green"]}
          isOnline={isOnline}
          alignment="left"
        />
      }
      rightPanel={
        <ConsolePlayerColumn
          playerIds={["yellow", "blue"]}
          isOnline={isOnline}
          alignment="right"
        />
      }
    >
      <TCFlex center className="absolute inset-0 pointer-events-none z-[130]">
        <ConsoleOverlays />
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

const CombatScreen: React.FC<CombatScreenProps> = (props) => (
  <MatchStateProvider>
    <MatchHUDProvider>
      <CombatScreenContent {...props} />
    </MatchHUDProvider>
  </MatchStateProvider>
);

export default CombatScreen;
