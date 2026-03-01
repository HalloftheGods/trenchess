import React from "react";
import CombatScreen from "@/app/core/screens/CombatScreen";
import { useAutoPreconfig } from "@controllers/useAutoPreconfig";

const AlphaView: React.FC = () => {
  useAutoPreconfig("alpha");
  return <CombatScreen boardType="standard" />;
};

export default AlphaView;
