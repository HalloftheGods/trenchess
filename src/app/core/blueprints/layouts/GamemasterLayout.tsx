import React from "react";
import type { ReactNode } from "react";
import { TCFlex } from "@atoms/ui/TCFlex";
import { Box } from "@atoms/Box";
import { useTheme } from "@shared/context/ThemeContext";

interface GamemasterLayoutProps {
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
  gameBoard,
  actionBar,
  leftPanel,
  rightPanel,
}) => {
  const { darkMode } = useTheme();
  return (
    <TCFlex
      direction="col"
      align="center"
      className={`min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-100 overflow-x-hidden relative ${darkMode ? "dark" : ""}`}
    >
      {/* Sticky top bar */}
      {actionBar}

      {/* Subtle ambient glow */}
      <Box className="absolute inset-0 pointer-events-none overflow-hidden">
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-indigo-500/10 dark:from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl" />
      </Box>

      {/* Main content area: 3-Column Layout */}
      <TCFlex
        direction="col"
        justify="center"
        gap={8}
        className="w-full max-w-[1700px] lg:flex-row items-start px-6 pt-32 pb-12 relative z-10"
      >
        {/* Left Column */}
        <TCFlex
          direction="col"
          className="w-full lg:w-80 shrink-0 order-2 lg:order-1"
        >
          {leftPanel}
        </TCFlex>

        {/* Center: Board container */}
        <TCFlex
          justify="center"
          className="flex-1 w-full min-w-0 order-1 lg:order-2"
        >
          <Box className="w-full max-w-[850px] aspect-square relative">
            {gameBoard}
          </Box>
        </TCFlex>

        {/* Right Column */}
        <TCFlex direction="col" className="w-full lg:w-80 shrink-0 order-3">
          {rightPanel}
        </TCFlex>
      </TCFlex>
    </TCFlex>
  );
};
