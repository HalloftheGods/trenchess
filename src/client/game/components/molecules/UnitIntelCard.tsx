import React from "react";
import { PLAYER_CONFIGS } from "@/core/constants/unit.constants";
import { INITIAL_ARMY } from "@/core/data/unitDetails";
import type { ArmyUnit, BoardPiece } from "@/shared/types/game";

export interface UnitIntelCardProps {
  pid: string;
  armyValue: number;
  captureValue: number;
  capturedUnits: BoardPiece[];
  getIcon: (unit: ArmyUnit, className?: string) => React.ReactNode;
}

export const UnitIntelCard: React.FC<UnitIntelCardProps> = ({
  pid,
  armyValue,
  captureValue,
  capturedUnits,
  getIcon,
}) => {
  const config = PLAYER_CONFIGS[pid];
  if (!config) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white/50 dark:bg-slate-800/50 p-4 transition-all border-${config.color}/20`}
    >
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${config.bg} shadow-[0_0_10px_rgba(0,0,0,0.3)] animate-pulse`}
          />
          <span className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
            {config.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/20 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5">
            <span className="text-[10px] items-center font-bold uppercase tracking-wider text-slate-400">
              Army
            </span>
            <span className={`text-sm font-black ${config.text} ml-1`}>
              {armyValue}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/20 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5">
            <span className="text-[10px] items-center font-bold uppercase tracking-wider text-slate-400">
              Prisoners
            </span>
            <span className="text-sm font-black text-rose-500 ml-1">
              {captureValue}
            </span>
          </div>
        </div>
      </div>

      {/* Prisoners */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
          <span>Prisoners</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {capturedUnits.length === 0 ? (
            <span className="text-[10px] text-slate-400 italic pl-1">None</span>
          ) : (
            capturedUnits.map((piece, i) => {
              const unit = INITIAL_ARMY.find((u) => u.type === piece.type);
              if (!unit) return null;
              const ownerConfig = PLAYER_CONFIGS[piece.player];
              return (
                <div
                  key={i}
                  className="flex items-center justify-center w-14 h-14 hover:scale-110 transition-all origin-left bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm text-2xl"
                  title={`Captured ${unit.type} (from ${ownerConfig.name})`}
                >
                  {getIcon(unit, `w-9 h-9 ${ownerConfig.text}`)}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
