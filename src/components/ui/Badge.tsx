import React from "react";

interface BadgeProps {
  icon: React.ElementType;
  label: string;
  colorTheme?:
    | "emerald"
    | "blue"
    | "stone"
    | "amber"
    | "purple"
    | "red"
    | "slate"
    | "yellow";
  className?: string;
  darkMode?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  icon: Icon,
  label,
  colorTheme = "emerald",
  className = "",
  darkMode = false,
}) => {
  const themes = {
    emerald: {
      bg: "from-emerald-500/20 to-emerald-500/5",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
    },
    blue: {
      bg: "from-blue-500/20 to-blue-500/5",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
    },
    stone: {
      bg: "from-stone-500/20 to-stone-500/5",
      text: "text-stone-600 dark:text-stone-400",
      border: "border-stone-500/30",
    },
    amber: {
      bg: "from-amber-500/20 to-amber-500/5",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
    },
    purple: {
      bg: "from-purple-500/20 to-purple-500/5",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/30",
    },
    red: {
      bg: "from-red-500/20 to-red-500/5",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/30",
    },
    yellow: {
      bg: "from-yellow-400/20 to-yellow-500/5",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-500/30",
    },
    slate: {
      bg: "from-slate-500/20 to-slate-500/5",
      text: "text-slate-600 dark:text-slate-400",
      border: "border-slate-500/30",
    },
  };

  const theme = themes[colorTheme] || themes.emerald;

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-br ${theme.bg} border ${theme.border} backdrop-blur-md transition-all duration-300 ${className}`}
      style={{
        boxShadow: "0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <Icon
        size={14}
        className={`${theme.text} fill-current/10`}
        strokeWidth={2.5}
      />
      <span
        className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? "text-slate-100" : "text-slate-800"}`}
      >
        {label}
      </span>
    </div>
  );
};

export default Badge;
