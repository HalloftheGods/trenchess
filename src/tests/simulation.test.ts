import { describe, it, expect } from "vitest";
import {
  createInitialState,
  applyClassicalFormation,
  generateElementalTerrain,
} from "@/core/setup/setupLogic";
import { getBestMove } from "@/core/ai/aiLogic";
import { getValidMoves, isPlayerInCheck } from "@/core/rules/gameLogic";
import type { GameMode } from "@/shared/types/game";
import { BOARD_SIZE } from "@/shared/constants/core.constants";
import { PIECES } from "@/core/data/unitDetails";

// Helper to find the king and check if captured
const isKingAlive = (board: any[][], player: string) => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.player === player && p.type === PIECES.KING) {
        return true;
      }
    }
  }
  return false;
};

// Returns if there are arbitrary valid moves
const hasAnyValidMoves = (
  player: string,
  board: any[][],
  terrain: any[][],
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

describe("CPU vs CPU Game Simulation", () => {
  const NUM_GAMES = 1;
  const MAX_TURNS = 300; // Cap to ensure the game finishes and reports stats

  it("runs a single simulation and outputs statistics", () => {
    let p1Wins = 0;
    let p2Wins = 0;
    let draws = 0;
    let totalMovesToWin = 0;
    let gamesFinished = 0;

    for (let g = 0; g < NUM_GAMES; g++) {
      const players = ["red", "yellow"];
      const mode: GameMode = "2p-ns";

      // Setup initial state
      let { board, terrain, inventory, terrainInventory } = createInitialState(
        mode,
        players,
      );

      // Add Terrain (32 pieces)
      const terrainSetupResult = generateElementalTerrain(
        terrain,
        board,
        terrainInventory,
        players,
        mode,
      );
      terrain = terrainSetupResult.terrain;
      terrainInventory = terrainSetupResult.terrainInventory;

      // Setup classical board
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

        // 1. Check if king is dead (should not happen normally without checkmate first, but fallback)
        if (!isKingAlive(board, player)) {
          // This player lost
          gameOver = true;
          const winner = players[(currentPlayerIdx + 1) % 2];
          if (winner === "red") p1Wins++;
          else p2Wins++;
          gamesFinished++;
          totalMovesToWin += currentTurn;
          continue;
        }

        // 2. Check for checkmate or stalemate
        const hasMoves = hasAnyValidMoves(player, board, terrain, mode);
        if (!hasMoves) {
          gameOver = true;
          if (isPlayerInCheck(player, board, terrain, mode)) {
            // Checkmate! The other player won.
            const winner = players[(currentPlayerIdx + 1) % 2];
            if (winner === "red") p1Wins++;
            else p2Wins++;
            gamesFinished++;
            totalMovesToWin += currentTurn;
          } else {
            // Stalemate
            draws++;
          }
          continue;
        }

        // 3. AI gets best move
        const bestMove = getBestMove(board, terrain, player, mode);

        if (!bestMove) {
          // AI failed to find a move despite `hasAnyValidMoves` being true
          gameOver = true;
          draws++;
          continue;
        }

        // Apply Move
        const [fr, fc] = bestMove.from;
        const [tr, tc] = bestMove.to;

        board[tr][tc] = board[fr][fc];
        board[fr][fc] = null;

        // Progress logging
        if (currentTurn % 20 === 0) {
          let score = 0;
          board.forEach((row) =>
            row.forEach((p) => {
              if (p) score += p.player === "red" ? 1 : -1;
            }),
          );
          // console.log(`Turn ${currentTurn}: Material Balance ${score}`);
        }

        // Next turn
        currentTurn++;
        currentPlayerIdx = (currentPlayerIdx + 1) % 2;
      }

      if (!gameOver && currentTurn >= MAX_TURNS) {
        draws++; // Hit max turns
        // console.log(`Game ${g} hit max turns`);
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
    // You'd typically assert things here based on what you expect,
    // e.g. ensuring it doesn't always timeout.
    expect(draws).toBeLessThan(NUM_GAMES); // At least one game should end decisively, hopefully.
  }, 300000); // Allow long timeout for test
});
