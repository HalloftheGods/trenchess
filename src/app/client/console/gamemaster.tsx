import { GamemasterLayout } from "@/app/core/blueprints/layouts/GamemasterLayout";
import {
  ConsoleActionBar,
  ConnectedBoard,
  ConsolePlayerColumn,
} from "./components";
import { useRouteContext } from "@context";
import { useConsoleLogic } from "@hooks/interface/useConsoleLogic";
import type { GameStateHook } from "@tc.types";

interface GamemasterViewProps {
  game: GameStateHook;
}

const GamemasterView: React.FC<GamemasterViewProps> = ({ game }) => {
  const logic = useConsoleLogic(game);
  const ctx = useRouteContext();

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
      darkMode={ctx.darkMode}
      gameBoard={<ConnectedBoard game={game} />}
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
