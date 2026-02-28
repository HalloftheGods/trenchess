import React from "react";

interface DebugRowProps {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const DebugRow: React.FC<DebugRowProps> = ({
  label,
  children,
  icon,
}) => (
  <div className="group flex justify-between items-center gap-3 py-1 hover:bg-white/[0.02] dark:hover:bg-white/[0.01] rounded px-1 -mx-1 transition-colors">
    <div className="flex items-center gap-2">
      {icon && <span className="text-slate-500">{icon}</span>}
      <span className="text-slate-500 whitespace-nowrap text-[11px] font-medium tracking-tight group-hover:text-slate-400 transition-colors">
        {label}
      </span>
    </div>
    <div className="text-slate-700 dark:text-slate-200 text-right truncate text-xs font-mono">
      {children}
    </div>
  </div>
);

export default DebugRow;
