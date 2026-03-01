import type { ReactNode } from "react";
import { TCButton } from "./ui";

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
  tooltipPosition?: "top" | "bottom";
}

/** @deprecated Use TCButton with ghost variant directly or this wrapper */
export const IconButton = ({
  icon,
  label,
  onClick,
  className = "",
  tooltipPosition = "top",
}: IconButtonProps) => {
  const tPos =
    tooltipPosition === "bottom"
      ? "-bottom-10 group-hover:-bottom-12"
      : "-top-10 group-hover:-top-12";

  return (
    <TCButton
      onClick={onClick}
      variant="ghost"
      title={label}
      className={`p-0 w-12 h-12 rounded-2xl glass-button glass-interactive group relative ${className}`}
    >
      {icon}
      <span
        className={`absolute left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 ${tPos}`}
      >
        {label.toUpperCase()}
      </span>
    </TCButton>
  );
};
