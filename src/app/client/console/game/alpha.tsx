import React from "react";
import CombatScreen from "@/app/core/screens/CombatScreen";
import type { GameStateHook } from "@tc.types";

interface AlphaViewProps {
  game: GameStateHook;
}

/**
 * AlphaView — Chaos Mode.
 */
const AlphaView: React.FC<AlphaViewProps> = ({ game }) => {
  return <CombatScreen game={game} boardType="standard" />;
};

export default AlphaView;
