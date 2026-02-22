import { io } from "socket.io-client";
import {
  createInitialState,
  applyClassicalFormation,
} from "@setup/setupLogic";
import { getBestMove } from "@ai/aiLogic";
import { getValidMoves, isPlayerInCheck } from "@logic/gameLogic";

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

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
  (globalThis as any).process?.exit?.(0);
});

const isKingAlive = (board: any[][], player: string) => {
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      const p = board[r][c];
      if (p && p.player === player && p.type === "commander") return true;
    }
  }
  return false;
};

const hasAnyValidMoves = (player: string, board: any[][], terrain: any[][]) => {
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      const p = board[r][c];
      if (p && p.player === player) {
        const moves = getValidMoves(
          r,
          c,
          p,
          player,
          board,
          terrain,
          "2p-ns",
          0,
        );
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
};

async function startSimulation() {
  const players = ["player1", "player2"];
  const mode = "2p-ns";

  let { board, terrain, inventory, terrainInventory } = createInitialState(
    mode,
    players,
  );
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

  console.log(`🎮 Game Started in Room: ${ROOM_ID}`);

  while (!gameOver && currentTurn < MAX_TURNS) {
    const player = players[currentPlayerIdx];

    // Broadcast state
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

    // Check loss conditions
    if (
      !isKingAlive(board, player) ||
      !hasAnyValidMoves(player, board, terrain)
    ) {
      gameOver = true;
      console.log(
        `🏁 Game Over! Result for ${player}: ${isPlayerInCheck(player, board, terrain, mode as any) ? "CHECKMATE" : "STALEMATE/CAPTURED"}`,
      );
      break;
    }

    console.log(`🤖 AI Thinking for ${player}... (Turn ${currentTurn})`);
    const bestMove = getBestMove(board, terrain, player, mode as any);

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
