import React from "react";
import { TCCard } from "@/shared/components/atoms/ui/TCCard";
import { TCDivider } from "@/shared/components/atoms/ui/TCDivider";

interface ActionBarTemplateProps {
  architect?: React.ReactNode;
  trench?: React.ReactNode;
  chessmen?: React.ReactNode;
  playTurn?: React.ReactNode;
  theme?: React.ReactNode;
  pov?: React.ReactNode;
  showSetup?: boolean;
  showPlay?: boolean;
  showPov?: boolean;
}

/**
 * ActionBarTemplate — The structural layout for the sticky top action bar.
 * Organizes various interaction organisms into a cohesive horizontal strip.
 */
export const ActionBarTemplate: React.FC<ActionBarTemplateProps> = ({
  architect,
  trench,
  chessmen,
  playTurn,
  theme,
  pov,
  showSetup = false,
  showPlay = false,
  showPov = false,
}) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex items-center justify-center pointer-events-none">
      <TCCard
        variant="glass"
        padding="none"
        className="pointer-events-auto flex items-center gap-6 px-6 py-2 rounded-2xl border-white/5 shadow-2xl transition-all duration-500"
      >
        {showSetup && (
          <>
            {architect}
            <TCDivider />
            {trench}
            <TCDivider />
            {chessmen}
            <TCDivider />
          </>
        )}

        {showPlay && (
          <>
            {playTurn}
            <TCDivider />
          </>
        )}

        {theme}

        {showPov && (
          <>
            <TCDivider />
            {pov}
          </>
        )}
      </TCCard>
    </div>
  );
};
