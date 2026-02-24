import React from "react";

interface ActionBarSlotProps {
  children: React.ReactNode;
  hoverIcon?: React.ReactNode;
  label?: string;
  badge?: number;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * ActionBarSlot — a single icon slot for the MMO-style action bar.
 * Compact square with subtle glass bg, glow-on-active, optional badge and label.
 */
export const ActionBarSlot: React.FC<ActionBarSlotProps> = ({
  children,
  hoverIcon,
  label,
  badge,
  active = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        relative group flex flex-col items-center justify-center
        w-12 h-12 rounded-lg border transition-all duration-200
        ${
          active
            ? "border-slate-300 dark:border-white/40 bg-white/60 dark:bg-white/15 shadow-[0_0_12px_rgba(0,0,0,0.1)] dark:shadow-[0_0_12px_rgba(255,255,255,0.15)] scale-110 z-10"
            : "border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:scale-105"
        }
        ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      <div className="flex items-center justify-center w-full h-full relative">
        {hoverIcon ? (
          <>
            <div className="transition-all duration-300 group-hover:opacity-0 group-hover:scale-0">
              {children}
            </div>
            <div className="absolute transition-all duration-300 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100">
              {hoverIcon}
            </div>
          </>
        ) : (
          children
        )}
      </div>
      {badge !== undefined && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-slate-100 dark:bg-slate-900/90 rounded-full text-[9px] flex items-center justify-center font-black border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white shadow-sm backdrop-blur-sm px-1">
          {badge}
        </span>
      )}
      {label && (
        <span className="absolute -top-10 text-[9px] font-bold text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-top-12 transition-all pointer-events-none">
          {label}
        </span>
      )}
    </button>
  );
};
