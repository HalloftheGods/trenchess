import { createInitialState } from "@/app/core/setup/setupLogic";
import type { GameState, TrenchessState, TerrainType } from "@tc.types";
import type { Ctx } from "boardgame.io";
import { PHASES, BOARD_SIZE, TERRAIN_TYPES } from "@constants";

export function useEngineDerivations(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
) {
  const G: TrenchessState =
    bgioState?.G || (createInitialState(null, []) as TrenchessState);
  const ctx: Ctx = bgioState?.ctx || ({} as Ctx);

  const {
    board = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null)),
    terrain = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT as TerrainType)),
    inventory = {},
    terrainInventory = {},
    capturedBy,
    activePlayers,
    readyPlayers,
    lastMove,
    mode,
  } = G;

  const winner = ctx?.gameover?.winner ?? null;
  const winnerReason = ctx?.gameover?.reason ?? null;
  const gameState = (ctx?.phase as GameState) || PHASES.MENU;
  const activeMode = mode || "4p";

  return {
    G,
    ctx,
    board,
    terrain,
    inventory,
    terrainInventory,
    capturedBy,
    activePlayers,
    readyPlayers,
    lastMove,
    mode,
    winner,
    winnerReason,
    gameState,
    activeMode,
    isGamemaster: G.isGamemaster,
  };
}
