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

// Insert manual CORS middleware at the very beginning of the stack
server.app.middleware.unshift(async (ctx, next) => {
  const origin = ctx.get("Origin");
  ctx.set("Access-Control-Allow-Origin", origin || "*");
  ctx.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  ctx.set("Access-Control-Allow-Credentials", "true");

  if (ctx.method === "OPTIONS") {
    ctx.status = 204;
    return;
  }

  try {
    await next();
  } catch (err) {
    // Ensure CORS headers persist even if an inner route throws an error (e.g. 404 match not found)
    ctx.set("Access-Control-Allow-Origin", origin || "*");
    ctx.set("Access-Control-Allow-Credentials", "true");
    throw err;
  }
});

server.run(PORT, () => {
  console.log(`[Trenchess] Unified Server running at http://localhost:${PORT}`);
});
