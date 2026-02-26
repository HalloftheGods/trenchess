import React from "react";
import {
  AccordionSection,
  DebugSelect,
  DebugButton,
} from "@/shared/components/atoms";
import {
  TCFlex,
  TCToggle,
  TCText,
  TCStack,
} from "@/shared/components/atoms/ui";
import { DebugRow } from "./DebugRow";

import type { GameStateHook } from "@/shared/types";

interface DebugPlayerSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  game: GameStateHook;
}

export const DebugPlayerSection: React.FC<DebugPlayerSectionProps> = ({
  isOpen,
  onToggle,
  game,
}) => {
  const {
    bgioState,
    activePlayers,
    readyPlayers,
    playerTypes,
    localPlayerName,
    setLocalPlayerName,
    setActivePlayers,
    setReadyPlayers,
    setPlayerTypes,
  } = game;

  const playerIds = ["red", "blue", "green", "yellow"];

  return (
    <AccordionSection title="Player Info" isOpen={isOpen} onToggle={onToggle}>
      <TCStack gap={3} py={1}>
        <DebugRow label="Engine CurrentPlayer">
          {bgioState?.ctx?.currentPlayer || "—"}
        </DebugRow>

        <DebugRow label="Local View mapped to">
          {setLocalPlayerName ? (
            <DebugSelect
              value={localPlayerName || ""}
              onChange={(e) => setLocalPlayerName(e.target.value)}
              options={[
                { value: "", label: "(None - use turn)" },
                ...playerIds.map((pid) => ({ value: pid, label: pid })),
              ]}
            />
          ) : (
            localPlayerName || "(None)"
          )}
        </DebugRow>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <TCText
            variant="muted"
            className="font-bold uppercase tracking-widest px-1"
          >
            Player States
          </TCText>
          {playerIds.map((playerId) => {
            const isActive = activePlayers.includes(playerId);
            const isReady = readyPlayers?.[playerId] ?? false;
            const playerType = playerTypes?.[playerId] ?? "human";

            return (
              <div
                key={playerId}
                className={`pl-2 border-l-2 transition-all ${
                  isActive
                    ? "border-amber-500 bg-amber-500/5"
                    : "border-slate-700 opacity-50"
                } py-1.5 rounded-r`}
              >
                <TCFlex justify="between" align="center" className="mb-1.5">
                  <span
                    className={`text-xs font-bold uppercase tracking-tight cursor-pointer ${
                      isActive ? "text-amber-200" : "text-slate-400"
                    }`}
                    onClick={() => {
                      if (setActivePlayers) {
                        const updatedPlayers = isActive
                          ? activePlayers.filter((p) => p !== playerId)
                          : [...activePlayers, playerId];
                        setActivePlayers(updatedPlayers);
                      }
                    }}
                  >
                    {playerId}
                  </span>

                  {setReadyPlayers && (
                    <TCToggle
                      size="sm"
                      label="Ready"
                      checked={isReady}
                      onChange={(checked) => {
                        setReadyPlayers((curr) => ({
                          ...curr,
                          [playerId]: checked,
                        }));
                      }}
                    />
                  )}
                </TCFlex>

                <TCFlex justify="between" align="center">
                  <TCText
                    variant="muted"
                    className="uppercase font-medium text-[10px]"
                  >
                    Auto-Control
                  </TCText>
                  {setPlayerTypes ? (
                    <TCFlex gap={1}>
                      <DebugButton
                        variant={
                          playerType === "human" ? "primary" : "secondary"
                        }
                        active={playerType === "human"}
                        onClick={() =>
                          setPlayerTypes((curr) => ({
                            ...curr,
                            [playerId]: "human",
                          }))
                        }
                      >
                        Human
                      </DebugButton>
                      <DebugButton
                        variant={
                          playerType === "computer" ? "success" : "secondary"
                        }
                        active={playerType === "computer"}
                        onClick={() =>
                          setPlayerTypes((curr) => ({
                            ...curr,
                            [playerId]: "computer",
                          }))
                        }
                      >
                        CPU
                      </DebugButton>
                    </TCFlex>
                  ) : (
                    <span className="text-[10px] font-mono uppercase">
                      {playerType}
                    </span>
                  )}
                </TCFlex>
              </div>
            );
          })}
        </div>
      </TCStack>
    </AccordionSection>
  );
};

export default DebugPlayerSection;
