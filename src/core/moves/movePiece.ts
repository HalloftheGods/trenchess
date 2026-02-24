import { INVALID_MOVE } from "boardgame.io/core";
import { BOARD_SIZE } from "@/constants";
import { PIECES } from "@/constants";
import type { TrenchessState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";
import { applyDesertRule } from "@/core/events";

const { KING, QUEEN, PAWN } = PIECES;

export const movePiece = (
  { G, playerID, ctx }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  from: [number, number],
  to: [number, number],
) => {
  const [fromR, fromC] = from;
  const [toR, toC] = to;

  const pid =
    playerID !== undefined
      ? G.playerMap[playerID]
      : G.playerMap[ctx.currentPlayer];

  if (!pid) return INVALID_MOVE;

  const piece = G.board[fromR][fromC];
  if (!piece || piece.player !== pid) return INVALID_MOVE;

  const captured = G.board[toR][toC];

  // Execute Move
  G.board[toR][toC] = piece;
  G.board[fromR][fromC] = null;

  // Pawn Promotion Logic
  if (piece.type === PAWN) {
    let promoted = false;
    if (G.mode === "2p-ns") {
      if (pid === "red" && toR === BOARD_SIZE - 1) promoted = true;
      if (pid === "blue" && toR === 0) promoted = true;
    } else if (G.mode === "2p-ew") {
      if (pid === "green" && toC === BOARD_SIZE - 1) promoted = true;
      if (pid === "yellow" && toC === 0) promoted = true;
    } else {
      // 4P Promotion
      if (pid === "red" && (toR === BOARD_SIZE - 1 || toC === BOARD_SIZE - 1))
        promoted = true;
      if (pid === "yellow" && (toR === BOARD_SIZE - 1 || toC === 0))
        promoted = true;
      if (pid === "green" && (toR === 0 || toC === BOARD_SIZE - 1))
        promoted = true;
      if (pid === "blue" && (toR === 0 || toC === 0)) promoted = true;
    }

    if (promoted) {
      G.board[toR][toC] = { ...piece, type: QUEEN };
    }
  }

  let capturedPiece = captured;

  // King Joust Capture (Checkers-style leap)
  if (
    piece.type === KING &&
    ((Math.abs(fromR - toR) === 2 && fromC === toC) ||
      (Math.abs(fromC - toC) === 2 && fromR === toR))
  ) {
    const midR = fromR + (toR - fromR) / 2;
    const midC = fromC + (toC - fromC) / 2;
    const midPiece = G.board[midR][midC];
    if (midPiece && midPiece.player !== pid) {
      capturedPiece = midPiece;
      G.board[midR][midC] = null;
    }
  }

  // Handle Capture
  if (capturedPiece) {
    if (capturedPiece.player === pid) return INVALID_MOVE;
    G.capturedBy[pid].push(capturedPiece);

    // End Game Condition (King Captured)
    if (capturedPiece.type === KING) {
      const victim = capturedPiece.player;
      G.activePlayers = G.activePlayers.filter((p: string) => p !== victim);

      // Legacy rule: Victim's remaining pieces convert to capturer?
      // Actually, Trenchess endIf currently just checks activePlayers length.
      // We'll keep the piece conversion for now as per current playPhase implementation.
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (G.board[r][c]?.player === victim) {
            G.board[r][c]!.player = pid;
          }
        }
      }
    }
  }

  // Desert Rule: Must exit or perish next turn
  applyDesertRule(G, pid, { r: toR, c: toC });
};
