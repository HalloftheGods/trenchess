import { INVALID_MOVE } from "boardgame.io/core";
import { canPlaceUnit, getPlayerCells } from "@/core/setup/setupLogic";
import type { PieceType, TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export const placePiece = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  r: number,
  c: number,
  type: PieceType | null,
  explicitPid?: string,
) => {
  const pid =
    explicitPid ||
    (playerID !== undefined
      ? G.playerMap[playerID]
      : G.playerMap[ctx.currentPlayer]);
  if (!pid || !G.activePlayers.includes(pid)) return INVALID_MOVE;

  const myCells = getPlayerCells(pid, G.mode);
  if (!myCells.some(([cellR, cellC]) => cellR === r && cellC === c)) {
    return INVALID_MOVE;
  }

  const oldPiece = G.board[r][c];

  if (type === null) {
    if (oldPiece && oldPiece.player === pid) {
      G.inventory[pid].push(oldPiece.type);
      G.board[r][c] = null;
    }
    return;
  }

  if (!canPlaceUnit(type, G.terrain[r][c])) return INVALID_MOVE;

  const idx = G.inventory[pid]?.indexOf(type);
  if (idx === -1 || idx === undefined) return INVALID_MOVE;

  if (oldPiece && oldPiece.player === pid) {
    G.inventory[pid].push(oldPiece.type);
  }

  G.board[r][c] = { type, player: pid };
  G.inventory[pid].splice(idx, 1);
};
