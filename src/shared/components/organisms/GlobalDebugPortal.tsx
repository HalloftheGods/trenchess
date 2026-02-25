import React, { useState } from "react";
import { Bug, X } from "lucide-react";
import { ConsoleDebugPanel } from "@/client/console/components/organisms/ConsoleDebugPanel";
import { useConsoleLogic } from "@/shared/hooks/useConsoleLogic";
import type { GameStateHook } from "@/shared/types";

interface GlobalDebugPortalProps {
  game: GameStateHook;
}

/**
 * GlobalDebugPortal — A development-only debug sheet.
 * Fixed to the side of the screen, allowing real-time state inspection
 * across all views without cluttering the main UI.
 */
export const GlobalDebugPortal: React.FC<GlobalDebugPortalProps> = ({ game }) => {
  const [isOpen, setIsOpen] = useState(false);
  const logic = useConsoleLogic(game);

  // Only render in development
  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col items-start pointer-events-none">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-3 rounded-full shadow-2xl transition-all duration-300 pointer-events-auto
          ${isOpen ? "bg-amber-500 text-white -rotate-90" : "bg-slate-900/80 text-amber-500 backdrop-blur-md border border-white/10 hover:scale-110 hover:bg-slate-800"}
        `}
        title={isOpen ? "Close Debug" : "Open Debug Panel"}
      >
        {isOpen ? <X size={20} /> : <Bug size={20} />}
      </button>

      {/* Debug Sheet */}
      {isOpen && (
        <div 
          className="
            mt-4 w-80 max-h-[70vh] rounded-2xl overflow-hidden pointer-events-auto
            bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl
            animate-in slide-in-from-bottom-4 fade-in duration-300
          "
        >
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500 flex items-center gap-2">
              <Bug size={12} strokeWidth={3} />
              Diagnostic Portal
            </h3>
            <span className="text-[9px] font-bold text-slate-500 px-1.5 py-0.5 rounded bg-slate-800 border border-white/5">
              DEV MODE
            </span>
          </div>
          
          <div className="p-4 h-full overflow-y-auto custom-scrollbar">
            <ConsoleDebugPanel game={game} logic={logic} />
          </div>
        </div>
      )}
    </div>
  );
};
