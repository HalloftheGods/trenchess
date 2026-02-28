import React from "react";
import type { ReactNode } from "react";
import { LayoutShell } from "./shared/LayoutShell";
import { ResponsiveGrid } from "./shared/ResponsiveGrid";

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
    <LayoutShell header={header}>
      <ResponsiveGrid>
        {deploymentPanel}
        {gameBoard}
        <div className="xl:col-span-3 flex flex-col gap-6 order-2 xl:order-3 h-full">
          <div className="flex-1 flex flex-col justify-end min-h-[400px]">
            {intelPanel}
          </div>
          {shoutbox}
        </div>
      </ResponsiveGrid>
    </LayoutShell>
  );
};
