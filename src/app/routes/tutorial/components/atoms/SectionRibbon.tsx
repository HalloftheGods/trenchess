import React from "react";

interface SectionRibbonProps {
  label: string;
  bgClass: string;
}

export const SectionRibbon: React.FC<SectionRibbonProps> = ({
  label,
  bgClass,
}) => (
  <div
    className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${bgClass} py-2.5 shadow-lg border-b border-white/10 flex justify-center items-center`}
  >
    <span className="text-white text-xl font-black uppercase tracking-[0.4em] drop-shadow-md">
      {label}
    </span>
  </div>
);
