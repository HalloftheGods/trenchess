import React from "react";
import {
  DualToneNS,
  DualToneEW,
  QuadTone,
  AllianceTone,
} from "@/shared/components/atoms/RouteIcons";
import { ActionBarSlot } from "../atoms";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import type { GameMode } from "@tc.types/game";

interface ModeSelectionProps {
  mode?: GameMode;
  setMode: (mode: GameMode) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  mode,
  setMode,
}) => {
  const isModeSelected = mode !== null && mode !== undefined;

  if (isModeSelected) {
    return (
      <ActionBarSlot
        label={`Mode: ${mode?.toUpperCase()}`}
        active
        onClick={() => setMode(null as unknown as GameMode)}
      >
        {mode === "2p-ns" && <DualToneNS size={20} />}
        {mode === "2p-ew" && <DualToneEW size={20} />}
        {mode === "4p" && <QuadTone size={20} />}
        {mode === "2v2" && <AllianceTone size={20} />}
      </ActionBarSlot>
    );
  }

  return (
    <TCFlex align="center" gap={2} className="transition-all duration-500">
      <ActionBarSlot
        label="North/South"
        active={false}
        onClick={() => setMode("2p-ns")}
      >
        <DualToneNS size={20} />
      </ActionBarSlot>
      <ActionBarSlot
        label="East/West"
        active={false}
        onClick={() => setMode("2p-ew")}
      >
        <DualToneEW size={20} />
      </ActionBarSlot>
      <ActionBarSlot
        label="4-Player"
        active={false}
        onClick={() => setMode("4p")}
      >
        <QuadTone size={20} />
      </ActionBarSlot>
      <ActionBarSlot
        label="Alliance"
        active={false}
        onClick={() => setMode("2v2")}
      >
        <AllianceTone size={20} />
      </ActionBarSlot>
    </TCFlex>
  );
};
