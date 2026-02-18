import type { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
}

export const IconButton = ({
  icon,
  label,
  onClick,
  className = "",
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-2xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-amber-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group relative ${className}`}
      title={label}
    >
      {icon}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {label.toUpperCase()}
      </span>
    </button>
  );
};
