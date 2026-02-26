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
    ? "animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.2)]"
    : "opacity-40";
  const combinedClassName = `w-3 h-3 rounded-full ${color} ${activeStyles} ${className}`;

  return <div className={combinedClassName} />;
};
