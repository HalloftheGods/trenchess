import React from "react";
import {
  AccordionSection,
  DebugButton,
  DebugSelect,
} from "@/shared/components/atoms";
import { DebugRow } from "./DebugRow";
import type { GameState, GameStateHook } from "@/shared/types";

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
    setGameState,
    setMode,
    setTurn,
    setSetupMode,
    setShowBgDebug,
    dispatch,
  } = game;

  return (
    <AccordionSection title="Game Logic" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-1.5 py-1">
        <DebugRow label="Engine Phase">
          {setGameState ? (
            <DebugSelect
              value={gameState}
              onChange={(e) => {
                const newPhase = e.target.value;
                dispatch(`phase ${newPhase}`);
              }}
              options={[
                { value: "menu", label: "menu" },
                { value: "setup", label: "setup" },
                { value: "play", label: "play" },
                { value: "library", label: "library" },
                { value: "how-to-play", label: "how-to-play" },
                { value: "zen-garden", label: "zen-garden" },
                { value: "gamemaster", label: "gamemaster" },
              ]}
              className="text-amber-500 font-bold"
            />
          ) : (
            <span className="font-bold text-amber-500">{gameState}</span>
          )}
        </DebugRow>

        <DebugRow label="Mode">
          {setMode ? (
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
          ) : (
            mode || "(None)"
          )}
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
              onChange={(e) => setSetupMode(e.target.value as SetupMode)}
              options={[
                { value: "terrain", label: "terrain" },
                { value: "units", label: "units" },
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
