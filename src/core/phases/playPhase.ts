import { INVALID_MOVE } from "boardgame.io/core";
import { BOARD_SIZE } from "@/core/constants/core.constants";
import { PIECES } from "@/core/data/unitDetails";
import { TERRAIN_TYPES } from "@/core/data/terrainDetails";
import type { PieceType, TrenchGameState } from "@/shared/types/game";
import type { Ctx } from "boardgame.io";

export const playPhase = {
  turn: {
    order: {
      first: () => 0,
      next: ({ G, ctx }: { G: TrenchGameState; ctx: Ctx }) =>
        (ctx.playOrderPos + 1) % G.activePlayers.length,
    },
  },
  moves: {
    movePiece: (
      { G, playerID, ctx }: { G: TrenchGameState; playerID?: string; ctx: Ctx },
      from: [number, number],
      to: [number, number],
    ) => {
      console.log("[movePiece] Attempting move:", {
        playerID,
        currentPlayer: ctx.currentPlayer,
        from,
        to,
      });
      const [fromR, fromC] = from;
      const [toR, toC] = to;

      // BGIO standard: playerID is provided by client, but we can fall back to currentPlayer in local
      const pid =
        playerID !== undefined
          ? G.playerMap[playerID]
          : G.playerMap[ctx.currentPlayer];
      if (!pid) {
        console.error("[movePiece] INVALID_MOVE: No mapped player ID found", {
          playerMap: G.playerMap,
          playerID,
          currentPlayer: ctx.currentPlayer,
        });
        return INVALID_MOVE;
      }

      const piece = G.board[fromR][fromC];

      if (!piece || piece.player !== pid) {
        console.error(
          "[movePiece] INVALID_MOVE: No piece at from, or piece doesn't belong to player",
          { pid, piece },
        );
        return INVALID_MOVE;
      }

      console.log("[movePiece] Piece to move:", piece);

      const captured = G.board[toR][toC];

      G.board[toR][toC] = piece;
      G.board[fromR][fromC] = null;

      if (piece.type === PIECES.PAWN) {
        let promoted = false;
        if (G.mode === "2p-ns") {
          if (pid === "red" && toR === BOARD_SIZE - 1) promoted = true;
          if (pid === "blue" && toR === 0) promoted = true;
        } else if (G.mode === "2p-ew") {
          if (pid === "green" && toC === BOARD_SIZE - 1) promoted = true;
          if (pid === "yellow" && toC === 0) promoted = true;
        } else {
          if (
            pid === "red" &&
            (toR === BOARD_SIZE - 1 || toC === BOARD_SIZE - 1)
          )
            promoted = true;
          if (pid === "yellow" && (toR === BOARD_SIZE - 1 || toC === 0))
            promoted = true;
          if (pid === "green" && (toR === 0 || toC === BOARD_SIZE - 1))
            promoted = true;
          if (pid === "blue" && (toR === 0 || toC === 0)) promoted = true;
        }

        if (promoted) {
          G.board[toR][toC] = { ...piece, type: PIECES.QUEEN as PieceType };
        }
      }

      let capturedPiece = captured;

      // Handle King Joust Capture (Checkers-style leap)
      if (
        piece.type === PIECES.KING &&
        ((Math.abs(fromR - toR) === 2 && fromC === toC) ||
          (Math.abs(fromC - toC) === 2 && fromR === toR))
      ) {
        const midR = fromR + (toR - fromR) / 2;
        const midC = fromC + (toC - fromC) / 2;
        const midPiece = G.board[midR][midC];
        if (midPiece && midPiece.player !== pid) {
          capturedPiece = midPiece;
          G.board[midR][midC] = null; // Remove the jumped piece
          console.log("[movePiece] King mid-air capture:", capturedPiece);
        }
      }

      if (capturedPiece) {
        console.log("[movePiece] Handling capture piece:", capturedPiece);
        if (capturedPiece.player === pid) {
          console.error("[movePiece] INVALID_MOVE: Cannot capture own piece");
          return INVALID_MOVE;
        }
        G.capturedBy[pid].push(capturedPiece);

        if (capturedPiece.type === PIECES.KING) {
          const victim = capturedPiece.player;
          G.activePlayers = G.activePlayers.filter((p: string) => p !== victim);
          for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
              if (G.board[r][c]?.player === victim) {
                G.board[r][c]!.player = pid;
              }
            }
          }
        }
      }

      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const p = G.board[r][c];
          if (
            p &&
            p.player === pid &&
            G.terrain[r][c] === TERRAIN_TYPES.DESERT
          ) {
            if (r !== toR || c !== toC) {
              if (p.type === PIECES.KING) {
                const victim = p.player;
                G.activePlayers = G.activePlayers.filter(
                  (ap: string) => ap !== victim,
                );
                for (let row = 0; row < BOARD_SIZE; row++) {
                  for (let col = 0; col < BOARD_SIZE; col++) {
                    if (G.board[row][col]?.player === victim)
                      G.board[row][col] = null;
                  }
                }
              } else {
                G.board[r][c] = null;
              }
            }
          }
        }
      }
    },
  },
};
