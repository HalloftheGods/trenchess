import React from "react";
import type { ReactNode } from "react";
import CopyrightFooter from "@molecules/CopyrightFooter";

interface OnlineGameLayoutProps {
  header: ReactNode;
  deploymentPanel: ReactNode;
  gameBoard: ReactNode;
  intelPanel: ReactNode;
  shoutbox: ReactNode;
}

/**
 * Online multiplayer layout: 3-column grid with Shoutbox integrated in the right column.
 */
export const OnlineGameLayout: React.FC<OnlineGameLayoutProps> = ({
  header,
  deploymentPanel,
  gameBoard,
  intelPanel,
  shoutbox,
}) => {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#050b15] text-slate-800 dark:text-slate-100 p-4 md:p-8 flex flex-col items-center overflow-x-hidden transition-colors">
      {header}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {deploymentPanel}
        {gameBoard}
        <div className="xl:col-span-3 flex flex-col gap-6 order-2 xl:order-3 h-full">
          <div className="flex-1 flex flex-col justify-end min-h-[400px]">
            {intelPanel}
          </div>
          {shoutbox}
        </div>
      </div>
      <CopyrightFooter />
    </div>
  );
};
