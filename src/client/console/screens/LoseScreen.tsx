import React from "react";
import { VictoryOverlay } from "@/client/console/components";
import type { TerrainType, BoardPiece } from "@/shared/types/game";

interface LoseScreenProps {
  winner?: string;
  reason?: string;
  localPlayerName?: string;
  board?: (BoardPiece | null)[][];
  terrain?: TerrainType[][];
  mode?: string;
  getPlayerDisplayName?: (pid: string) => string;
  setGameState?: (state: any) => void;
}

const LoseScreen: React.FC<LoseScreenProps> = ({
  winner = "blue",
  reason = "checkmate",
  localPlayerName = "red",
  board,
  terrain,
  mode = "2p-ns",
  getPlayerDisplayName = (pid: string) => {
    const names: Record<string, string> = {
      red: "Red Player",
      blue: "Blue Player",
      green: "Green Player",
      yellow: "Yellow Player",
    };
    return names[pid] || pid;
  },
  setGameState = (state) => console.log("Set game state to", state),
}) => {
  const mockBoard: (BoardPiece | null)[][] = board || Array(12)
    .fill(null)
    .map(() => Array(12).fill(null));
  const mockTerrain: TerrainType[][] = terrain || Array(12)
    .fill(null)
    .map(() => Array(12).fill("flat"));

  if (!board) {
    mockBoard[0][0] = { type: "king", player: "blue" };
    mockBoard[0][1] = { type: "rook", player: "blue" };
  }

  return (
    <VictoryOverlay
      winner={winner}
      reason={reason}
      localPlayerName={localPlayerName}
      board={mockBoard}
      terrain={mockTerrain}
      mode={mode as any}
      getPlayerDisplayName={getPlayerDisplayName}
      setGameState={setGameState}
    />
  );
};

export default LoseScreen;
