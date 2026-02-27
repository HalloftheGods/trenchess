import React from "react";
import type { ReactNode } from "react";

interface GamemasterLayoutProps {
  darkMode?: boolean;
  gameBoard: ReactNode;
  actionBar: ReactNode;
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
}

/**
 * GamemasterLayout — specialized layout for the board editor.
 * 3-Column layout with Architect aesthetic.
 */
export const GamemasterLayout: React.FC<GamemasterLayoutProps> = ({
  darkMode = true,
  gameBoard,
  actionBar,
  leftPanel,
  rightPanel,
}) => {
  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-100 flex flex-col items-center overflow-x-hidden relative ${darkMode ? "dark" : ""}`}
    >
      {/* Sticky top bar */}
      {actionBar}

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-indigo-500/10 dark:from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main content area: 3-Column Layout */}
      <div className="w-full max-w-[1700px] flex flex-col lg:flex-row items-start justify-center gap-8 px-6 pt-32 pb-12 relative z-10">
        {/* Left Column */}
        <div className="w-full lg:w-80 flex flex-col shrink-0 order-2 lg:order-1">
          {leftPanel}
        </div>

        {/* Center: Board container */}
        <div className="flex-1 flex justify-center w-full min-w-0 order-1 lg:order-2">
          <div className="w-full max-w-[850px] aspect-square relative">
            {gameBoard}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-80 flex flex-col shrink-0 order-3">
          {rightPanel}
        </div>
      </div>
    </div>
  );
};
