import React from "react";
import type { ReactNode } from "react";

interface BattlefieldProps {
  darkMode?: boolean;
  gameBoard: ReactNode;
  actionBar: ReactNode;
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  centerHeader?: ReactNode;
  children?: ReactNode;
}

/**
 * MmoLayout — full-viewport centered layout with no header.
 */
export const TheBattlefield: React.FC<BattlefieldProps> = ({
  darkMode = true,
  gameBoard,
  actionBar,
  leftPanel,
  rightPanel,
  centerHeader,
  children,
}) => {
  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#02030f] text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center overflow-hidden relative ${darkMode ? "dark" : ""}`}
    >
      {/* Center Header */}
      {centerHeader && (
        <div className="absolute top-6 left-0 right-0 z-[120] flex flex-col items-center pointer-events-none">
          <div className="pointer-events-auto">{centerHeader}</div>
        </div>
      )}

      {children}
      {/* Sticky top bar */}
      {actionBar}
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/10 dark:from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main content area: 3-Column Layout */}
      <div className="w-full max-w-[1600px] flex items-stretch justify-center gap-6 px-4 pt-32 pb-8 relative z-10">
        {/* Left Column */}
        <div className="hidden lg:flex w-72 flex-col flex-shrink-0 h-full">
          {leftPanel}
        </div>

        {/* Center: Board container */}
        <div className="flex-none w-[min(85vh,800px)] relative">
          {gameBoard}
        </div>

        {/* Right Column */}
        <div className="hidden lg:flex w-72 flex-col flex-shrink-0 h-full">
          {rightPanel}
        </div>
      </div>
    </div>
  );
};
