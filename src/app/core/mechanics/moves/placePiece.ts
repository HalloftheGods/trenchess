import { INVALID_MOVE } from "boardgame.io/core";
import { resolvePlayerId } from "@/app/core/setup/coreHelpers";
import { isWithinTerritory } from "./base/territory";
import { applyPiecePlacement } from "@/app/core/setup/placement";
import type { PieceType, TrenchessState } from "@tc.types";
import type { Ctx } from "boardgame.io";

export const placePiece = (
  {
    G: gameState,
    playerID,
    ctx: context,
  }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  row: number,
  col: number,
  type: PieceType | null,
  explicitPid?: string,
  allowExplicit?: boolean,
) => {
  const playerId = resolvePlayerId(
    gameState,
    context,
    playerID,
    explicitPid,
    allowExplicit || gameState.isGamemaster,
  );

  if (!playerId) return INVALID_MOVE;

  const isAuthoritativeGM = gameState.isGamemaster;
  const isPlayerPlacingInOwnTerritory = isWithinTerritory(
    playerId,
    gameState.mode,
    [row, col],
  );

  if (!isAuthoritativeGM && !isPlayerPlacingInOwnTerritory) return INVALID_MOVE;

  const result = applyPiecePlacement(
    gameState,
    playerId,
    row,
    col,
    type,
    gameState.mode,
    isAuthoritativeGM,
  );

  if (result === INVALID_MOVE) return INVALID_MOVE;

  // applyPiecePlacement returns a new state object, but boardgame.io expects mutations to G
  gameState.board = result.board;
  gameState.inventory = result.inventory;
  if (result.mercenaryPoints)
    gameState.mercenaryPoints = result.mercenaryPoints;
};
