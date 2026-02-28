import { PHASES, PLAYER_CONFIGS } from "@constants";
import type {
  BoardIdentity,
  BoardTacticalState,
} from "@tc.types/game/ux/BoardProps";

interface StrategicMaskRegion {
  top: string;
  left: string;
  width: string;
  height: string;
  label: string;
}

interface UseStrategicMaskProps {
  tactical: BoardTacticalState;
  identity: BoardIdentity;
  fogOfWarEnabled?: boolean;
}

export const useStrategicMask = ({
  tactical,
  identity,
  fogOfWarEnabled = true,
}: UseStrategicMaskProps) => {
  const { mode, gameState, turn } = tactical;
  const { localPlayerName } = identity;

  const perspectiveTurn = localPlayerName || turn;
  const isStrategicMaskActive =
    fogOfWarEnabled &&
    (gameState === PHASES.MAIN ||
      gameState === PHASES.GENESIS ||
      gameState === PHASES.GAMEMASTER);

  const calculateMaskRegions = (): StrategicMaskRegion[] => {
    if (!isStrategicMaskActive || gameState === PHASES.GAMEMASTER) return [];

    const regions: StrategicMaskRegion[] = [];

    if (mode === "2p-ns") {
      const isRedPerspective = perspectiveTurn === "red";
      regions.push({
        top: isRedPerspective ? "50%" : "0",
        left: "0",
        width: "100%",
        height: "50%",
        label: "Opponent Territory",
      });
    } else if (mode === "2p-ew") {
      const isGreenPerspective = perspectiveTurn === "green";
      regions.push({
        top: "0",
        left: isGreenPerspective ? "50%" : "0",
        width: "50%",
        height: "100%",
        label: "Opponent Territory",
      });
    } else if (mode === "4p") {
      const quadrants = [
        { player: "red", top: "0", left: "0" },
        { player: "yellow", top: "0", left: "50%" },
        { player: "green", top: "50%", left: "0" },
        { player: "blue", top: "50%", left: "50%" },
      ];

      quadrants.forEach((q) => {
        if (q.player !== perspectiveTurn) {
          const cfg = PLAYER_CONFIGS[q.player];
          regions.push({
            top: q.top,
            left: q.left,
            width: "50%",
            height: "50%",
            label: cfg?.name || "Opponent",
          });
        }
      });
    }

    return regions;
  };

  const isCellMasked = (row: number, col: number): boolean => {
    if (!isStrategicMaskActive || gameState === PHASES.GAMEMASTER) return false;

    if (mode === "2p-ns") {
      return perspectiveTurn === "red" ? row >= 6 : row < 6;
    }

    if (mode === "2p-ew") {
      if (perspectiveTurn === "green") return col >= 6;
      if (perspectiveTurn === "yellow") return col < 6;
    }

    if (mode === "4p") {
      let isMyArea = false;
      if (perspectiveTurn === "red") isMyArea = row < 6 && col < 6;
      if (perspectiveTurn === "yellow") isMyArea = row < 6 && col >= 6;
      if (perspectiveTurn === "green") isMyArea = row >= 6 && col < 6;
      if (perspectiveTurn === "blue") isMyArea = row >= 6 && col >= 6;
      return !isMyArea;
    }

    return false;
  };

  return {
    regions: calculateMaskRegions(),
    isCellMasked,
    isMaskActive: isStrategicMaskActive,
  };
};
