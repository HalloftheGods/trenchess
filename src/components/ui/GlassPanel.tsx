import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export const GlassPanel = ({ children, className = "" }: GlassPanelProps) => {
  return (
    <div
      className={`bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-2xl rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
};
