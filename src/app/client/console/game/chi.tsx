import React from "react";
import CombatScreen from "@/app/core/screens/CombatScreen";
import type { GameStateHook } from "@tc.types";

interface ChiViewProps {
  game: GameStateHook;
}

/**
 * ChiView — Terrainiffic Mode.
 */
const ChiView: React.FC<ChiViewProps> = ({ game }) => {
  return <CombatScreen game={game} boardType="chi" />;
};

export default ChiView;
