import React from "react";
import { GamemasterLayout } from "./components/templates/GamemasterLayout";
import {
  ConsoleActionBar,
  ConsoleGameBoard,
  ConsolePlayerColumn,
} from "./components/organisms";
import { useRouteContext } from "@context";
import { useConsoleLogic } from "@hooks/useConsoleLogic";
import type { GameStateHook } from "@/shared/types";

interface GamemasterViewProps {
  game: GameStateHook;
}

const GamemasterView: React.FC<GamemasterViewProps> = ({ game }) => {
  const logic = useConsoleLogic(game);
  const ctx = useRouteContext();

  const handleNextCommander = () => {
    const currentIndex = game.activePlayers.indexOf(game.turn);
    const nextIndex = (currentIndex + 1) % game.activePlayers.length;
    game.setTurn(game.activePlayers[nextIndex]);
  };

  const handleFinishDeployment = () => {
    game.finishGamemaster();
  };

  return (
    <GamemasterLayout
      darkMode={ctx.darkMode}
      onLogoClick={ctx.onLogoClick}
      gameBoard={<ConsoleGameBoard game={game} />}
      actionBar={<ConsoleActionBar game={game} logic={logic} />}
      leftPanel={
        <ConsolePlayerColumn
          game={game}
          playerIds={["red", "green"]}
          teamPowerStats={logic.teamPowerStats}
          isOnline={false}
          alignment="left"
          onNextCommander={handleNextCommander}
          onFinishDeployment={handleFinishDeployment}
        />
      }
      rightPanel={
        <ConsolePlayerColumn
          game={game}
          playerIds={["yellow", "blue"]}
          teamPowerStats={logic.teamPowerStats}
          isOnline={false}
          alignment="right"
          onNextCommander={handleNextCommander}
          onFinishDeployment={handleFinishDeployment}
        />
      }
    />
  );
};

export default GamemasterView;
