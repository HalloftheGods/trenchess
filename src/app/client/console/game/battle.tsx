import React from "react";
import CombatScreen from "@/app/core/screens/CombatScreen";
import type { GameStateHook } from "@tc.types";

interface BattleViewProps {
  game: GameStateHook;
}

const BattleView: React.FC<BattleViewProps> = ({ game }) => {
  return <CombatScreen game={game} boardType="standard" />;
};

export default BattleView;
