import type { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
}

export const IconButton = ({
  icon,
  label,
  onClick,
  className = "",
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl glass-button glass-interactive flex items-center justify-center group relative ${className}`}
      title={label}
    >
      {icon}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {label.toUpperCase()}
      </span>
    </button>
  );
};
