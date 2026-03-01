import type { GameMode, GameState, PieceType, TerrainType } from "@tc.types";
import {
  TERRAIN_TYPES,
  MAX_TERRAIN_PER_PLAYER,
  INITIAL_ARMY,
  PHASES,
} from "@constants";
import { getPlayerCells } from "@/app/core/setup/setupLogic";

export type WizardStep =
  | "board-type"
  | "style"
  | "terrain"
  | "chessmen"
  | "ready";
export type StyleChoice = "omega" | "pi" | "chi" | "alpha" | "random" | null;

interface WizardInput {
  gameState: GameState;
  mode: GameMode;
  activePlayers: string[];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  styleChoice: StyleChoice;
}

export const useWizardState = (input: WizardInput) => {
  const { gameState, mode, activePlayers, terrain, inventory, styleChoice } =
    input;
  const isWizardActive = gameState === PHASES.GAMEMASTER;
  const isModeSelected = mode !== null;
  const isStyleSelected = styleChoice !== null;

  const isTerrainComplete =
    isModeSelected &&
    activePlayers.length > 0 &&
    activePlayers.every((pid) => {
      const isTwoPlayer = mode === "2p-ns" || mode === "2p-ew";
      const quota = isTwoPlayer
        ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
        : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;
      const cells = getPlayerCells(pid, mode);
      const count = cells.filter(
        ([r, c]) => terrain[r]?.[c] && terrain[r][c] !== TERRAIN_TYPES.FLAT,
      ).length;
      return count >= quota;
    });

  const totalPerPlayer = INITIAL_ARMY.reduce(
    (sum, unit) => sum + unit.count,
    0,
  );
  const isChessmenComplete =
    activePlayers.length > 0 &&
    activePlayers.every(
      (pid) => (inventory[pid]?.length ?? totalPerPlayer) === 0,
    );

  const currentStep: WizardStep = !isWizardActive
    ? "ready"
    : !isModeSelected
      ? "board-type"
      : !isStyleSelected
        ? "style"
        : !isTerrainComplete
          ? "terrain"
          : !isChessmenComplete
            ? "chessmen"
            : "ready";

  return {
    currentStep,
    isModeSelected,
    isStyleSelected,
    isTerrainComplete,
    isChessmenComplete,
    isWizardActive,
  };
};
