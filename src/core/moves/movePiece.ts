import { INVALID_MOVE } from "boardgame.io/core";
import { BOARD_SIZE } from "@/constants";
import { PIECES } from "@/constants";
import type { TrenchessState, BoardPiece } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";
import { applyDesertRule } from "@/core/events";

const { KING, QUEEN, PAWN } = PIECES;

const handlePawnPromotion = (
  G: TrenchessState,
  piece: BoardPiece,
  toR: number,
  toC: number,
  pid: string
) => {
  if (piece.type !== PAWN) return;

  const isNSPromotion =
    G.mode === "2p-ns" &&
    ((pid === "red" && toR === BOARD_SIZE - 1) || (pid === "blue" && toR === 0));

  const isEWPromotion =
    G.mode === "2p-ew" &&
    ((pid === "green" && toC === BOARD_SIZE - 1) || (pid === "yellow" && toC === 0));

  const is4PPromotion =
    G.mode === "4p" &&
    ((pid === "red" && (toR === BOARD_SIZE - 1 || toC === BOARD_SIZE - 1)) ||
      (pid === "yellow" && (toR === BOARD_SIZE - 1 || toC === 0)) ||
      (pid === "green" && (toR === 0 || toC === BOARD_SIZE - 1)) ||
      (pid === "blue" && (toR === 0 || toC === 0)));

  if (isNSPromotion || isEWPromotion || is4PPromotion) {
    G.board[toR][toC] = { ...piece, type: QUEEN };
  }
};

const handleJoustCapture = (
  G: TrenchessState,
  piece: BoardPiece,
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
  pid: string
): BoardPiece | null => {
  if (piece.type !== KING) return null;

  const isRowJoust = Math.abs(fromR - toR) === 2 && fromC === toC;
  const isColJoust = Math.abs(fromC - toC) === 2 && fromR === toR;

  if (isRowJoust || isColJoust) {
    const midR = fromR + (toR - fromR) / 2;
    const midC = fromC + (toC - fromC) / 2;
    const midPiece = G.board[midR][midC];

    if (midPiece && midPiece.player !== pid) {
      G.board[midR][midC] = null;
      return midPiece;
    }
  }

  return null;
};

const handleCapture = (
  G: TrenchessState,
  capturedPiece: BoardPiece,
  pid: string
) => {
  if (capturedPiece.player === pid) return INVALID_MOVE;
  
  G.capturedBy[pid].push(capturedPiece);

  if (capturedPiece.type === KING) {
    const victim = capturedPiece.player;
    G.activePlayers = G.activePlayers.filter((p: string) => p !== victim);

    // Victim's remaining pieces convert to capturer
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (G.board[r][c]?.player === victim) {
          G.board[r][c]!.player = pid;
        }
      }
    }
  }
};

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

  const targetPiece = G.board[toR][toC];

  // 1. Move Piece Atom
  G.board[toR][toC] = piece;
  G.board[fromR][fromC] = null;

  // 2. Promotion Molecule
  handlePawnPromotion(G, piece, toR, toC, pid);

  // 3. Joust Capture Molecule
  const joustedPiece = handleJoustCapture(G, piece, fromR, fromC, toR, toC, pid);
  const capturedPiece = joustedPiece || targetPiece;

  // 4. Resolve Capture Molecule
  if (capturedPiece) {
    const captureResult = handleCapture(G, capturedPiece, pid);
    if (captureResult === INVALID_MOVE) return INVALID_MOVE;
  }

  // 5. Apply Terrain Rules
  applyDesertRule(G, pid, { r: toR, c: toC });
};
