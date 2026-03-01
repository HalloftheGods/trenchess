import React from "react";
import CombatScreen from "@/app/core/screens/CombatScreen";
import { useAutoPreconfig } from "@controllers/useAutoPreconfig";

/**
 * OmegaView — Gamemaster/Blank Canvas Mode.
 */
const OmegaView: React.FC = () => {
  useAutoPreconfig("omega");
  return <CombatScreen boardType="omega" />;
};

export default OmegaView;
