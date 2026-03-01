import React from "react";
import CombatScreen from "@/app/core/screens/CombatScreen";
import { useAutoPreconfig } from "@controllers/useAutoPreconfig";

/**
 * ChiView — Terrainiffic Mode.
 */
const ChiView: React.FC = () => {
  useAutoPreconfig("chi");
  return <CombatScreen boardType="chi" />;
};

export default ChiView;
