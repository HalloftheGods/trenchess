import React from "react";
import {
  AccordionSection,
  DebugButton,
  DebugSelect,
} from "@/shared/components/atoms";
import { PHASES } from "@constants/game";
import { DebugRow } from "./DebugRow";
import type { GameStateHook } from "@/shared/types";

interface DebugGameSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  game: GameStateHook;
  placedCount: number;
  maxPlacement: number;
}

export const DebugGameSection: React.FC<DebugGameSectionProps> = ({
  isOpen,
  onToggle,
  game,
  placedCount,
  maxPlacement,
}) => {
  const {
    gameState,
    mode,
    turn,
    setupMode,
    activePlayers,
    getPlayerDisplayName,
    placementPiece,
    placementTerrain,
    isFlipped,
    showBgDebug,
    setShowBgDebug,
    setTurn,
    setSetupMode,
    dispatch,
  } = game;

  return (
    <AccordionSection title="Game Logic" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-1.5 py-1">
        <DebugRow label="Engine Phase">
          <DebugSelect
            value={gameState}
            onChange={(e) => {
              const newPhase = e.target.value;
              dispatch(`phase ${newPhase}`);
            }}
            options={[
              { value: PHASES.MENU, label: "menu" },
              { value: PHASES.GENESIS, label: "genesis" },
              { value: PHASES.MAIN, label: "main" },
              { value: PHASES.COMBAT, label: "combat" },
              { value: PHASES.FINISHED, label: "finished" },
              { value: PHASES.LIBRARY, label: "library" },
              { value: PHASES.HOW_TO_PLAY, label: "how-to-play" },
              { value: PHASES.ZEN_GARDEN, label: "zen-garden" },
              { value: PHASES.GAMEMASTER, label: "gamemaster" },
            ]}
            className="text-amber-500 font-bold"
          />
        </DebugRow>

        <DebugRow label="Mode">
          <DebugSelect
            value={mode || ""}
            onChange={(e) => dispatch(`play ${e.target.value}`)}
            options={[
              { value: "2p-ns", label: "2p-ns" },
              { value: "2p-ew", label: "2p-ew" },
              { value: "4p", label: "4p" },
              { value: "2v2", label: "2v2" },
              { value: "", label: "(None)" },
            ]}
          />
        </DebugRow>

        <DebugRow label="Current Turn">
          {setTurn ? (
            <DebugSelect
              value={turn}
              onChange={(e) => dispatch(`turn ${e.target.value}`)}
              options={activePlayers.map((pid) => ({
                value: pid,
                label: `${getPlayerDisplayName(pid)} (${pid})`,
              }))}
            />
          ) : (
            `${getPlayerDisplayName(turn)} (${turn})`
          )}
        </DebugRow>

        <DebugRow label="Setup Tab">
          {setSetupMode ? (
            <DebugSelect
              value={setupMode}
              onChange={(e) =>
                setSetupMode(e.target.value as "terrain" | "pieces")
              }
              options={[
                { value: "terrain", label: "terrain" },
                { value: "pieces", label: "units" },
              ]}
            />
          ) : (
            setupMode
          )}
        </DebugRow>

        <div className="my-2 border-t border-slate-100/5 pt-2 space-y-1">
          <DebugRow label="Placement Unit">{placementPiece || "—"}</DebugRow>
          <DebugRow label="Placement Tile">{placementTerrain || "—"}</DebugRow>
          <DebugRow label="Board Flipped">{isFlipped ? "Yes" : "No"}</DebugRow>
          <DebugRow label="Tiles Placed">
            <span
              className={
                placedCount >= maxPlacement
                  ? "text-emerald-400"
                  : "text-amber-400"
              }
            >
              {placedCount} / {maxPlacement}
            </span>
          </DebugRow>
          <DebugRow label="External Debugger">
            <DebugButton
              variant={showBgDebug ? "primary" : "secondary"}
              active={showBgDebug}
              onClick={() => setShowBgDebug?.(!showBgDebug)}
            >
              {showBgDebug ? "Active" : "Disabled"}
            </DebugButton>
          </DebugRow>
        </div>
      </div>
    </AccordionSection>
  );
};

export default DebugGameSection;
