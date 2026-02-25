import React from "react";
import type { ReactNode } from "react";
import CopyrightFooter from "@molecules/CopyrightFooter";
import { DebugSheet } from "../molecules/DebugSheet";

interface GamemasterLayoutProps {
  header: ReactNode;
  deploymentPanel: ReactNode;
  gameBoard: ReactNode;
  debugPanel?: ReactNode;
}

/**
 * GamemasterLayout — specialized layout for the board editor.
 * Similar to ZenGarden but with a distinctive "Architect" aesthetic.
 */
export const GamemasterLayout: React.FC<GamemasterLayoutProps> = ({
  header,
  deploymentPanel,
  gameBoard,
  debugPanel,
}) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020617] text-slate-900 dark:text-slate-50 p-4 md:p-8 flex flex-col items-center overflow-x-hidden transition-colors selection:bg-indigo-500/30">
      {header}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {deploymentPanel}
        <div className="xl:col-span-9 flex flex-col items-center justify-center min-h-[600px] relative">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>
            {gameBoard}
        </div>
      </div>
      <CopyrightFooter />
      <DebugSheet debugPanel={debugPanel} />
    </div>
  );
};

export default GamemasterLayout;
