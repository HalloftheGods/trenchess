import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MatchStateProvider, MatchHUDProvider } from "@context";
import PregameScreenContent from "@engine/screens/PregameScreen";
import type { GameMode } from "@tc.types/game";

type PregamePreset = "omega" | "chi";

const VALID_PRESETS: PregamePreset[] = ["omega", "chi"];

const derivePreset = (raw: string | null): PregamePreset => {
  const isValidPreset = VALID_PRESETS.includes(raw as PregamePreset);
  return isValidPreset ? (raw as PregamePreset) : "omega";
};

const deriveMode = (players: string | undefined): GameMode => {
  const count = parseInt(players || "2", 10);
  const isFourPlayer = count >= 3;
  return isFourPlayer ? "4p" : "2p-ns";
};

const derivePlayerConfig = (
  players: string | undefined,
  mode: GameMode,
): Record<string, "human" | "computer"> => {
  const count = parseInt(players || "2", 10);

  const activePids =
    mode === "2p-ns"
      ? ["red", "blue"]
      : mode === "2p-ew"
        ? ["green", "yellow"]
        : ["red", "yellow", "green", "blue"];

  const config: Record<string, "human" | "computer"> = {
    red: "computer",
    yellow: "computer",
    green: "computer",
    blue: "computer",
  };

  const assignHumanSlots = (pid: string, index: number) => {
    const isHumanSlot = index < count;
    config[pid] = isHumanSlot ? "human" : "computer";
  };

  activePids.forEach(assignHumanSlots);
  return config;
};

export const PregameView: React.FC = () => {
  const { players } = useParams<{ playMode: string; players: string }>();
  const [searchParams] = useSearchParams();

  const preset = derivePreset(searchParams.get("preset"));
  const mode = deriveMode(players);
  const playerConfig = derivePlayerConfig(players, mode);

  return (
    <MatchStateProvider>
      <MatchHUDProvider>
        <PregameScreenContent
          preset={preset}
          mode={mode}
          playerConfig={playerConfig}
        />
      </MatchHUDProvider>
    </MatchStateProvider>
  );
};

export default PregameView;
