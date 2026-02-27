import React from "react";
import type { ReactNode } from "react";
import CopyrightFooter from "@molecules/CopyrightFooter";

interface SpectatorLayoutProps {
  header: ReactNode;
  gameBoard: ReactNode;
  shoutbox: ReactNode;
}

/**
 * Spectator layout: read-only view with board center-stage and shoutbox sidebar.
 * No deployment panel — spectators only observe.
 */
export const SpectatorLayout: React.FC<SpectatorLayoutProps> = ({
  header,
  gameBoard,
  shoutbox,
}) => {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#02030f] text-slate-800 dark:text-slate-100 p-4 md:p-8 flex flex-col items-center overflow-x-hidden transition-colors">
      {header}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-9 flex flex-col items-center order-1">
          {gameBoard}
        </div>
        <div className="xl:col-span-3 flex flex-col gap-6 order-2 h-full">
          <div className="flex-1 flex flex-col justify-end min-h-[500px]">
            {shoutbox}
          </div>
        </div>
      </div>
      <CopyrightFooter />
    </div>
  );
};
