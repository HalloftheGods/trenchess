import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  RoomState,
} from "./types";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "*", // Allow all origins for now (adjust for prod)
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// Store room state in memory for now
const rooms: Record<string, RoomState> = {};
const matchHistory: any[] = [];

io.on(
  "connection",
  (
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
  ) => {
    console.log("User connected:", socket.id);

    // Initial broadcast of online count
    io.emit("online_count_update", io.engine.clientsCount);

    const sendRoomList = () => {
      const roomList: any[] = [];
      for (const roomId in rooms) {
        if (rooms[roomId].players.length > 0) {
          roomList.push({
            id: roomId,
            players: rooms[roomId].players.length,
            maxPlayers: 4, // hardcoded for now
            status:
              rooms[roomId].gameState?.gameState === "finished"
                ? "Finished"
                : rooms[roomId].gameState
                  ? "Playing"
                  : "Waiting",
            mode: rooms[roomId].gameState?.mode || "Unknown",
          });
        }
      }
      socket.emit("room_list_update", roomList);
    };

    const sendScoreboard = () => {
      const activeMatches: any[] = [];
      for (const roomId in rooms) {
        if (
          rooms[roomId].players.length > 0 &&
          rooms[roomId].gameState?.gameState !== "finished"
        ) {
          activeMatches.push({
            id: roomId,
            players: rooms[roomId].players.length,
            mode: rooms[roomId].gameState?.mode || "Unknown",
            turn: rooms[roomId].gameState?.turn,
          });
        }
      }
      socket.emit("scoreboard_data", {
        active: activeMatches,
        history: matchHistory.slice(-50), // Last 50 matches
      });
    };

    socket.on("request_scoreboard", sendScoreboard);

    socket.on("request_room_list", () => {
      sendRoomList();
    });

    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);

      if (!rooms[roomId]) {
        rooms[roomId] = { players: [], ready: {}, gameState: null };
      }

      if (!rooms[roomId].players.includes(socket.id)) {
        rooms[roomId].players.push(socket.id);
        rooms[roomId].ready[socket.id] = false;
      }

      io.to(roomId).emit("room_users", rooms[roomId].players);
      io.to(roomId).emit("room_ready_status", rooms[roomId].ready);

      if (rooms[roomId].gameState) {
        socket.emit("game_state_sync", rooms[roomId].gameState);
      }

      sendRoomList(); // Broadcast update
    });

    socket.on(
      "player_ready",
      ({ roomId, isReady }: { roomId: string; isReady: boolean }) => {
        if (rooms[roomId]) {
          rooms[roomId].ready[socket.id] = isReady;
          io.to(roomId).emit("room_ready_status", rooms[roomId].ready);

          const allReady = rooms[roomId].players.every(
            (pid) => rooms[roomId].ready[pid],
          );
          if (allReady) {
            io.to(roomId).emit("all_players_ready");
          }
        }
      },
    );

    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room: ${roomId}`);
      if (rooms[roomId]) {
        rooms[roomId].players = rooms[roomId].players.filter(
          (id) => id !== socket.id,
        );
        delete rooms[roomId].ready[socket.id];

        io.to(roomId).emit("room_users", rooms[roomId].players);
        io.to(roomId).emit("room_ready_status", rooms[roomId].ready);
        sendRoomList();
      }
    });

    socket.on(
      "update_game_state",
      ({ roomId, newState }: { roomId: string; newState: any }) => {
        if (rooms[roomId]) {
          // Check if transition to finished
          const wasPlaying = rooms[roomId].gameState?.gameState !== "finished";
          const isFinished = newState.gameState === "finished";

          rooms[roomId].gameState = newState;

          if (wasPlaying && isFinished) {
            matchHistory.push({
              id: roomId,
              mode: newState.mode,
              winner: newState.winner || "Unknown",
              date: new Date().toISOString(),
            });
            // Keep memory bounded
            if (matchHistory.length > 200) matchHistory.shift();
          }
        }
        socket.to(roomId).emit("game_state_sync", newState);
      },
    );

    socket.on(
      "send_move",
      ({ roomId, move }: { roomId: string; move: any }) => {
        socket.to(roomId).emit("receive_move", move);
      },
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      io.emit("online_count_update", io.engine.clientsCount);

      for (const roomId in rooms) {
        if (rooms[roomId].players.includes(socket.id)) {
          rooms[roomId].players = rooms[roomId].players.filter(
            (id) => id !== socket.id,
          );
          delete rooms[roomId].ready[socket.id];
          io.to(roomId).emit("room_users", rooms[roomId].players);
          io.to(roomId).emit("room_ready_status", rooms[roomId].ready);
        }
      }
      sendRoomList();
    });
  },
);

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
