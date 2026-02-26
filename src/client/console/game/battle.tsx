import React from "react";
import { TheBattlefield } from "../components/templates/Battlefield";
import {
  ConsoleActionBar,
  ConsoleGameBoard,
  BattleSidebar,
} from "../components";
import { BattleOverlay } from "../components";
import { useRouteContext } from "@context";
import { useConsoleLogic } from "@hooks/interface/useConsoleLogic";
import type { GameStateHook } from "@/shared/types";

interface BattleViewProps {
  game: GameStateHook;
}

const BattleView: React.FC<BattleViewProps> = ({ game }) => {
  const logic = useConsoleLogic(game);
  const ctx = useRouteContext();

  return (
    <TheBattlefield
      darkMode={ctx.darkMode}
      gameBoard={<ConsoleGameBoard game={game} />}
      actionBar={<ConsoleActionBar game={game} logic={logic} />}
      leftPanel={
        <BattleSidebar
          game={game}
          side="left"
          teamPowerStats={logic.teamPowerStats}
          isOnline={logic.isOnline}
        />
      }
      rightPanel={
        <BattleSidebar
          game={game}
          side="right"
          teamPowerStats={logic.teamPowerStats}
          isOnline={logic.isOnline}
        />
      }
    >
      <BattleOverlay
        game={game}
        isOnline={logic.isOnline}
        myPlayerId={logic.myPlayerId}
      />
    </TheBattlefield>
  );
};

export default BattleView;
