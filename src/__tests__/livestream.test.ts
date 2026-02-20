import { describe, it } from "vitest";
import { io } from "socket.io-client";
import {
  createInitialState,
  applyClassicalFormation,
  generateElementalTerrain,
} from "../utils/setupLogic";
import { getBestMove } from "../utils/aiLogic";
import { getValidMoves, isPlayerInCheck } from "../utils/gameLogic";
import { BOARD_SIZE } from "../constants";

const SERVER_URL = "http://localhost:3001";
const ROOM_ID =
  "LIVE_SIM_" + Math.random().toString(36).substring(2, 6).toUpperCase();
const MOVE_DELAY_MS = 2000;
const MAX_TURNS = 100;

describe("Live Simulation Stream", () => {
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

    const players = ["player1", "player2"];
    const mode = "2p-ns";

    let { board, terrain, inventory, terrainInventory } = createInitialState(
      mode,
      players,
    );

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
          gameState: "play",
          mode,
          board,
          terrain,
          turn: player,
          capturedBy: { player1: [], player2: [], player3: [], player4: [] },
          activePlayers: players,
        },
      });

      // Search for move
      console.log(`🤖 [${currentTurn}] AI Thinking for ${player}...`);
      const bestMove = getBestMove(board, terrain, player, mode as any);

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
          if (p?.type === "commander") kings++;
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
