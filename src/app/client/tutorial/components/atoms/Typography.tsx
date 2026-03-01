import React from "react";

export const UnitTitle: React.FC<{
  title: string;
  textColor: string;
  glowBg: string;
}> = ({ title, textColor, glowBg }) => (
  <h3
    className={`text-5xl font-black uppercase tracking-tighter ${textColor} mb-4 relative group`}
  >
    <span className="relative z-10 drop-shadow-sm">{title}</span>
    <div
      className={`absolute -inset-x-8 -inset-y-4 ${glowBg} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full`}
    />
  </h3>
);

export const UnitSubtitle: React.FC<{
  subtitle: string;
  Icon: React.ElementType;
  colorClass: string;
}> = ({ subtitle, Icon, colorClass }) => (
  <div className="flex items-center gap-3 mb-2 mt-20 opacity-80">
    <Icon size={24} className={colorClass} />
    <span
      className={`text-sm font-bold uppercase tracking-[0.2em] ${colorClass}`}
    >
      {subtitle}
    </span>
  </div>
);

export const SectionLabel: React.FC<{
  label: string;
  subtextColor: string;
  darkMode: boolean;
}> = ({ label, subtextColor, darkMode }) => (
  <div className="flex items-center w-full gap-4 opacity-70">
    <div
      className={`h-px flex-1 ${darkMode ? "bg-white/20" : "bg-slate-900/10"}`}
    />
    <span
      className={`text-[10px] font-black uppercase tracking-widest ${subtextColor}`}
    >
      {label}
    </span>
    <div
      className={`h-px flex-1 ${darkMode ? "bg-white/20" : "bg-slate-900/10"}`}
    />
  </div>
);
