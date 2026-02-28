import { createInitialState } from "@/app/core/setup/setupLogic";
import type { GameState, TrenchessState } from "@tc.types";
import type { Ctx } from "boardgame.io";
import { PHASES } from "@constants/game";

export function useEngineDerivations(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
) {
  const G: TrenchessState =
    bgioState?.G || (createInitialState(null, []) as TrenchessState);
  const ctx: Ctx = bgioState?.ctx || ({} as Ctx);

  const {
    board,
    terrain,
    inventory,
    terrainInventory,
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
  };
}
