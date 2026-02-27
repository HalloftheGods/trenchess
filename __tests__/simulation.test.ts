import { describe, it, expect } from "vitest";
import {
  createInitialState,
  applyClassicalFormation,
  generateElementalTerrain,
} from "@/core/setup/setupLogic";
import { getBestMove } from "@/core/bot/aiLogic";
import { getValidMoves, isPlayerInCheck } from "@/core/mechanics/movement";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types/game";
import { BOARD_SIZE, PIECES } from "@constants";

const isKingAlive = (board: (BoardPiece | null)[][], player: string) => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.player === player && p.type === PIECES.KING) return true;
    }
  }
  return false;
};

const hasAnyValidMoves = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
) => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.player === player) {
        const moves = getValidMoves(r, c, p, player, board, terrain, mode, 0);
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
};

const calculateMaterialBalance = (board: (BoardPiece | null)[][]) => {
  let score = 0;
  board.forEach((row) =>
    row.forEach((p) => {
      if (p) score += p.player === "red" ? 1 : -1;
    }),
  );
  return score;
};

describe.skip("CPU vs CPU Game Simulation", () => {
  const NUM_GAMES = 1;
  const MAX_TURNS = 300;

  it("runs a single simulation and outputs statistics", () => {
    let p1Wins = 0;
    let p2Wins = 0;
    let draws = 0;
    let totalMovesToWin = 0;
    let gamesFinished = 0;

    for (let g = 0; g < NUM_GAMES; g++) {
      const players = ["red", "yellow"];
      const mode: GameMode = "2p-ns";

      const initialState = createInitialState(mode, players);
      const { inventory } = initialState;
      let { board, terrain, terrainInventory } = initialState;

      const terrainSetupResult = generateElementalTerrain(
        terrain,
        board,
        terrainInventory,
        players,
        mode,
      );
      terrain = terrainSetupResult.terrain;
      terrainInventory = terrainSetupResult.terrainInventory;

      const setupResult = applyClassicalFormation(
        board,
        terrain,
        inventory,
        terrainInventory,
        players,
        mode,
      );
      board = setupResult.board;
      terrain = setupResult.terrain;

      let currentTurn = 0;
      let currentPlayerIdx = 0;
      let gameOver = false;

      while (!gameOver && currentTurn < MAX_TURNS) {
        const player = players[currentPlayerIdx];

        if (!isKingAlive(board, player)) {
          gameOver = true;
          const winner = players[(currentPlayerIdx + 1) % 2];
          if (winner === "red") p1Wins++;
          else p2Wins++;
          gamesFinished++;
          totalMovesToWin += currentTurn;
          continue;
        }

        const hasMoves = hasAnyValidMoves(player, board, terrain, mode);
        if (!hasMoves) {
          gameOver = true;
          if (isPlayerInCheck(player, board, terrain, mode)) {
            const winner = players[(currentPlayerIdx + 1) % 2];
            if (winner === "red") p1Wins++;
            else p2Wins++;
            gamesFinished++;
            totalMovesToWin += currentTurn;
          } else {
            draws++;
          }
          continue;
        }

        const bestMove = getBestMove(board, terrain, player, mode);
        if (!bestMove) {
          gameOver = true;
          draws++;
          continue;
        }

        const [fr, fc] = bestMove.from;
        const [tr, tc] = bestMove.to;

        board[tr][tc] = board[fr][fc];
        board[fr][fc] = null;

        if (currentTurn % 20 === 0) {
          const score = calculateMaterialBalance(board);
          console.log(`Turn ${currentTurn}: Material Balance ${score}`);
        }

        currentTurn++;
        currentPlayerIdx = (currentPlayerIdx + 1) % 2;
      }

      if (!gameOver && currentTurn >= MAX_TURNS) {
        draws++;
      }
    }

    const averageMoves =
      gamesFinished > 0 ? (totalMovesToWin / gamesFinished).toFixed(2) : 0;
    const winRateP1 = ((p1Wins / NUM_GAMES) * 100).toFixed(1);
    const winRateP2 = ((p2Wins / NUM_GAMES) * 100).toFixed(1);
    const drawRate = ((draws / NUM_GAMES) * 100).toFixed(1);

    console.log(`\n--- SIMULATION RESULTS (${NUM_GAMES} Games) ---`);
    console.log(`P1 Wins: ${p1Wins} (${winRateP1}%)`);
    console.log(`P2 Wins: ${p2Wins} (${winRateP2}%)`);
    console.log(`Draws/Timeouts: ${draws} (${drawRate}%)`);
    console.log(`Average Moves/Half-Turns to Win: ${averageMoves}`);
    console.log(`---------------------------------------\n`);

    expect(gamesFinished + draws).toBe(NUM_GAMES);
  }, 300000);
});
