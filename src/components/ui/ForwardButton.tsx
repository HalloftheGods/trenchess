import React from "react";
import { ChevronRight } from "lucide-react";

interface ForwardButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
  Icon?: React.ElementType;
}

const ForwardButton: React.FC<ForwardButtonProps> = ({
  onClick,
  label,
  className = "",
  Icon = ChevronRight,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-2 pl-4 pr-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer font-bold text-sm uppercase tracking-wider ${className}`}
      title={`Forward to ${label}`}
    >
      <span>{label}</span>
      <Icon size={20} />
    </button>
  );
};

export default ForwardButton;
