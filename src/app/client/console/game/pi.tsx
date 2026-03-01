import React from "react";
import CombatScreen from "@/app/core/screens/CombatScreen";
import { useAutoPreconfig } from "@controllers/useAutoPreconfig";

/**
 * PiView — Classic Mode.
 */
const PiView: React.FC = () => {
  useAutoPreconfig("pi");
  return <CombatScreen boardType="pi" />;
};

export default PiView;
