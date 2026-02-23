import React from "react";
import { Shuffle, LayoutGrid, Bomb, Mountain } from "lucide-react";
import type { SetupMode } from "@/core/types/game";

interface DeploymentActionButtonsProps {
  setupMode: SetupMode;
  randomizeTerrain: () => void;
  generateElementalTerrain?: () => void;
  resetTerrain?: () => void;
  randomizeUnits: () => void;
  setClassicalFormation: () => void;
  resetUnits?: () => void;
}

export const DeploymentActionButtons: React.FC<
  DeploymentActionButtonsProps
> = ({
  setupMode,
  randomizeTerrain,
  generateElementalTerrain,
  resetTerrain,
  randomizeUnits,
  setClassicalFormation,
  resetUnits,
}) => {
  return (
    <div className="space-y-2 mt-6">
      {setupMode === "terrain" && (
        <div className="flex gap-2">
          <button
            onClick={randomizeTerrain}
            className="flex-1 py-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 hover:border-emerald-400/50 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-emerald-400 hover:text-emerald-300 hover:scale-[1.02] active:scale-95"
          >
            <Shuffle size={14} /> Random
          </button>
          {generateElementalTerrain && (
            <button
              onClick={generateElementalTerrain}
              className="flex-1 py-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 hover:border-emerald-400/50 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-emerald-400 hover:text-emerald-300 hover:scale-[1.02] active:scale-95"
            >
              <Mountain size={14} /> Natural
            </button>
          )}
          {resetTerrain && (
            <button
              onClick={resetTerrain}
              className="py-2 px-3 bg-red-50 dark:bg-white/5 hover:bg-red-100 dark:hover:bg-red-900/20 border border-slate-200 dark:border-white/5 hover:border-red-200 dark:hover:border-red-500/30 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-slate-400 hover:text-red-500 hover:scale-[1.02] active:scale-95"
              title="Reset Terrain"
            >
              <Bomb size={14} />
            </button>
          )}
        </div>
      )}

      {setupMode === "pieces" && (
        <div className="flex gap-2">
          <button
            onClick={randomizeUnits}
            className="flex-1 py-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 hover:from-violet-600/30 hover:to-fuchsia-600/30 border border-violet-500/30 hover:border-violet-400/50 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-violet-400 hover:text-violet-300 hover:scale-[1.02] active:scale-95"
          >
            <Shuffle size={14} /> Units
          </button>
          <button
            onClick={setClassicalFormation}
            className="flex-1 py-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 hover:border-amber-400/50 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-amber-400 hover:text-amber-300 hover:scale-[1.02] active:scale-95"
          >
            <LayoutGrid size={14} /> Classic
          </button>
          {resetUnits && (
            <button
              onClick={resetUnits}
              className="py-2 px-3 bg-red-50 dark:bg-white/5 hover:bg-red-100 dark:hover:bg-red-900/20 border border-slate-200 dark:border-white/5 hover:border-red-200 dark:hover:border-red-500/30 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-slate-400 hover:text-red-500 hover:scale-[1.02] active:scale-95"
              title="Reset Units"
            >
              <Bomb size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
