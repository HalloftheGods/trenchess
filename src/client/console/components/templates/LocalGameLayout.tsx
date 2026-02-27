import React from "react";
import type { ReactNode } from "react";
import CopyrightFooter from "@molecules/CopyrightFooter";

interface LocalGameLayoutProps {
  header: ReactNode;
  deploymentPanel: ReactNode;
  gameBoard: ReactNode;
  intelPanel: ReactNode;
}

/**
 * Standard local-play layout: 3-column grid
 * Left: DeploymentPanel | Center: GameBoard | Right: IntelPanel
 */
export const LocalGameLayout: React.FC<LocalGameLayoutProps> = ({
  header,
  deploymentPanel,
  gameBoard,
  intelPanel,
}) => {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#02030f] text-slate-800 dark:text-slate-100 p-4 md:p-8 flex flex-col items-center overflow-x-hidden transition-colors">
      {header}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {deploymentPanel}
        {gameBoard}
        {intelPanel}
      </div>
      <CopyrightFooter />
    </div>
  );
};
