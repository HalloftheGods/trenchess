import React from "react";
import CombatScreen from "@/app/core/screens/CombatScreen";
import type { GameStateHook } from "@tc.types";

interface PiViewProps {
  game: GameStateHook;
}

/**
 * PiView — Classic Mode.
 */
const PiView: React.FC<PiViewProps> = ({ game }) => {
  return <CombatScreen game={game} boardType="pi" />;
};

export default PiView;
