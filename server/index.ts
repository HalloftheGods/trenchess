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
// structure: { roomId: { players: [], gameState: null } }
const rooms: Record<string, RoomState> = {};

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

    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);

      if (!rooms[roomId]) {
        rooms[roomId] = { players: [], ready: {}, gameState: null };
      }

      // Add player if not already in
      if (!rooms[roomId].players.includes(socket.id)) {
        rooms[roomId].players.push(socket.id);
        rooms[roomId].ready[socket.id] = false;
      }

      // Send current count
      io.to(roomId).emit("room_users", rooms[roomId].players);
      io.to(roomId).emit("room_ready_status", rooms[roomId].ready);

      // Send current game state if it exists
      if (rooms[roomId].gameState) {
        socket.emit("game_state_sync", rooms[roomId].gameState);
      }
    });

    socket.on(
      "player_ready",
      ({ roomId, isReady }: { roomId: string; isReady: boolean }) => {
        if (rooms[roomId]) {
          rooms[roomId].ready[socket.id] = isReady;
          io.to(roomId).emit("room_ready_status", rooms[roomId].ready);

          // Check if everyone is ready?
          // Let the clients decide what to do when everyone is ready,
          // or duplicate logic here. For now, just broadcast status.
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
      }
    });

    // Relay game state updates
    socket.on(
      "update_game_state",
      ({ roomId, newState }: { roomId: string; newState: any }) => {
        if (rooms[roomId]) {
          rooms[roomId].gameState = newState;
        }
        // Broadcast to everyone else in the room
        socket.to(roomId).emit("game_state_sync", newState);
      },
    );

    // Relay specific move actions (optional, if we want granular updates)
    socket.on(
      "send_move",
      ({ roomId, move }: { roomId: string; move: any }) => {
        socket.to(roomId).emit("receive_move", move);
      },
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // We should really handle cleanup here similar to leave_room
      // But finding *which* room they were in requires iteration or a reverse map
      // For this simple implementation, we'll skip complex cleanup on simple disconnect
      // unless we track socket->room mapping.

      // Quick fix: iterate all rooms
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
    });
  },
);

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
