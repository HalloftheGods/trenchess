import { Server, Origins } from "boardgame.io/server";
import { Trenchess } from "@/core/Trenchess";
import { generateRoomCode } from "@utils/room-code";

const PORT = Number(process.env.PORT || 3001);

const server = Server({
  games: [Trenchess],
  origins: [
    Origins.LOCALHOST,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://trenchess.local.it",
    "*",
  ],
  uuid: generateRoomCode,
});

server.run({ port: PORT }, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
