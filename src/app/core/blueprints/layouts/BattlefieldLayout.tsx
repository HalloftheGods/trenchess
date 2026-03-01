import React from "react";
import type { ReactNode } from "react";
import { Glow } from "./battlefield/Glow";
import { Column } from "./battlefield/Column";
import { CenterHeader } from "./battlefield/CenterHeader";
import { useTheme } from "@shared/context/ThemeContext";

interface BattlefieldProps {
  gameBoard: ReactNode;
  actionBar: ReactNode;
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  centerHeader?: ReactNode;
  children?: ReactNode;
}

/**
 * BattlefieldLayout — full-viewport centered layout with no header.
 */
export const BattlefieldLayout: React.FC<BattlefieldProps> = ({
  gameBoard,
  actionBar,
  leftPanel,
  rightPanel,
  centerHeader,
  children,
}) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#02030f] text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center overflow-hidden relative ${darkMode ? "dark" : ""}`}
    >
      {centerHeader && <CenterHeader>{centerHeader}</CenterHeader>}

      {children}
      {actionBar}
      <Glow />

      <div className="w-full max-w-[1600px] flex items-stretch justify-center gap-6 px-4 pt-32 pb-8 relative z-10">
        <Column alignment="left">{leftPanel}</Column>

        <div className="flex-none w-[min(85vh,800px)] relative order-2">
          {gameBoard}
        </div>

        <Column alignment="right">{rightPanel}</Column>
      </div>
    </div>
  );
};
