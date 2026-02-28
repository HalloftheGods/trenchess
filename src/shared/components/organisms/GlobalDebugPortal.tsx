import React, { useState } from "react";
import { Bug, X } from "lucide-react";
import { ConsoleDebugPanel } from "@/app/client/console/components";
import { useConsoleLogic } from "@/shared/hooks/interface/useConsoleLogic";
import type { GameStateHook } from "@tc.types";

interface GlobalDebugPortalProps {
  game: GameStateHook;
}

/**
 * GlobalDebugPortal — A development-only debug sheet.
 * Fixed to the side of the screen, allowing real-time state inspection
 * across all views without cluttering the main UI.
 */
export const GlobalDebugPortal: React.FC<GlobalDebugPortalProps> = ({
  game,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const logic = useConsoleLogic(game);

  // Only render in development
  if (!import.meta.env.DEV) return null;

  const togglePanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button Container */}
      <div className="fixed bottom-6 left-6 z-[10000] pointer-events-none">
        <button
          onClick={togglePanel}
          className={`
            p-3.5 rounded-full shadow-2xl transition-all duration-500 pointer-events-auto
            flex items-center justify-center outline-none
            ${
              isOpen
                ? "bg-amber-600 text-white translate-x-[372px] rotate-0 shadow-amber-500/30 scale-100"
                : "bg-slate-900/90 text-amber-500 backdrop-blur-md border border-white/10 hover:scale-110 hover:bg-slate-800 rotate-0 shadow-black/60"
            }
          `}
          title={isOpen ? "Close Debug" : "Open Debug Panel"}
        >
          {isOpen ? (
            <X
              size={22}
              strokeWidth={2.5}
              className="animate-in fade-in zoom-in duration-300"
            />
          ) : (
            <Bug size={22} strokeWidth={2} className="hover:animate-pulse" />
          )}
        </button>
      </div>

      {/* Debug Sheet Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-[9999] w-96 max-w-[95vw]
          bg-slate-950/98 backdrop-blur-3xl border-r border-white/10 
          shadow-[25px_0_80px_-20px_rgba(0,0,0,0.8)]
          transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-amber-500 flex items-center gap-2">
                <Bug
                  size={14}
                  strokeWidth={3}
                  className={isOpen ? "animate-pulse" : ""}
                />
                Diagnostic Portal
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] leading-none uppercase">
                  Core Diagnostics
                </p>
                <div className="h-px w-6 bg-white/5" />
                <p className="text-[9px] text-amber-600/60 font-mono font-bold">
                  MODE.ACTIVE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 tracking-tighter uppercase mb-0.5">
                  Build Hash
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900/50 px-1.5 py-0.5 rounded border border-white/5">
                  TRNC-0225
                </span>
              </div>
            </div>
          </div>

          {/* Main Inspection View */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 pb-32">
            <div className="pointer-events-auto">
              <ConsoleDebugPanel game={game} logic={logic} />
            </div>
          </div>

          {/* System Status Footer */}
          <div className="px-6 py-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">
                System Stable
              </p>
            </div>
            <p className="text-[9px] text-slate-700 font-black uppercase tracking-tighter">
              // Trenchess Tactical Engine //
            </p>
          </div>
        </div>
      </div>

      {/* Persistent Backdrop */}
      <div
        className={`
          fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-[9998] cursor-pointer
          transition-opacity duration-500 ease-in-out
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={closePanel}
      />
    </>
  );
};
