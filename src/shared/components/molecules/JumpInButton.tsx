import React from "react";
import { DualToneSwords, TrenchessText } from "../atoms";
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
  label = "Trenchess Now!",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 p-2 pl-3 pr-4 text-white-500/45 hover:text-amber-600 dark:hover:text-amber-400 transition-colors rounded-full hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer font-bold text-sm uppercase tracking-wider animate-pulse-subtle ${className}`}
      title={label}
    >
      <DualToneSwords size={24} />
      <span>
        <TrenchessText /> Now!
      </span>
    </button>
  );
};

export default JumpInButton;
