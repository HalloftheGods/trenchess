import React, { useState, useCallback } from "react";
import { AccordionSection, DebugButton } from "@/shared/components/atoms";
import { DebugRow } from "./DebugRow";
import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "@/shared/types";

interface MultiplayerPlayer {
  id: string;
  name?: string;
}

interface OnlineInfo {
  roomId: string | null;
  playerIndex: number | null;
  isHost: boolean;
  isConnected: boolean;
  players: MultiplayerPlayer[];
  serverUrl: string;
}

interface DebugMultiplayerSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onlineInfo: OnlineInfo;
  bgioState: { G: TrenchessState; ctx: Ctx } | null;
  getPlayerDisplayName: (pid: string) => string;
}

export const DebugMultiplayerSection: React.FC<
  DebugMultiplayerSectionProps
> = ({ isOpen, onToggle, onlineInfo, bgioState, getPlayerDisplayName }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }, []);

  return (
    <AccordionSection
      title="Network / Sync"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-1.5 py-1">
        <DebugRow label="Connection">
          <span
            className={`font-bold ${onlineInfo.isConnected ? "text-emerald-400" : "text-rose-400"}`}
          >
            {onlineInfo.isConnected ? "● Connected" : "○ Offline"}
          </span>
        </DebugRow>

        <DebugRow label="Room Code">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-bold tracking-tight">
              {onlineInfo.roomId}
            </span>
            <DebugButton
              onClick={() => copyToClipboard(onlineInfo.roomId!, "room")}
            >
              {copiedKey === "room" ? "✓" : "copy"}
            </DebugButton>
          </div>
        </DebugRow>

        <DebugRow label="Invite Link">
          <DebugButton
            onClick={() =>
              copyToClipboard(
                `${window.location.origin}${window.location.pathname}?room=${onlineInfo.roomId}`,
                "link",
              )
            }
          >
            {copiedKey === "link" ? "✓ Link Copied" : "Copy Link"}
          </DebugButton>
        </DebugRow>

        <DebugRow label="Identity">
          {(() => {
            if (onlineInfo.playerIndex === null) return "—";
            const indexKey = onlineInfo.playerIndex.toString();
            const mappedPid = bgioState?.G?.playerMap?.[indexKey];
            return mappedPid
              ? `Slot ${onlineInfo.playerIndex} (${getPlayerDisplayName(mappedPid)})`
              : `Slot ${onlineInfo.playerIndex}`;
          })()}
        </DebugRow>

        <DebugRow label="Permissions">
          <span
            className={onlineInfo.isHost ? "text-amber-400" : "text-slate-400"}
          >
            {onlineInfo.isHost ? "Host / Authority" : "Client / Guest"}
          </span>
        </DebugRow>

        <DebugRow label="Endpoint">
          <span className="truncate text-slate-500 text-[10px] bg-black/20 px-1 rounded block max-w-[120px]">
            {onlineInfo.serverUrl}
          </span>
        </DebugRow>
      </div>
    </AccordionSection>
  );
};

export default DebugMultiplayerSection;
