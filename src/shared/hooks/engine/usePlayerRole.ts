import type { TrenchessState } from "@tc.types/game";
import type { Ctx } from "boardgame.io";

export function usePlayerRole(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
  playerID?: string,
) {
  const G = bgioState?.G;
  const ctx = bgioState?.ctx;
  const playerMap = G?.playerMap;
  const currentPlayer = ctx?.currentPlayer;

  // Zero-lag derivation from authoritative pointers
  const currentTurn = (currentPlayer && playerMap?.[currentPlayer]) || "red";
  const localPlayer = (playerID && playerMap?.[playerID]) || currentTurn;

  return { currentTurn, localPlayer };
}
