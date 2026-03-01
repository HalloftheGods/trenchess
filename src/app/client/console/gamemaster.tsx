import { GamemasterLayout } from "@/app/core/blueprints/layouts/GamemasterLayout";
import { ConnectedBoard, ConsolePlayerColumn } from "./components";
import { TopActionBar } from "@/app/core/hud/templates";
import { useConsoleLogic } from "@hooks/interface/useConsoleLogic";
import { useGameState } from "@hooks/engine/useGameState";

const GamemasterView: React.FC = () => {
  const game = useGameState();
  const logic = useConsoleLogic(game);

  const handleNextCommander = () => {
    const currentIndex = game.activePlayers.indexOf(game.turn);
    const nextIndex = (currentIndex + 1) % game.activePlayers.length;
    game.setTurn?.(game.activePlayers[nextIndex]);
  };

  const handleFinishDeployment = () => {
    game.finishGamemaster();
  };

  return (
    <GamemasterLayout
      gameBoard={<ConnectedBoard game={game} />}
      actionBar={<TopActionBar game={game} logic={logic} />}
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
