import React from "react";
import { TheBattlefield } from "../components/templates/Battkefield";
import {
  ConsoleActionBar,
  ConsoleGameBoard,
  ConsoleOverlays,
  ConsolePlayerColumn,
} from "../components/organisms";
import { useRouteContext } from "@context";
import { useConsoleLogic } from "@hooks/useConsoleLogic";
import type { GameStateHook } from "@/shared/types";

interface OmegaViewProps {
  game: GameStateHook;
}

/**
 * OmegaView — Gamemaster/Blank Canvas Mode.
 */
const OmegaView: React.FC<OmegaViewProps> = ({ game }) => {
  const logic = useConsoleLogic(game);
  const ctx = useRouteContext();

  return (
    <TheBattlefield
      darkMode={ctx.darkMode}
      onLogoClick={ctx.onLogoClick}
      gameBoard={<ConsoleGameBoard game={game} />}
      actionBar={<ConsoleActionBar game={game} logic={logic} />}
      leftPanel={
        <ConsolePlayerColumn
          game={game}
          playerIds={["red", "green"]}
          teamPowerStats={logic.teamPowerStats}
          isOnline={logic.isOnline}
          alignment="left"
        />
      }
      rightPanel={
        <ConsolePlayerColumn
          game={game}
          playerIds={["yellow", "blue"]}
          teamPowerStats={logic.teamPowerStats}
          isOnline={logic.isOnline}
          alignment="right"
        />
      }
    >
      <ConsoleOverlays game={game} logic={logic} />
    </TheBattlefield>
  );
};

export default OmegaView;
