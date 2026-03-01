import React, { useState } from "react";
import { AccordionSection, JsonTreeViewer } from "@/shared/components/atoms";
import { TCFlex, TCHeading, TCText } from "@/shared/components/atoms/ui";

// My New Debug System
import DebugPlayerSection from "./DebugPlayerSection";
import DebugGameSection from "./DebugGameSection";
import DebugMultiplayerSection from "./DebugMultiplayerSection";
import DebugInventorySection from "./DebugInventorySection";

import type { GameStateHook } from "@tc.types";
import type { MultiplayerPlayer } from "@tc.types";

interface OnlineInfo {
  roomId: string | null;
  playerIndex: number | null;
  isHost: boolean;
  isConnected: boolean;
  players: MultiplayerPlayer[];
  serverUrl: string;
}

interface GameStateDebugProps {
  game: GameStateHook;
  onlineInfo?: OnlineInfo;
  isSheet?: boolean;
  placedCount?: number;
  maxPlacement?: number;
  inventoryCounts?: Record<string, number>;
  terrainInventoryCounts?: Record<string, number>;
}

/**
 * GameStateDebug (Organism)
 * Refined developer diagnostic tool designed for ergonomic inspection and real-time state manipulation.
 */
const GameStateDebug: React.FC<GameStateDebugProps> = ({
  game,
  onlineInfo,
  isSheet = false,
  inventoryCounts = {},
  terrainInventoryCounts = {},
}) => {
  const { getPlayerDisplayName, bgioState } = game;

  const isOnlineMatch = !!onlineInfo?.roomId;
  const initialSection = isOnlineMatch ? "online" : "game";
  const [activeSection, setActiveSection] = useState<string | null>(
    initialSection,
  );

  const toggleSection = (section: string) => {
    setActiveSection((current) => (current === section ? null : section));
  };

  const containerClasses = isSheet
    ? "h-full flex flex-col text-sm font-mono p-4 bg-slate-950/40 backdrop-blur-xl border-r border-white/5 overflow-hidden"
    : "bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 text-sm font-mono shadow-2xl max-h-[90vh] w-80 flex flex-col transition-all duration-500 overflow-hidden";

  return (
    <div className={containerClasses}>
      {!isSheet && (
        <TCFlex align="center" gap={3} className="mb-6 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <TCHeading
            level={3}
            variant="plain"
            className="text-[11px] tracking-[0.3em]"
          >
            Engine Terminal
          </TCHeading>
        </TCFlex>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1 -mr-1">
        {isOnlineMatch && onlineInfo && (
          <DebugMultiplayerSection
            isOpen={activeSection === "online"}
            onToggle={() => toggleSection("online")}
            onlineInfo={onlineInfo}
            bgioState={bgioState ?? null}
            getPlayerDisplayName={getPlayerDisplayName}
          />
        )}

        <DebugPlayerSection
          isOpen={activeSection === "players"}
          onToggle={() => toggleSection("players")}
          game={game}
        />

        <DebugGameSection
          isOpen={activeSection === "game"}
          onToggle={() => toggleSection("game")}
          game={game}
          placedCount={0} // These should probably be derived in useConsoleLogic and passed to GameStateHook or similar
          maxPlacement={0}
        />

        <DebugInventorySection
          title="Unit Stock"
          isOpen={activeSection === "units"}
          onToggle={() => toggleSection("units")}
          inventory={inventoryCounts}
          colorClass="text-emerald-400"
        />

        <DebugInventorySection
          title="Tile Stock"
          isOpen={activeSection === "terrain"}
          onToggle={() => toggleSection("terrain")}
          inventory={terrainInventoryCounts}
          colorClass="text-blue-400"
        />

        <AccordionSection
          title="Raw Engine (G)"
          isOpen={activeSection === "bgio-g"}
          onToggle={() => toggleSection("bgio-g")}
        >
          <div className="py-2 bg-black/20 rounded-lg mt-1 px-1">
            <JsonTreeViewer
              data={
                (bgioState?.G as unknown as Record<string, unknown>) ?? null
              }
            />
          </div>
        </AccordionSection>

        <AccordionSection
          title="Context (Ctx)"
          isOpen={activeSection === "bgio-ctx"}
          onToggle={() => toggleSection("bgio-ctx")}
        >
          <div className="py-2 bg-black/20 rounded-lg mt-1 px-1">
            <JsonTreeViewer
              data={
                (bgioState?.ctx as unknown as Record<string, unknown>) ?? null
              }
            />
          </div>
        </AccordionSection>

        <div className="pt-4 mt-4 border-t border-white/5">
          <button
            onClick={() => game.setShowRules(true)}
            className="w-full py-3 px-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-white/5 active:scale-95"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            Open Game Rules
          </button>
        </div>
      </div>

      {!isSheet && (
        <TCFlex
          justify="between"
          align="center"
          className="mt-6 pt-4 border-t border-white/5 opacity-30"
        >
          <TCText
            variant="muted"
            className="text-[10px] font-black uppercase tracking-widest"
          >
            Core // OS_DEB_v2.0
          </TCText>
          <TCText
            variant="muted"
            className="text-[10px] font-black uppercase tracking-widest"
          >
            Level 01
          </TCText>
        </TCFlex>
      )}
    </div>
  );
};

export default GameStateDebug;
