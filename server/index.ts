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

    // Initial broadcast of online count
    io.emit("online_count_update", io.engine.clientsCount);

    const sendRoomList = () => {
      const roomList: any[] = [];
      for (const roomId in rooms) {
        // Filter out empty rooms if any, or maybe show them?
        // Let's show rooms with players or persistent rooms
        if (rooms[roomId].players.length > 0) {
          roomList.push({
            id: roomId,
            players: rooms[roomId].players.length,
            maxPlayers: 4, // hardcoded for now
            status: rooms[roomId].gameState ? "Playing" : "Waiting",
          });
        }
      }
      socket.emit("room_list_update", roomList);
    };

    socket.on("request_room_list", () => {
      sendRoomList();
    });

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

      // Broadcast room list update to everyone (since player count changed)
      // Optimally, debounced or only if new room created
      const roomList: any[] = [];
      for (const rId in rooms) {
        if (rooms[rId].players.length > 0) {
          roomList.push({
            id: rId,
            players: rooms[rId].players.length,
            maxPlayers: 4,
            status: rooms[rId].gameState ? "Playing" : "Waiting",
          });
        }
      }
      io.emit("room_list_update", roomList);
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

        // Broadcast room list update
        const roomList: any[] = [];
        for (const rId in rooms) {
          if (rooms[rId].players.length > 0) {
            roomList.push({
              id: rId,
              players: rooms[rId].players.length,
              maxPlayers: 4,
              status: rooms[rId].gameState ? "Playing" : "Waiting",
            });
          }
        }
        io.emit("room_list_update", roomList);
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

    // Relay specific move actions
    socket.on(
      "send_move",
      ({ roomId, move }: { roomId: string; move: any }) => {
        socket.to(roomId).emit("receive_move", move);
      },
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      io.emit("online_count_update", io.engine.clientsCount);

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

      // Broadcast room list update
      const roomList: any[] = [];
      for (const rId in rooms) {
        if (rooms[rId].players.length > 0) {
          roomList.push({
            id: rId,
            players: rooms[rId].players.length,
            maxPlayers: 4,
            status: rooms[rId].gameState ? "Playing" : "Waiting",
          });
        }
      }
      io.emit("room_list_update", roomList);
    });
  },
);

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
