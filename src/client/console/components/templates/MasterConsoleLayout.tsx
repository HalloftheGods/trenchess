import React from "react";
import type { ReactNode } from "react";

interface MasterConsoleLayoutProps {
  actionBar: ReactNode;
  protocolPanel: ReactNode;
  gameBoard: ReactNode;
  sidePanel: ReactNode;
  debugPanel: ReactNode;
  terminal: ReactNode;
}

/**
 * MasterConsoleLayout — A high-density dashboard for full engine control.
 * Utilizing full width for a professional Command Center experience.
 */
export const MasterConsoleLayout: React.FC<MasterConsoleLayoutProps> = ({
  actionBar,
  protocolPanel,
  gameBoard,
  sidePanel,
  debugPanel,
  terminal,
}) => {
  return (
    <div className="h-screen bg-[#020617] text-slate-100 flex flex-col overflow-hidden relative font-sans">
      {/* 1. Global Action Bar */}
      <div className="z-50 shrink-0">
        {actionBar}
      </div>

      {/* 2. Main 4-Column Control Center */}
      <div className="flex-1 flex gap-4 p-4 pt-20 overflow-hidden relative z-10">
        
        {/* Col 1: Protocol Editor (Rules) */}
        <div className="w-[400px] flex flex-col shrink-0 overflow-y-auto custom-scrollbar bg-slate-900/20 rounded-3xl border border-white/5 shadow-2xl">
          {protocolPanel}
        </div>

        {/* Col 2: The Battle Ground (Board) */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-0 bg-slate-900/10 rounded-3xl border border-white/5 relative overflow-hidden">
           <div className="w-full h-full max-w-[800px] aspect-square p-4 flex items-center justify-center">
              {gameBoard}
           </div>
        </div>

        {/* Col 3: Side Metrics & Players */}
        <div className="w-[320px] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          {sidePanel}
        </div>

        {/* Col 4: Deep Debugger */}
        <div className="w-[320px] flex flex-col shrink-0 overflow-y-auto custom-scrollbar bg-slate-950/40 border-l border-white/5">
          {debugPanel}
        </div>
      </div>

      {/* 3. Persistent Command Terminal (Bottom Tray) */}
      <div className="h-48 shrink-0 bg-black/60 backdrop-blur-2xl border-t border-brand-blue/20 z-20">
        {terminal}
      </div>

      {/* Ambient Background FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>
    </div>
  );
};
