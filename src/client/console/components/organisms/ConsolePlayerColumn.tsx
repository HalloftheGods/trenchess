import React from "react";
import { ReadyUpPanel } from "../molecules/ReadyUpPanel";
import { getPlayerCells } from "@/core/setup/setupLogic";
import { 
  TERRAIN_TYPES, 
  MAX_TERRAIN_PER_PLAYER, 
  INITIAL_ARMY 
} from "@constants";
import type { GameStateHook, BoardPiece } from "@/shared/types";

interface ConsolePlayerColumnProps {
  game: GameStateHook;
  playerIds: string[];
  teamPowerStats: Record<string, { current: number; max: number }>;
  isOnline: boolean;
  alignment: "left" | "right";
  onNextCommander?: () => void;
  onFinishDeployment?: () => void;
}

export const ConsolePlayerColumn: React.FC<ConsolePlayerColumnProps> = ({
  game,
  playerIds,
  teamPowerStats,
  isOnline,
  alignment,
  onNextCommander,
  onFinishDeployment,
}) => {
  return (
    <div className="flex flex-col justify-between gap-8 h-full">
      {playerIds.map((expectedPid: string) => {
        const pid = game.activePlayers.includes(expectedPid)
          ? expectedPid
          : undefined;
        if (!pid) return null;

        const myCells = getPlayerCells(pid, game.mode);
        let pPlacedCount = 0;
        for (const [r, c] of myCells) {
          if (game.terrain[r] && game.terrain[r][c] !== TERRAIN_TYPES.FLAT)
            pPlacedCount++;
        }

        const pMaxPlacement =
          game.activePlayers.length === 2
            ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
            : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

        const totalUnitCount = INITIAL_ARMY.reduce(
          (sum, unit) => sum + unit.count,
          0,
        );
        const pUnitsPlaced =
          totalUnitCount - (game.inventory[pid] || []).length;

        return (
          <ReadyUpPanel
            key={pid}
            gameState={game.gameState}
            playerID={pid}
            isReady={game.readyPlayers[pid]}
            playerType={game.playerTypes[pid] || "human"}
            setPlayerType={(type) =>
              game.setPlayerTypes(
                (prev: Record<string, "human" | "computer">) => ({
                  ...prev,
                  [pid]: type,
                }),
              )
            }
            isOnline={isOnline}
            isLocalTurn={game.turn === pid}
            onSelect={() => game.setTurn(pid)}
            placedCount={pPlacedCount}
            maxPlacement={pMaxPlacement}
            unitsPlaced={pUnitsPlaced}
            maxUnits={totalUnitCount}
            currentPower={teamPowerStats[pid].current}
            maxPower={teamPowerStats[pid].max}
            onResetTerrain={game.resetTerrain}
            onResetUnits={game.resetUnits}
            onForfeit={() => game.forfeit(pid)}
            onReady={() => game.ready(pid)}
            capturedPieces={game.capturedBy[pid]}
            desertedPieces={
              game.bgioState?.G.lostToDesert?.filter(
                (p: BoardPiece) => p.player === pid,
              ) || []
            }
            getIcon={game.getIcon}
            alignment={alignment}
            inCheck={game.inCheck && game.turn === pid}
            onNextCommander={onNextCommander}
            onFinishDeployment={onFinishDeployment}
          />
        );
      })}
    </div>
  );
};
