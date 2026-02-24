import React from "react";
import type { ReactNode } from "react";
import CopyrightFooter from "@molecules/CopyrightFooter";
import { DebugSheet } from "../molecules/DebugSheet";

interface ZenGardenLayoutProps {
  header: ReactNode;
  deploymentPanel: ReactNode;
  gameBoard: ReactNode;
  debugPanel?: ReactNode;
}

/**
 * Zen Garden layout: creative mode with deployment toolbox and board only.
 * No intel panel or shoutbox — focused creation experience.
 */
export const ZenGardenLayout: React.FC<ZenGardenLayoutProps> = ({
  header,
  deploymentPanel,
  gameBoard,
  debugPanel,
}) => {
  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#050b15] text-slate-800 dark:text-slate-100 p-4 md:p-8 flex flex-col items-center overflow-x-hidden transition-colors">
      {header}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {deploymentPanel}
        {gameBoard}
      </div>
      <CopyrightFooter />
      <DebugSheet debugPanel={debugPanel} />
    </div>
  );
};
