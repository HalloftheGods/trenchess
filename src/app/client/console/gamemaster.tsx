import { GamemasterLayout } from "@/app/core/blueprints/layouts/GamemasterLayout";
import { ConnectedBoard, ConsolePlayerColumn } from "./components";
import { TopActionBar } from "@/app/core/components/hud/templates";
import {
  useMatchState,
  MatchStateProvider,
  MatchHUDProvider,
} from "@/shared/context";

const GamemasterViewContent: React.FC = () => {
  const game = useMatchState();

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
      gameBoard={<ConnectedBoard />}
      actionBar={<TopActionBar />}
      leftPanel={
        <ConsolePlayerColumn
          playerIds={["red", "green"]}
          isOnline={false}
          alignment="left"
          onNextCommander={handleNextCommander}
          onFinishDeployment={handleFinishDeployment}
        />
      }
      rightPanel={
        <ConsolePlayerColumn
          playerIds={["yellow", "blue"]}
          isOnline={false}
          alignment="right"
          onNextCommander={handleNextCommander}
          onFinishDeployment={handleFinishDeployment}
        />
      }
    />
  );
};

const GamemasterView: React.FC = () => (
  <MatchStateProvider>
    <MatchHUDProvider>
      <GamemasterViewContent />
    </MatchHUDProvider>
  </MatchStateProvider>
);

export default GamemasterView;
