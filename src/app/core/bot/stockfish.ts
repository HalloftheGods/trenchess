import Stockfish from "fairy-stockfish-nnue.wasm/stockfish.js";
import type { BoardPiece } from "@tc.types/game";
import { BOARD_SIZE } from "@constants";
import { PIECES } from "@constants";

interface StockfishInstance {
  addMessageListener: (cb: (line: string) => void) => void;
  postMessage: (msg: string) => void;
  FS: {
    writeFile: (path: string, content: string) => void;
  };
}

class StockfishEngine {
  private engine: StockfishInstance | null = null;
  private ready: Promise<void> | null = null;
  private onResolveBestMove: ((move: string) => void) | null = null;

  constructor() {
    // Lazy initialization; don't allocate stockfish until requested.
  }

  public preload(): void {
    if (!this.ready) {
      this.ready = this.init();
    }
  }

  private async init() {
    try {
      // @ts-expect-error: Stockfish is a WASM module with non-standard initialization
      this.engine = await Stockfish({
        mainScriptUrlOrBlob:
          (typeof window !== "undefined" ? window.location.origin : "") +
          "/stockfish.js",
        locateFile: (path: string) => {
          const origin =
            typeof window !== "undefined" ? window.location.origin : "";
          if (path.endsWith(".wasm")) return origin + "/stockfish.wasm";
          if (path.endsWith(".worker.js"))
            return origin + "/stockfish.worker.js";
          if (path.endsWith(".js")) return origin + "/stockfish.js";
          return path;
        },
      });

      if (!this.engine) return;

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

        this.engine.postMessage("uci");
        this.engine.postMessage(
          "setoption name VariantPath value /variants.ini",
        );
        this.engine.postMessage("setoption name UCI_Variant value trenchess");
        this.engine.postMessage("setoption name Skill Level value 20");
        this.engine.postMessage("setoption name Hash value 64");
        this.engine.postMessage("isready");
      } catch (err) {
        console.error("Failed to load variants.ini", err);
      }
    } catch (err) {
      console.error("Stockfish initialization failed:", err);
      this.engine = null;
    }
  }

  public async getBestMove(
    board: (BoardPiece | null)[][],
    turn: string,
    validMovesUci: string,
  ): Promise<{
    from: [number, number];
    to: [number, number];
    score: number;
  } | null> {
    if (!this.ready) {
      this.ready = this.init();
    }
    await this.ready;

    if (!this.engine) {
      throw new Error("Stockfish engine not initialized");
    }

    const fen = this.boardToFen(board, turn);
    this.engine.postMessage(`position fen ${fen}`);

    // Default to searchmoves to restrict AI choices. Fallback to full search if not provided.
    if (validMovesUci) {
      this.engine.postMessage(`go depth 15 searchmoves ${validMovesUci}`);
    } else {
      this.engine.postMessage("go depth 15");
    }

    return new Promise((resolve) => {
      this.onResolveBestMove = (moveStr: string) => {
        if (!moveStr || moveStr === "(none)") {
          resolve(null);
          return;
        }
        const move = this.uciToMove(moveStr);
        resolve({ ...move, score: 0 });
      };
    });
  }

  private uciToMove(uci: string): {
    from: [number, number];
    to: [number, number];
  } {
    const match = uci.match(/^([a-z])(\d+)([a-z])(\d+)([a-z]?)$/);
    if (!match) {
      throw new Error("Invalid UCI format: " + uci);
    }
    const fromFile = match[1].charCodeAt(0) - 97; // 'a'
    const fromRank = parseInt(match[2], 10);
    const toFile = match[3].charCodeAt(0) - 97;
    const toRank = parseInt(match[4], 10);

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
          let char = "";
          switch (p.type) {
            case PIECES.PAWN:
              char = "p";
              break;
            case PIECES.KNIGHT:
              char = "n";
              break;
            case PIECES.BISHOP:
              char = "b";
              break;
            case PIECES.ROOK:
              char = "r";
              break;
            case PIECES.QUEEN:
              char = "q";
              break;
            case PIECES.KING:
              char = "k";
              break;
          }

          if (p.player === "red" || p.player === "green") {
            fen += char.toUpperCase();
          } else {
            fen += char.toLowerCase();
          }
        }
      }
      if (empty > 0) fen += empty;
      if (r < BOARD_SIZE - 1) fen += "/";
    }

    const side = turn === "red" || turn === "green" ? "w" : "b";
    fen += ` ${side} - - 0 1`;

    return fen;
  }
}

export const engineService = new StockfishEngine();
