import React from "react";
import { PLAYER_CONFIGS } from "@constants/unit.constants";

interface ActiveFieldStrategyProps {
  turn: string;
  getPlayerDisplayName: (pid: string) => string;
}

export const ActiveFieldStrategy: React.FC<ActiveFieldStrategyProps> = ({
  turn,
  getPlayerDisplayName,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden">
      <div className="bg-slate-100 dark:bg-white/10 px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Active Field Strategy
        </span>
        <div
          className={`w-2 h-2 rounded-full ${PLAYER_CONFIGS[turn].bg} animate-pulse`}
        />
      </div>
      <div className="p-6 text-center">
        <h3
          className={`text-2xl font-black tracking-tighter ${PLAYER_CONFIGS[turn].text}`}
        >
          {getPlayerDisplayName(turn)} DECISION
        </h3>
      </div>
    </div>
  );
};
