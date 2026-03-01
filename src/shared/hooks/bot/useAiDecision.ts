import { useCallback } from "react";
import { getValidMoves } from "@/app/core/mechanics";
import { engineService } from "@/app/core/bot/stockfishLogic";
import { BOARD_SIZE } from "@constants";
import type { GameMode, BoardPiece, TerrainType } from "@tc.types/game";

export function useAiDecision() {
  const getDecision = useCallback(
    async (
      board: (BoardPiece | null)[][],
      terrain: TerrainType[][],
      turn: string,
      mode: GameMode,
    ) => {
      try {
        // Collect all legal moves mapped to UCI format to restrict Stockfish.
        // This solves the terrain limitation because Stockfish will only search
        // moves that the JS engine has determined are legal by Trenchess rules.
        const validUciMoves: string[] = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            const piece = board[r][c];
            if (piece && piece.player === turn) {
              const pieceMoves = getValidMoves(
                r,
                c,
                piece,
                turn,
                board,
                terrain,
                mode,
              );

              for (const [tr, tc] of pieceMoves) {
                // UCI Format: file(0-indexed from 'a') + rank(1-indexed from '1')
                const fromUci = String.fromCharCode(97 + c) + (12 - r);
                const toUci = String.fromCharCode(97 + tc) + (12 - tr);

                validUciMoves.push(`${fromUci}${toUci}`);
              }
            }
          }
        }

        if (validUciMoves.length === 0) {
          return null;
        }

        const sfMove = await engineService.getBestMove(
          board,
          turn,
          validUciMoves.join(" "),
        );

        if (!sfMove) {
          // Fallback to random move if stockfish fails
          const randomUci =
            validUciMoves[Math.floor(Math.random() * validUciMoves.length)];

          const match = randomUci.match(/^([a-z])(\d+)([a-z])(\d+)([a-z]?)$/);
          if (match) {
            const fromFile = match[1].charCodeAt(0) - 97;
            const fromRank = parseInt(match[2], 10);
            const toFile = match[3].charCodeAt(0) - 97;
            const toRank = parseInt(match[4], 10);
            return {
              from: [12 - fromRank, fromFile] as [number, number],
              to: [12 - toRank, toFile] as [number, number],
              score: 0,
            };
          }
          return null;
        }

        return sfMove;
      } catch (e) {
        console.error("Stockfish failed to calculate a move:", e);
        return null;
      }
    },
    [],
  );

  return { getDecision };
}
