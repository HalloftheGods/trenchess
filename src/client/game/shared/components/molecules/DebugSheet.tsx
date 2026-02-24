import React, { useState } from "react";
import type { ReactNode } from "react";
import { Bug, X } from "lucide-react";

interface DebugSheetProps {
  debugPanel: ReactNode;
}

/**
 * DebugSheet — a slide-out drawer triggered by a tab at the bottom left.
 */
export const DebugSheet: React.FC<DebugSheetProps> = ({ debugPanel }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  if (!debugPanel) return null;

  return (
    <>
      {/* Debug FAB Trigger (Bottom Left) */}
      <button
        onClick={toggle}
        className={`fixed bottom-6 left-6 z-[130] flex items-center justify-center w-12 h-12 bg-slate-800 dark:bg-slate-900 text-slate-400 hover:text-amber-400 border border-slate-700 dark:border-slate-800 rounded-full shadow-2xl transition-all duration-300 group cursor-pointer ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        title="Toggle Debug Menu"
      >
        <Bug size={20} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Debug Sheet */}
      <div
        className={`fixed top-0 left-0 h-full w-[350px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/[0.05] shadow-2xl z-[140] transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sheet Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Bug size={16} className="text-amber-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Diagnostics
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sheet Content */}
        <div className="flex-1 overflow-hidden p-4">
          {debugPanel}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-[135] transition-opacity"
        />
      )}
    </>
  );
};
