import { Server, Origins } from "boardgame.io/server";
import { Trenchess } from "@/app/core/Trenchess";
import { generateRoomCode } from "@shared/utilities/room-code";

const PORT = Number(process.env.PORT) || 3001;

const server = Server({
  games: [Trenchess],
  origins: [
    Origins.LOCALHOST,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://trenchess.local.it",
    "*",
  ],
  uuid: generateRoomCode,
});

// Mount the Lobby API router onto the main Koa app to serve both on the same port
server.app.use(server.router.routes());
server.app.use(server.router.allowedMethods());

server.run(PORT, () => {
  console.log(`[Trenchess] Unified Server running at http://localhost:${PORT}`);
});
