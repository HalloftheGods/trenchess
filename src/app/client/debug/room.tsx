import React, { useEffect } from "react";
import { BattlefieldLayout } from "@/app/core/blueprints/layouts/BattlefieldLayout";
import {
  ConsoleOverlays,
  ConsolePlayerColumn,
} from "@/app/core/components/hud/organisms";
import { ConnectedBoard } from "@/app/core/components/board/organisms/ConnectedBoard";
import {
  useMatchState,
  MatchStateProvider,
  MatchHUDProvider,
} from "@/shared/context";
import { TCFlex } from "@atoms/ui";
import { PHASES } from "@constants/game";

/**
 * DebugRoomView — A dedicated room for testing mechanics.
 * Starts in Combat phase with a randomized setup.
 */
const DebugRoomViewContent: React.FC = () => {
  const game = useMatchState();
  const {
    gameState,
    initGameWithPreset,
    multiplayer,
    setPhase,
    authorizeMasterProtocol,
    ready,
    setTurn,
    activePlayers,
  } = game;

  const initRef = React.useRef(false);

  useEffect(() => {
    // Only initialize if we are in the GENESIS phase and haven't initialized yet
    const isInitialState =
      !multiplayer.roomId && gameState === PHASES.GENESIS && !initRef.current;

    if (isInitialState) {
      initRef.current = true;
      // 1. Authorize GM moves
      authorizeMasterProtocol?.();

      // 2. Initialize with a 2-player mode and 'quick' preset
      initGameWithPreset("2p-ns", "quick");

      // 3. Force everyone to be ready and jump to combat
      const timer = setTimeout(() => {
        // Call ready for all possible players to trigger mainPhaseEndIf
        activePlayers.forEach((pid) => ready?.(pid));

        // Also explicitly set phase just in case
        setPhase?.(PHASES.COMBAT);

        // Ensure it's red's turn to start
        setTurn?.("red");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    gameState,
    multiplayer.roomId,
    initGameWithPreset,
    setPhase,
    authorizeMasterProtocol,
    ready,
    activePlayers,
    setTurn,
  ]);

  const handleForceCombat = () => {
    authorizeMasterProtocol?.();
    activePlayers.forEach((pid) => ready?.(pid));
    setPhase?.(PHASES.COMBAT);
    setTurn?.("red");
  };

  return (
    <div className="w-full h-full bg-slate-950 relative">
      {/* Debug Controls Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] flex gap-4">
        <button
          onClick={handleForceCombat}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md text-xs font-bold shadow-lg transition-colors border border-red-400/50"
        >
          FORCE COMBAT PHASE
        </button>
        <button
          onClick={() => setTurn?.("red")}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-bold shadow-lg transition-colors border border-slate-600"
        >
          BE RED
        </button>
        <button
          onClick={() => setTurn?.("blue")}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-bold shadow-lg transition-colors border border-slate-600"
        >
          BE BLUE
        </button>
      </div>

      <BattlefieldLayout
        gameBoard={
          <TCFlex center className="w-full h-full">
            <ConnectedBoard />
          </TCFlex>
        }
        actionBar={null}
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
    </div>
  );
};

const DebugRoomView: React.FC = () => (
  <MatchStateProvider>
    <MatchHUDProvider>
      <DebugRoomViewContent />
    </MatchHUDProvider>
  </MatchStateProvider>
);

export default DebugRoomView;
