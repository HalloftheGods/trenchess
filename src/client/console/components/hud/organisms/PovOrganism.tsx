import React from "react";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import { TCText } from "@/shared/components/atoms/ui/TCTypography";
import { TCDivider, TCDot } from "@/shared/components/atoms/ui";
import { ActionBarSlot } from "../atoms";
import { PLAYER_CONFIGS } from "@constants";

interface PovOrganismProps {
  perspective?: string;
  onPerspectiveChange?: (pid: string) => void;
  activePlayers: string[];
  side?: string;
  onSideChange?: (side: string) => void;
}

export const PovOrganism: React.FC<PovOrganismProps> = ({
  perspective,
  onPerspectiveChange,
  activePlayers,
  side,
  onSideChange,
}) => {
  return (
    <TCFlex direction="col" align="center" gap={1}>
      <TCFlex align="center" gap={2}>
        <ActionBarSlot
          label="North"
          active={perspective === "north"}
          onClick={() => onPerspectiveChange?.("north")}
        >
          <TCDot color="bg-red-600" isActive={perspective === "north"} />
        </ActionBarSlot>
        <ActionBarSlot
          label="South"
          active={perspective === "south"}
          onClick={() => onPerspectiveChange?.("south")}
        >
          <TCDot color="bg-blue-600" isActive={perspective === "south"} />
        </ActionBarSlot>
        <TCDivider className="h-6" />
        {activePlayers.map((pid) => (
          <ActionBarSlot
            key={pid}
            label={PLAYER_CONFIGS[pid]?.name || pid}
            active={side === pid}
            onClick={() => onSideChange?.(pid)}
          >
            <TCDot
              color={PLAYER_CONFIGS[pid]?.bg || "bg-slate-400"}
              isActive={side === pid}
            />
          </ActionBarSlot>
        ))}
      </TCFlex>
      <TCText
        variant="muted"
        className="text-[10px] font-black uppercase tracking-[0.2em]"
      >
        POV
      </TCText>
    </TCFlex>
  );
};
