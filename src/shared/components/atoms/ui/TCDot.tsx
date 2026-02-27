import React from "react";

interface TCDotProps {
  color?: string;
  isActive?: boolean;
  className?: string;
}

export const TCDot: React.FC<TCDotProps> = ({
  color = "bg-slate-400",
  isActive = false,
  className = "",
}) => {
  const activeStyles = isActive
    ? "ring-2 ring-white/50 shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-110"
    : "opacity-20 scale-90";

  const combinedClassName = `w-3.5 h-3.5 rounded-full border border-black/20 transition-all duration-500 ${color} ${activeStyles} ${className}`;

  return <div className={combinedClassName} />;
};
