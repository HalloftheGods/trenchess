import { INITIAL_ARMY, UNIT_POINTS } from "@constants";
import { useSanctuaryBonuses } from "./useSanctuaryBonuses";
import type { BoardPiece, TerrainType } from "@/shared/types/game";

interface GameStatsProps {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  activePlayers: string[];
}

export function useGameStats({ board, terrain, activePlayers }: GameStatsProps) {
  const sanctuaryBonuses = useSanctuaryBonuses(board, terrain);

  // Derived inline for zero-lag synchronization with engine state
  const teamPowerStats: Record<string, { current: number; max: number }> = {
    red: { current: 0, max: 0 },
    yellow: { current: 0, max: 0 },
    green: { current: 0, max: 0 },
    blue: { current: 0, max: 0 },
  };

  const initialTotalPower = INITIAL_ARMY.reduce(
    (sum, unit) => sum + unit.count * (UNIT_POINTS[unit.type] || 0),
    0,
  );

  activePlayers.forEach((pid) => {
    teamPowerStats[pid].max = initialTotalPower;
    let currentMaterial = 0;
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < (board[r]?.length || 0); c++) {
        const piece = board[r][c];
        if (piece && piece.player === pid) {
          currentMaterial += UNIT_POINTS[piece.type] || 0;
        }
      }
    }
    teamPowerStats[pid].current = currentMaterial + (sanctuaryBonuses[pid] || 0);
  });

  return { sanctuaryBonuses, teamPowerStats };
}
