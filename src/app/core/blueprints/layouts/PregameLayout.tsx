import React from "react";
import type { ReactNode } from "react";
import { LayoutShell } from "./shared/LayoutShell";
import { ResponsiveGrid } from "./shared/ResponsiveGrid";

interface PregameLayoutProps {
  header: ReactNode;
  deploymentPanel: ReactNode;
  gameBoard: ReactNode;
}

export const PregameLayout: React.FC<PregameLayoutProps> = ({
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
