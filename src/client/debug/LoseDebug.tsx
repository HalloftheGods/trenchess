import React from "react";
import VictoryOverlay from "@/client/game/shared/components/atoms/VictoryOverlay";

const LoseDebug: React.FC = () => {
  const getPlayerDisplayName = (pid: string) => {
    const names: Record<string, string> = {
      red: "Red Player",
      blue: "Blue Player",
      green: "Green Player",
      yellow: "Yellow Player",
    };
    return names[pid] || pid;
  };

  const mockBoard = Array(12).fill(null).map(() => Array(12).fill(null));
  const mockTerrain = Array(12).fill("flat").map(() => Array(12).fill("flat"));

  // Add some pieces for the winner (blue)
  mockBoard[0][0] = { type: "king", player: "blue" };
  mockBoard[0][1] = { type: "rook", player: "blue" };

  return (
    <div className="w-full h-screen bg-slate-900">
      <VictoryOverlay
        winner="blue"
        reason="checkmate"
        localPlayerName="red"
        board={mockBoard}
        terrain={mockTerrain as any}
        mode="2p-ns"
        getPlayerDisplayName={getPlayerDisplayName}
        setGameState={(state) => console.log("Set game state to", state)}
      />
    </div>
  );
};

export default LoseDebug;
