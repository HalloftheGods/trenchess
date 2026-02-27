import React from "react";
import { TheBattlefield } from "../components/templates/Battlefield";
import {
  ConsoleActionBar,
  ConnectedBoard,
  ConsoleOverlays,
  ConsolePlayerColumn,
} from "../components";
import { useRouteContext } from "@context";
import { useConsoleLogic } from "@hooks/interface/useConsoleLogic";
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
      gameBoard={<ConnectedBoard game={game} />}
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
