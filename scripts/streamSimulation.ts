import { io } from "socket.io-client";
import {
  createInitialState,
  applyClassicalFormation,
} from "@/core/setup/setupLogic";
import { getBestMove } from "@/core/bot/aiLogic";
import { getValidMoves, isPlayerInCheck } from "@/core/mechanics";
import type { GameMode } from "@tc.types";

// Configuration
const SERVER_URL = "http://localhost:3001";
const ROOM_ID =
  "SIM_LIVE_" + Math.random().toString(36).substring(2, 6).toUpperCase();
const MOVE_DELAY_MS = 1500; // Slow down so it's watchable
const MAX_TURNS = 200;

console.log(`🚀 Starting Live Simulation Streamer...`);
console.log(`🔗 Connecting to ${SERVER_URL}`);

const socket = io(SERVER_URL);

socket.on("connect", () => {
  console.log(`✅ Connected! Socket ID: ${socket.id}`);
  console.log(`🏠 Joining Room: ${ROOM_ID}`);
  socket.emit("join_room", ROOM_ID);

  // Give a moment for the room to initialize
  setTimeout(startSimulation, 1000);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err.message);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
  (
    globalThis as { process?: { exit?: (code: number) => void } }
  ).process?.exit?.(0);
});

async function startSimulation() {
  const players = ["red", "yellow"];
  const mode = "2p-ns";

  const initialFullState = createInitialState(mode, players);
  let board = initialFullState.board;
  let terrain = initialFullState.terrain;

  const setupResult = applyClassicalFormation(
    board,
    terrain,
    initialFullState.inventory,
    initialFullState.terrainInventory,
    players,
    mode,
  );
  board = setupResult.board;
  terrain = setupResult.terrain;

  let currentTurn = 0;
  let currentPlayerIdx = 0;

  console.log(`🎮 Game Started in Room: ${ROOM_ID}`);

  while (currentTurn < MAX_TURNS) {
    const player = players[currentPlayerIdx];

    // Broadcast state
    socket.emit("update_game_state", {
      roomId: ROOM_ID,
      newState: {
        gameState: "combat",
        mode,
        board,
        terrain,
        turn: player,
        capturedBy: { red: [], yellow: [], green: [], blue: [] },
        activePlayers: players,
      },
    });

    // Check loss conditions using authoritative mechanics
    const hasMoves = board.some((boardRow, row) =>
      boardRow.some((cell, col) => {
        if (cell && cell.player === player) {
          const moves = getValidMoves(
            row,
            col,
            cell,
            player,
            board,
            terrain,
            mode as GameMode,
            0,
          );
          return moves.length > 0;
        }
        return false;
      }),
    );

    const kingExists = board.some((r) =>
      r.some((p) => p?.player === player && p?.type === "king"),
    );

    if (!kingExists || !hasMoves) {
      console.log(
        `🏁 Game Over! Result for ${player}: ${isPlayerInCheck(player, board, terrain, mode as GameMode) ? "CHECKMATE" : "STALEMATE/CAPTURED"}`,
      );
      break;
    }

    console.log(`🤖 AI Thinking for ${player}... (Turn ${currentTurn})`);
    const bestMove = getBestMove(board, terrain, player, mode as GameMode);

    if (!bestMove) {
      console.log(`⚠️ AI failed to find move for ${player}`);
      break;
    }

    // Apply move
    const { from, to } = bestMove;
    board[to[0]][to[1]] = board[from[0]][from[1]];
    board[from[0]][from[1]] = null;

    console.log(`✨ Move: [${from}] -> [${to}]`);

    // Broadcast move
    socket.emit("send_move", { roomId: ROOM_ID, move: bestMove });

    currentTurn++;
    currentPlayerIdx = (currentPlayerIdx + 1) % 2;

    // Wait for next move
    await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY_MS));
  }

  console.log(`✅ Simulation Finished.`);
  socket.disconnect();
}
