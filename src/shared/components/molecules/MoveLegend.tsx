import React from "react";

interface LegendItemProps {
  color: string;
  label: string;
  shadowColor: string;
  animate?: boolean;
}

const LegendItem: React.FC<LegendItemProps> = ({
  color,
  label,
  shadowColor,
  animate,
}) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_${shadowColor}] ${animate ? "animate-pulse" : ""}`}
    />
    <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500/80 dark:text-slate-400/80">
      {label}
    </span>
  </div>
);

export const MoveLegend: React.FC = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-10 w-full py-4 border-t border-slate-200/5 dark:border-white/5">
      <LegendItem
        color="bg-emerald-500"
        label="Valid Move"
        shadowColor="rgba(16,185,129,0.4)"
      />
      <LegendItem
        color="bg-amber-500"
        label="Special Move"
        shadowColor="rgba(245,158,11,0.4)"
        animate
      />
      <LegendItem
        color="bg-brand-red"
        label="Capture Move"
        shadowColor="rgba(239,68,68,0.4)"
      />
    </div>
  );
};

export default MoveLegend;
