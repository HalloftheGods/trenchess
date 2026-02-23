import React from "react";
import type { ReactNode } from "react";
import TrenchessText from "@atoms/TrenchessText";

interface MmoLayoutProps {
  darkMode?: boolean;
  gameBoard: ReactNode;
  actionBar: ReactNode;
  onLogoClick?: () => void;
  debugPanel?: ReactNode;
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  children?: ReactNode;
}

/**
 * MmoLayout — full-viewport centered layout with no header.
 */
export const MmoLayout: React.FC<MmoLayoutProps> = ({
  darkMode = true,
  gameBoard,
  actionBar,
  onLogoClick,
  debugPanel,
  leftPanel,
  rightPanel,
  children,
}) => {
  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#050b15] text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center overflow-hidden relative ${darkMode ? "dark" : ""}`}
    >
      {/* Brand Logo */}
      <div
        onClick={onLogoClick}
        className="absolute top-6 left-8 z-[120] cursor-pointer group select-none active:scale-95 transition-transform"
      >
        <TrenchessText className="text-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>

      {children}
      {/* Sticky top bar */}
      {actionBar}
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/10 dark:from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main content area: 3-Column Layout */}
      <div className="w-full max-w-[1600px] flex items-stretch justify-center gap-6 px-4 pt-24 pb-8 relative z-10">
        {/* Left Column */}
        <div className="hidden lg:flex w-72 flex-col flex-shrink-0">
          {leftPanel}
        </div>

        {/* Center: Board container */}
        <div className="flex-none w-[min(85vh,800px)] relative">
          {gameBoard}
        </div>

        {/* Right Column */}
        <div className="hidden lg:flex w-72 flex-col flex-shrink-0">
          {rightPanel}
        </div>
      </div>
      {debugPanel && (
        <div className="hidden xl:block flex-shrink-0 absolute bottom-4 left-4 z-[110]">
          {debugPanel}
        </div>
      )}
    </div>
  );
};
