import React from "react";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";

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
  const activeStyles = active
    ? "border-white/30 bg-white/10 dark:bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-110 z-10"
    : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105";

  const disabledStyles = disabled
    ? "opacity-20 cursor-not-allowed grayscale"
    : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        relative group flex flex-col items-center justify-center
        w-12 h-12 rounded-md border transition-all duration-300 ease-out
        ${activeStyles}
        ${disabledStyles}
        ${className}
      `}
    >
      <TCFlex center className="w-full h-full relative z-10">
        {hoverIcon ? (
          <>
            <div className="transition-all duration-300 group-hover:opacity-0 group-hover:scale-75">
              {children}
            </div>
            <div className="absolute transition-all duration-300 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100">
              {hoverIcon}
            </div>
          </>
        ) : (
          children
        )}
      </TCFlex>

      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-slate-950 dark:bg-white rounded-full text-[8px] flex items-center justify-center font-black border border-white/20 dark:border-slate-900 text-white dark:text-slate-950 shadow-lg z-20 px-1">
          {badge}
        </span>
      )}

      {label && (
        <div className="absolute -bottom-10 px-2 py-1 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded text-[9px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-12 transition-all pointer-events-none z-50 shadow-2xl">
          {label.toUpperCase()}
        </div>
      )}
    </button>
  );
};
