import React from "react";
import { PLAYER_CONFIGS } from "@constants";

interface PlayTurnProps {
  activePlayers: string[];
  turn: string;
  getIcon?: (pid: string, size?: number) => React.ReactNode;
}

export const PlayTurn: React.FC<PlayTurnProps> = ({
  activePlayers,
  turn,
  getIcon,
}) => {
  return (
    <div className="flex items-center gap-3 px-2">
      {activePlayers.map((p) => {
        const isTurn = turn === p;
        const config = PLAYER_CONFIGS[p] || PLAYER_CONFIGS.red;
        return (
          <div
            key={p}
            className={`flex items-center justify-center transition-all duration-300 ${isTurn ? "opacity-100 scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "opacity-30 scale-90"}`}
            title={config.name || p}
          >
            {getIcon?.(p, 24)}
          </div>
        );
      })}
    </div>
  );
};
