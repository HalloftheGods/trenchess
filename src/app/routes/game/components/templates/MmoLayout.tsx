import React from "react";
import type { ReactNode } from "react";

interface MmoLayoutProps {
  gameBoard: ReactNode;
  actionBar: ReactNode;
  debugPanel?: ReactNode;
}

/**
 * MmoLayout — full-viewport centered layout with no header.
 * Board centered in screen; action bar fixed to top; optional debug panel on left.
 */
export const MmoLayout: React.FC<MmoLayoutProps> = ({
  gameBoard,
  actionBar,
  debugPanel,
}) => {
  return (
    <div className="min-h-screen bg-[#050b15] text-slate-100 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Sticky top bar */}
      {actionBar}
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main content area with optional debug panel */}
      <div className="relative w-full flex items-start justify-center gap-6 px-4 pt-24">
        {/* Debug panel — left side */}
        {debugPanel && (
          <div className="hidden xl:block w-64 flex-shrink-0 sticky top-28">
            {debugPanel}
          </div>
        )}

        {/* Board container */}
        <div className="w-full max-w-[min(85vh,900px)]">{gameBoard}</div>
      </div>
    </div>
  );
};
