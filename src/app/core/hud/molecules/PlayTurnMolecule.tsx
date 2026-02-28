import React from "react";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import { PLAYER_CONFIGS, PIECES, INITIAL_ARMY } from "@constants";
import type { ArmyUnit } from "@tc.types";

interface PlayTurnMoleculeProps {
  activePlayers: string[];
  turn: string;
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    size?: number | string,
    filled?: boolean,
  ) => React.ReactNode;
}

export const PlayTurnMolecule: React.FC<PlayTurnMoleculeProps> = ({
  activePlayers,
  turn,
  getIcon,
}) => {
  return (
    <TCFlex align="center" gap={3} className="px-2">
      {activePlayers.map((p) => {
        const isTurn = turn === p;
        const config = PLAYER_CONFIGS[p] || PLAYER_CONFIGS.red;
        return (
          <TCFlex
            key={p}
            center
            className={`transition-all duration-300 ${isTurn ? "opacity-100 scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "opacity-30 scale-90"}`}
            title={config.name || p}
          >
            {getIcon(
              INITIAL_ARMY.find((u) => u.type === PIECES.KING)!,
              `${config.text} drop-shadow-md`,
              24,
            )}
          </TCFlex>
        );
      })}
    </TCFlex>
  );
};
