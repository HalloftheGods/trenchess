import React, { useEffect } from "react";
import { BattlefieldLayout } from "@/app/core/blueprints/layouts/BattlefieldLayout";
import { ConsoleOverlays, ConsolePlayerColumn } from "@/app/core/hud/organisms";
import { ConnectedBoard } from "@/app/core/components/board/organisms/ConnectedBoard";
import {
  useMatchState,
  MatchStateProvider,
  MatchHUDProvider,
} from "@/shared/context";
import { TCFlex } from "@atoms/ui";
import { PHASES } from "@constants/game";

/**
 * PlayView — The game in action (Combat Phase).
 * A minimal, immersive view without the top action bar.
 */
const PlayViewContent: React.FC = () => {
  const game = useMatchState();
  const { gameState, initGameWithPreset, multiplayer } = game;

  // Auto-start a random game if reached from MENU phase (standalone entry)
  useEffect(() => {
    const isLocalMenu = !multiplayer.roomId && gameState === PHASES.MENU;

    if (isLocalMenu) {
      const modes = ["pi", "chi", "alpha"];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];

      // Map 'alpha', 'pi', 'chi' to presets/modes
      if (randomMode === "pi") {
        initGameWithPreset("2p-ns", "classic");
      } else if (randomMode === "chi") {
        initGameWithPreset("4p", "terrainiffic");
      } else {
        // alpha / standard
        initGameWithPreset("2p-ns", "quick");
      }

      // Explicitly transition to COMBAT phase for "Play" mode
      const timer = setTimeout(() => {
        game.setPhase(PHASES.COMBAT);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [gameState, multiplayer.roomId, initGameWithPreset, game]);

  return (
    <BattlefieldLayout
      gameBoard={
        <TCFlex center className="w-full h-full">
          <ConnectedBoard />
        </TCFlex>
      }
      actionBar={null} // Minimalist view, no action bar
      leftPanel={
        <ConsolePlayerColumn
          playerIds={["red", "green"]}
          isOnline={!!multiplayer.roomId}
          alignment="left"
        />
      }
      rightPanel={
        <ConsolePlayerColumn
          playerIds={["yellow", "blue"]}
          isOnline={!!multiplayer.roomId}
          alignment="right"
        />
      }
    >
      <TCFlex center className="absolute inset-0 pointer-events-none z-[130]">
        <ConsoleOverlays />
      </TCFlex>
    </BattlefieldLayout>
  );
};

const PlayView: React.FC = () => (
  <MatchStateProvider>
    <MatchHUDProvider>
      <PlayViewContent />
    </MatchHUDProvider>
  </MatchStateProvider>
);

export default PlayView;
