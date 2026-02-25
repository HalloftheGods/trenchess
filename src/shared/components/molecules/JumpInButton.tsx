import React from "react";
import { Castle, ChessKnight, ChessRook, Zap } from "lucide-react";

interface JumpInButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

/**
 * A "Jump right in" button for the home page when no back button is available.
 * Fills the layout gap and provides a quick action.
 */
const JumpInButton: React.FC<JumpInButtonProps> = ({
  onClick,
  label = "Jump right in!",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 p-2 pl-3 pr-4 text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer font-bold text-sm uppercase tracking-wider animate-pulse-subtle ${className}`}
      title={label}
    >
      <Castle size={36} />
      <span>{label}</span>
    </button>
  );
};

export default JumpInButton;
