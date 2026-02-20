import Stockfish from "fairy-stockfish-nnue.wasm/stockfish.js";
import type { BoardPiece } from "../types";
import { PIECES, BOARD_SIZE } from "../constants";

class StockfishEngine {
  private engine: any = null;
  private ready: Promise<void>;
  private onResolveBestMove: ((move: string) => void) | null = null;

  constructor() {
    this.ready = this.init();
  }

  private async init() {
    return new Promise<void>(async (resolve) => {
      try {
        // @ts-ignore
        this.engine = await Stockfish();

        // Setup listener
        this.engine.addMessageListener((line: string) => {
          console.log("SF:", line);
          if (line.startsWith("bestmove")) {
            const moveStr = line.split(" ")[1];
            if (this.onResolveBestMove) {
              this.onResolveBestMove(moveStr);
              this.onResolveBestMove = null;
            }
          }
        });

        // Feed variants.ini
        try {
          const response = await fetch("/variants.ini");
          if (!response.ok) throw new Error("variants.ini not found");
          const text = await response.text();
          // Write to virtual filesystem
          this.engine.FS.writeFile("/variants.ini", text);

          // Initialize UCI
          this.engine.postMessage("uci");
          this.engine.postMessage(
            "setoption name VariantsFile value /variants.ini",
          );
          this.engine.postMessage(
            "setoption name MultiVariant value trenchess",
          );
          this.engine.postMessage("isready");
        } catch (err) {
          console.error("Failed to load variants.ini", err);
        }
      } catch (err) {
        console.error("Stockfish initialization failed:", err);
        this.engine = null;
      }

      resolve();
    });
  }

  public async getBestMove(
    board: (BoardPiece | null)[][],
    turn: string,
  ): Promise<{ from: [number, number]; to: [number, number]; score: number }> {
    await this.ready;

    if (!this.engine) {
      throw new Error("Stockfish engine not initialized");
    }

    const fen = this.boardToFen(board, turn);
    this.engine.postMessage(`position fen ${fen}`);
    this.engine.postMessage("go depth 8"); // Depth 8 is fast enough for browser but very strong

    return new Promise((resolve) => {
      this.onResolveBestMove = (moveStr: string) => {
        const move = this.uciToMove(moveStr);
        resolve({ ...move, score: 0 }); // Score is optional for raw moves
      };
    });
  }

  private uciToMove(uci: string): {
    from: [number, number];
    to: [number, number];
  } {
    const fromFile = uci.charCodeAt(0) - 97; // 'a'
    const fromRank = parseInt(uci.substring(1, uci.length - 2));
    const toFile = uci.charCodeAt(uci.length - 2) - 97;
    const toRank = parseInt(uci.substring(uci.length - 1));

    // Row = 12 - Rank
    // Web board uses 0-indexed rows from top
    return {
      from: [12 - fromRank, fromFile],
      to: [12 - toRank, toFile],
    };
  }

  private boardToFen(board: (BoardPiece | null)[][], turn: string): string {
    let fen = "";
    for (let r = 0; r < BOARD_SIZE; r++) {
      let empty = 0;
      for (let c = 0; c < BOARD_SIZE; c++) {
        const p = board[r][c];
        if (!p) {
          empty++;
        } else {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          // Map our piece types to single-char FEN
          // p: horseman, b: sniper, r: tank, q: battleknight, k: commander
          let char = "";
          switch (p.type) {
            case PIECES.BOT:
              char = "p";
              break;
            case PIECES.HORSEMAN:
              char = "n";
              break;
            case PIECES.SNIPER:
              char = "b";
              break;
            case PIECES.TANK:
              char = "r";
              break;
            case PIECES.BATTLEKNIGHT:
              char = "q";
              break;
            case PIECES.COMMANDER:
              char = "k";
              break;
          }

          if (p.player === "player1" || p.player === "player3") {
            fen += char.toUpperCase();
          } else {
            fen += char.toLowerCase();
          }
        }
      }
      if (empty > 0) fen += empty;
      if (r < BOARD_SIZE - 1) fen += "/";
    }

    // Active color: w for p1/p3 (White-ish), b for p2/p4 (Black-ish)
    const side = turn === "player1" || turn === "player3" ? "w" : "b";
    fen += ` ${side} - - 0 1`;

    return fen;
  }
}

export const engineService = new StockfishEngine();
