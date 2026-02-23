import React from "react";
import { Sparkles, Sword } from "lucide-react";
import { PLAYER_CONFIGS } from "@/shared/constants/unit.constants";
import { PlayerTypeToggle } from "../atoms/PlayerTypeToggle";

interface DeploymentHeaderProps {
  isZen: boolean;
  gameState: string;
  multiplayer?: any;
  turn: string;
  localPlayerName?: string;
  playerTypes: Record<string, "human" | "computer">;
  setPlayerTypes: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
}

export const DeploymentHeader: React.FC<DeploymentHeaderProps> = ({
  isZen,
  gameState,
  multiplayer,
  turn,
  localPlayerName,
  playerTypes,
  setPlayerTypes,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2
        className={`text-xl font-black flex items-center gap-3 uppercase tracking-tighter ${PLAYER_CONFIGS[localPlayerName || turn]?.text || "text-slate-900"}`}
      >
        {isZen ? (
          <Sparkles size={24} className="text-emerald-500" />
        ) : (
          <Sword size={24} />
        )}
        {isZen
          ? "Zen Garden"
          : gameState === "setup"
            ? multiplayer?.roomId
              ? "Operation Deployment"
              : `Player ${PLAYER_CONFIGS[turn]?.name || ""}`
            : "Command Center"}
      </h2>

      {!isZen && gameState === "setup" && !multiplayer?.roomId && (
        <PlayerTypeToggle
          turn={turn}
          playerTypes={playerTypes}
          setPlayerTypes={setPlayerTypes}
        />
      )}
    </div>
  );
};
