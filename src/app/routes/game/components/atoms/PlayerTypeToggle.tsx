import React from "react";

interface PlayerTypeToggleProps {
  turn: string;
  playerTypes: Record<string, "human" | "computer">;
  setPlayerTypes: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
}

export const PlayerTypeToggle: React.FC<PlayerTypeToggleProps> = ({
  turn,
  playerTypes,
  setPlayerTypes,
}) => {
  return (
    <div className="flex bg-slate-100 dark:bg-black/20 rounded-lg p-1 border border-slate-200 dark:border-white/5">
      <button
        onClick={() => setPlayerTypes((prev) => ({ ...prev, [turn]: "human" }))}
        className={`px-3 py-1 rounded-md text-[15px] font-black uppercase tracking-widest transition-all ${playerTypes[turn] === "human" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
      >
        Human
      </button>
      <button
        onClick={() =>
          setPlayerTypes((prev) => ({ ...prev, [turn]: "computer" }))
        }
        className={`px-3 py-1 rounded-md text-[15px] font-black uppercase tracking-widest transition-all ${playerTypes[turn] === "computer" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
      >
        CPU
      </button>
    </div>
  );
};
