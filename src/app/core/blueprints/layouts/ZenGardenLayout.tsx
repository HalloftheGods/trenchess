import React from "react";
import type { ReactNode } from "react";
import { LayoutShell } from "./shared/LayoutShell";
import { ResponsiveGrid } from "./shared/ResponsiveGrid";

interface ZenGardenLayoutProps {
  header: ReactNode;
  deploymentPanel: ReactNode;
  gameBoard: ReactNode;
}

/**
 * Zen Garden layout: creative mode with deployment toolbox and board only.
 * No intel panel or shoutbox — focused creation experience.
 */
export const ZenGardenLayout: React.FC<ZenGardenLayoutProps> = ({
  header,
  deploymentPanel,
  gameBoard,
}) => {
  return (
    <LayoutShell header={header}>
      <ResponsiveGrid>
        {deploymentPanel}
        {gameBoard}
      </ResponsiveGrid>
    </LayoutShell>
  );
};
