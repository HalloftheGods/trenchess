import React from "react";
import { INITIAL_ARMY } from "@/constants";
import { PLAYER_CONFIGS } from "@/constants";
import type { ArmyUnit, BoardPiece } from "@/shared/types/game";

interface ArmyRosterProps {
  turn: string;
  board: (BoardPiece | null)[][];
  pieceStyle: string;
  getIcon: (unit: ArmyUnit, className?: string) => React.ReactNode;
}

export const ArmyRoster: React.FC<ArmyRosterProps> = ({
  turn,
  board,
  pieceStyle,
  getIcon,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden">
      <div className="bg-slate-100 dark:bg-white/10 px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Active Army Roster
        </span>
        <div
          className={`w-2 h-2 rounded-full ${PLAYER_CONFIGS[turn].bg} animate-pulse`}
        />
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {INITIAL_ARMY.map((unit) => {
          const count = board
            .flat()
            .filter(
              (cell) => cell?.player === turn && cell?.type === unit.type,
            ).length;

          return (
            <div
              key={unit.type}
              className={`relative p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                count > 0
                  ? "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 shadow-sm"
                  : "bg-slate-100 dark:bg-black/20 border-transparent opacity-40"
              }`}
            >
              {/* Centered Large Icon */}
              <div className={count > 0 ? "opacity-60" : "opacity-20"}>
                {getIcon(
                  unit,
                  pieceStyle === "custom"
                    ? `w-14 h-14 ${PLAYER_CONFIGS[turn].text}`
                    : `text-5xl ${PLAYER_CONFIGS[turn].text}`,
                )}
              </div>

              {/* Title Underneath */}
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center leading-none">
                {unit.type}
              </span>

              {/* Count Badge */}
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded-full text-[9px] flex items-center justify-center font-black border-2 border-white dark:border-slate-900 shadow-lg text-slate-700 dark:text-slate-200">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
