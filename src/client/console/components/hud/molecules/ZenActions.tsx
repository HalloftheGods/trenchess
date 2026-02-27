import React from "react";
import { Copy, Save } from "lucide-react";

import { PHASES } from "@constants/game";
import type { GameState } from "@/shared/types/game";

interface ZenActionsProps {
  mirrorBoard?: () => void;
  handleSave: () => void;
  copied: boolean;
  setGameState: (state: GameState) => void;
  handleClearBoard: () => void;
}

export const ZenActions: React.FC<ZenActionsProps> = ({
  mirrorBoard,
  handleSave,
  copied,
  setGameState,
  handleClearBoard,
}) => {
  return (
    <div className="space-y-3">
      <button
        onClick={mirrorBoard}
        className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-900/20 hover:scale-[1.02] active:scale-95 mb-1"
      >
        <Copy size={18} /> Mirror to Opposite
      </button>
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${copied ? "bg-emerald-600 text-white shadow-emerald-500/25" : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:scale-[1.02]"}`}
      >
        {copied ? (
          "Link Copied!"
        ) : (
          <>
            <Save size={18} /> Save & Share
          </>
        )}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setGameState(PHASES.MENU)}
          className="py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 border border-transparent transition-all hover:text-slate-700 dark:hover:text-slate-300"
        >
          Exit Editor
        </button>
        <button
          onClick={handleClearBoard}
          className="py-3 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-2xl font-black text-[10px] uppercase tracking-widest text-brand-red dark:text-brand-red border border-red-200 dark:border-brand-red/20 transition-all"
        >
          Clear Board
        </button>
      </div>
    </div>
  );
};
