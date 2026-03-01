import React from "react";
import { ReadyUpPanel } from "../molecules";
import { getPlayerCells } from "@/app/core/setup/setupLogic";
import {
  TERRAIN_TYPES,
  MAX_TERRAIN_PER_PLAYER,
  INITIAL_ARMY,
} from "@constants";
import type { BoardPiece } from "@tc.types";
import { useMatchState, useMatchHUD } from "@/shared/context";

interface ConsolePlayerColumnProps {
  playerIds: string[];
  isOnline: boolean;
  alignment: "left" | "right";
  onNextCommander?: () => void;
  onFinishDeployment?: () => void;
}

export const ConsolePlayerColumn: React.FC<ConsolePlayerColumnProps> = ({
  playerIds,
  isOnline,
  alignment,
  onNextCommander,
  onFinishDeployment,
}) => {
  const game = useMatchState();
  const logic = useMatchHUD();
  const activeInColumn = playerIds.filter((pid) =>
    game.activePlayers.includes(pid),
  );

  const getPosition = () => {
    if (activeInColumn.length === 2) return "between";
    if (activeInColumn.length === 0) return "top";

    const pid = activeInColumn[0];
    if (pid === "red") return "top";
    if (pid === "blue") return "bottom";
    if (pid === "green" || pid === "yellow") return "center";

    return "between";
  };

  const position = getPosition();

  return (
    <div className="flex flex-col gap-8 flex-1">
      {(position === "bottom" || position === "center") && (
        <div className="flex-1" />
      )}

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
            onSelect={() => game.setTurn?.(pid)}
            placedCount={pPlacedCount}
            maxPlacement={pMaxPlacement}
            unitsPlaced={pUnitsPlaced}
            maxUnits={totalUnitCount}
            currentPower={logic.teamPowerStats[pid].current}
            maxPower={logic.teamPowerStats[pid].max}
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
            onNextCommander={
              onNextCommander ||
              (() => {
                const currentIndex = game.activePlayers.indexOf(game.turn);
                const nextIndex =
                  (currentIndex + 1) % game.activePlayers.length;
                game.setTurn?.(game.activePlayers[nextIndex]);
              })
            }
            onFinishDeployment={
              onFinishDeployment || (() => game.finishGamemaster())
            }
          />
        );
      })}

      {(position === "top" || position === "center") && (
        <div className="flex-1" />
      )}
    </div>
  );
};
