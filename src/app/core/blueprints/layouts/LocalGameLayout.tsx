import React from "react";
import type { ReactNode } from "react";
import { LayoutShell } from "./shared/LayoutShell";
import { ResponsiveGrid } from "./shared/ResponsiveGrid";

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
    <LayoutShell header={header}>
      <ResponsiveGrid>
        {deploymentPanel}
        {gameBoard}
        {intelPanel}
      </ResponsiveGrid>
    </LayoutShell>
  );
};
