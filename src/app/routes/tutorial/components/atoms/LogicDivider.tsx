import React from "react";

interface LogicDividerProps {
  label: string;
}

export const LogicDivider: React.FC<LogicDividerProps> = ({ label }) => {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="sticky top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
        <span className="text-5xl font-black text-slate-700/20 dark:text-white/10 select-none">
          {label}
        </span>
      </div>
    </div>
  );
};
