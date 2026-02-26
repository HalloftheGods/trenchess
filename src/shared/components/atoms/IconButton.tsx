import type { ReactNode } from "react";
import { TCButton } from "./ui";

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
}

/** @deprecated Use TCButton with ghost variant directly or this wrapper */
export const IconButton = ({
  icon,
  label,
  onClick,
  className = "",
}: IconButtonProps) => {
  return (
    <TCButton
      onClick={onClick}
      variant="ghost"
      title={label}
      className={`p-0 w-12 h-12 rounded-2xl glass-button glass-interactive group relative ${className}`}
    >
      {icon}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-hover:-top-12 transition-all whitespace-nowrap pointer-events-none z-50">
        {label.toUpperCase()}
      </span>
    </TCButton>
  );
};
