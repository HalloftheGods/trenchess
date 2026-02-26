import React from "react";

interface ZenPlayerTabsProps {
  isZen: boolean;
  activePlayers: string[];
  turn: string;
  setTurn: (pid: string) => void;
}

export const ZenPlayerTabs: React.FC<ZenPlayerTabsProps> = ({
  isZen,
  activePlayers,
  turn,
  setTurn,
}) => {
  if (!isZen) return null;

  return (
    <div className="flex p-1 bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 mb-6">
      {activePlayers.map((pid) => (
        <button
          key={pid}
          onClick={() => setTurn(pid)}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            turn === pid
              ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white cursor-default"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          }`}
        >
          {pid === "red"
            ? "Red"
            : pid === "yellow"
              ? "Yellow"
              : pid === "green"
                ? "Green"
                : "Blue"}
        </button>
      ))}
    </div>
  );
};
