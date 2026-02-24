import { INVALID_MOVE } from "boardgame.io/core";
import { canPlaceUnit, getPlayerCells } from "@/core/setup/setupLogic";
import type { PieceType, TrenchessState, GameMode } from "@/shared/types";
import type { Ctx } from "boardgame.io";

const resolvePlayerId = (
  G: TrenchessState,
  ctx: Ctx,
  playerID?: string,
  explicitPid?: string
): string | null => {
  const pid = explicitPid || (playerID !== undefined ? G.playerMap[playerID] : G.playerMap[ctx.currentPlayer]);
  return pid && G.activePlayers.includes(pid) ? pid : null;
};

const isWithinTerritory = (
  pid: string,
  mode: GameMode,
  r: number,
  c: number
): boolean => {
  const myCells = getPlayerCells(pid, mode);
  return myCells.some(([cellR, cellC]) => cellR === r && cellC === c);
};

export const placePiece = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  r: number,
  c: number,
  type: PieceType | null,
  explicitPid?: string,
) => {
  const pid = resolvePlayerId(G, ctx, playerID, explicitPid);
  if (!pid) return INVALID_MOVE;

  if (!isWithinTerritory(pid, G.mode, r, c)) return INVALID_MOVE;

  const oldPiece = G.board[r][c];

  // 1. Remove/Reclaim Atom
  if (type === null) {
    if (oldPiece && oldPiece.player === pid) {
      G.inventory[pid].push(oldPiece.type);
      G.board[r][c] = null;
    }
    return;
  }

  // 2. Validate Placement Atom
  if (!canPlaceUnit(type, G.terrain[r][c])) return INVALID_MOVE;

  const idx = G.inventory[pid]?.indexOf(type);
  if (idx === -1 || idx === undefined) return INVALID_MOVE;

  // 3. Swap Atom
  if (oldPiece && oldPiece.player === pid) {
    G.inventory[pid].push(oldPiece.type);
  }

  G.board[r][c] = { type, player: pid };
  G.inventory[pid].splice(idx, 1);
};
