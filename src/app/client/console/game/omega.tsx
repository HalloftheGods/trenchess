import React from "react";
import CombatScreen from "@/app/core/screens/CombatScreen";
import type { GameStateHook } from "@tc.types";

interface OmegaViewProps {
  game: GameStateHook;
}

/**
 * OmegaView — Gamemaster/Blank Canvas Mode.
 */
const OmegaView: React.FC<OmegaViewProps> = ({ game }) => {
  return <CombatScreen game={game} boardType="omega" />;
};

export default OmegaView;
