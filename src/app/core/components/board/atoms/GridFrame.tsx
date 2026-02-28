import React from "react";

interface GridFrameProps {
  children: React.ReactNode;
  isFlipped?: boolean;
  onMouseLeave?: () => void;
  className?: string;
}

export const GridFrame: React.FC<GridFrameProps> = ({
  children,
  isFlipped = false,
  onMouseLeave,
  className = "",
}) => {
  return (
    <div
      onMouseLeave={onMouseLeave}
      className={`relative w-full aspect-square grid grid-cols-12 bg-slate-200 dark:bg-slate-900 border-[8px] border-slate-300 dark:border-slate-950 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 ease-in-out ${className}`}
      style={{ transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      {children}
    </div>
  );
};
