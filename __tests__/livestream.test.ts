import { describe, it } from "vitest";
import { io } from "socket.io-client";
import {
  createInitialState,
  applyClassicalFormation,
  generateElementalTerrain,
} from "@/app/core/setup/setupLogic";
import type { GameMode } from "@tc.types/game";
import { getBestMove } from "@/app/core/bot/aiLogic";

const SERVER_URL = "http://localhost:3001";
const ROOM_ID =
  "LIVE_SIM_" + Math.random().toString(36).substring(2, 6).toUpperCase();
const MOVE_DELAY_MS = 2000;
const MAX_TURNS = 100;

// Skipped on purpose: needs the game server listening on http://localhost:3001
// (otherwise ECONNREFUSED). Start the server, then change describe.skip to describe.
describe.skip("Live Simulation Stream", () => {
  it("runs a simulation and streams it to the server", async () => {
    console.log(`🚀 Connecting to ${SERVER_URL}`);
    const socket = io(SERVER_URL);

    await new Promise((resolve) => {
      socket.on("connect", () => {
        console.log(`✅ Connected! Room: ${ROOM_ID}`);
        socket.emit("join_room", ROOM_ID);
        resolve(true);
      });
    });

    const players = ["red", "yellow"];
    const mode = "2p-ns";

    const {
      board: initialBoard,
      terrain: initialTerrain,
      inventory,
      terrainInventory: initialTerrainInventory,
    } = createInitialState(mode, players);
    let board = initialBoard;
    let terrain = initialTerrain;
    let terrainInventory = initialTerrainInventory;

    const terrainSetupResult = generateElementalTerrain(
      terrain,
      board,
      terrainInventory,
      players,
      mode as "2p-ns",
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

      // Sync state to server
      socket.emit("update_game_state", {
        roomId: ROOM_ID,
        newState: {
          gameState: "combat", // Still string because PHASES might not be easily importable in this pure-TS test without more setup
          mode,
          board,
          terrain,
          turn: player,
          capturedBy: { red: [], yellow: [], green: [], blue: [] },
          activePlayers: players,
        },
      });

      // Search for move
      console.log(`🤖 [${currentTurn}] AI Thinking for ${player}...`);
      const bestMove = getBestMove(board, terrain, player, mode as GameMode);

      if (!bestMove) {
        console.log(`⚠️ No move found for ${player}`);
        break;
      }

      // Apply move
      const { from, to } = bestMove;
      board[to[0]][to[1]] = board[from[0]][from[1]];
      board[from[0]][from[1]] = null;

      console.log(`✨ Move: [${from}] -> [${to}]`);
      socket.emit("send_move", { roomId: ROOM_ID, move: bestMove });

      currentTurn++;
      currentPlayerIdx = (currentPlayerIdx + 1) % 2;

      await new Promise((r) => setTimeout(r, MOVE_DELAY_MS));

      // Check if game is over (simple check)
      let kings = 0;
      board.forEach((row) =>
        row.forEach((p) => {
          if (p?.type === "king") kings++;
        }),
      );
      if (kings < 2) {
        console.log("🏁 Game Over: King Captured!");
        gameOver = true;
      }
    }

    console.log("✅ Simulation stream complete.");
    socket.disconnect();
  }, 600000);
});
