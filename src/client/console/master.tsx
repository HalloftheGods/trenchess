import React, { useState } from "react";
import { MasterConsoleLayout } from "./components/templates/MasterConsoleLayout";
import {
  ConsoleActionBar,
  ConsoleGameBoard,
  ConsolePlayerColumn,
} from "./components";
import { ProtocolEditor } from "@/client/dev/components/ProtocolEditor";
import { GameStateDebug } from "./components/debug/molecules/GameStateDebug";
import { TerminalHistory } from "./components/terminal/molecules/TerminalHistory";
import { TerminalInput } from "./components/terminal/atoms/TerminalInput";
import { useRouteContext } from "@context";
import { useConsoleLogic } from "@hooks/interface/useConsoleLogic";
import { useTerminal } from "@/shared/context/TerminalContext";
import type { GameStateHook } from "@/shared/types";
import { TCFlex, TCText, TCStack } from "@/shared/components/atoms/ui";
import { Terminal as TerminalIcon, Activity } from "lucide-react";

interface MasterConsoleViewProps {
  game: GameStateHook;
}

const MasterConsoleView: React.FC<MasterConsoleViewProps> = ({ game }) => {
  const logic = useConsoleLogic(game);
  const { history, addLog } = useTerminal();
  const [cmdInput, setInput] = useState("");

  const handleNextCommander = () => {
    const currentIndex = game.activePlayers.indexOf(game.turn);
    const nextIndex = (currentIndex + 1) % game.activePlayers.length;
    game.setTurn?.(game.activePlayers[nextIndex]);
  };

  const handleFinishDeployment = () => {
    game.finishGamemaster();
  };

  const handleCommandSubmit = () => {
    if (!cmdInput.trim()) return;
    game.dispatch(cmdInput.trim());
    setInput("");
  };

  return (
    <MasterConsoleLayout
      actionBar={<ConsoleActionBar game={game} logic={logic} />}
      protocolPanel={
        <div className="h-full bg-slate-900/40 custom-scrollbar overflow-y-auto">
           <ProtocolEditor game={game} />
        </div>
      }
      gameBoard={<ConsoleGameBoard game={game} />}
      sidePanel={
        <div className="p-4 space-y-6 h-full flex flex-col">
           <TCStack gap={2} className="px-2">
              <TCFlex align="center" gap={3} className="text-emerald-500/60 mb-1">
                <Activity size={14} />
                <TCText variant="muted" className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Realtime // Metrics
                </TCText>
              </TCFlex>
              <TCText className="text-xl font-black text-white tracking-tight">Fleet Command</TCText>
           </TCStack>

           <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-4">
              <ConsolePlayerColumn
                game={game}
                playerIds={game.activePlayers}
                teamPowerStats={logic.teamPowerStats}
                isOnline={false}
                alignment="left"
                onNextCommander={handleNextCommander}
                onFinishDeployment={handleFinishDeployment}
              />
           </div>
        </div>
      }
      debugPanel={
        <GameStateDebug 
          game={game} 
          onlineInfo={logic.onlineInfo}
          placedCount={logic.placedCount}
          maxPlacement={logic.maxPlacement}
          inventoryCounts={logic.inventoryCounts}
          terrainInventoryCounts={logic.terrainInventoryCounts}
          isSheet={true} 
        />
      }
      terminal={
        <div className="h-full flex flex-col p-4 font-mono">
          <TCFlex align="center" justify="between" className="mb-3 border-b border-white/5 pb-2">
            <TCFlex align="center" gap={3}>
              <TerminalIcon size={14} className="text-brand-blue" />
              <TCText className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                Engine Output Stream
              </TCText>
            </TCFlex>
            <TCText className="text-[10px] font-bold text-slate-700 tracking-widest">
              BUFFER_v2.0.4 // STABLE
            </TCText>
          </TCFlex>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 bg-black/20 rounded-lg p-3 border border-white/5">
            <TerminalHistory history={history} />
          </div>

          <div className="bg-slate-900/60 rounded-xl px-4 py-2 border border-white/10 shadow-inner">
            <TerminalInput 
              value={cmdInput} 
              onChange={setInput} 
              onSubmit={handleCommandSubmit}
              autoFocus={false}
            />
          </div>
        </div>
      }
    />
  );
};

export default MasterConsoleView;
