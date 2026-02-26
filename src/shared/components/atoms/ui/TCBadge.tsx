import React from "react";

export type BadgeVariant =
  | "emerald"
  | "blue"
  | "stone"
  | "amber"
  | "purple"
  | "red"
  | "slate"
  | "yellow";

interface TCBadgeProps {
  icon?: React.ElementType;
  label: string;
  variant?: BadgeVariant;
  className?: string;
  size?: "sm" | "md";
}

export const TCBadge: React.FC<TCBadgeProps> = ({
  icon: Icon,
  label,
  variant = "slate",
  className = "",
  size = "md",
}) => {
  const variants: Record<BadgeVariant, string> = {
    emerald:
      "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
    blue: "from-brand-blue/20 to-brand-blue/5 text-brand-blue border-brand-blue/30",
    stone:
      "from-stone-500/20 to-stone-500/5 text-stone-400 border-stone-500/30",
    amber:
      "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30",
    purple:
      "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30",
    red: "from-brand-red/20 to-brand-red/5 text-brand-red border-brand-red/30",
    yellow:
      "from-yellow-400/20 to-yellow-500/5 text-yellow-400 border-yellow-500/30",
    slate:
      "from-slate-500/20 to-slate-500/5 text-slate-400 border-slate-500/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[8px] gap-1.5",
    md: "px-4 py-1.5 text-[10px] gap-2.5",
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];
  const combinedClassName = `flex items-center rounded-full bg-gradient-to-br border backdrop-blur-md transition-all duration-300 font-black uppercase tracking-[0.2em] ${currentVariant} ${currentSize} ${className}`;

  return (
    <div className={combinedClassName}>
      {Icon && (
        <Icon
          size={size === "sm" ? 10 : 14}
          className="fill-current/10"
          strokeWidth={2.5}
        />
      )}
      <span>{label}</span>
    </div>
  );
};
