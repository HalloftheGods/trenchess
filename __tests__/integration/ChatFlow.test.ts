import { describe, it, expect, vi } from "vitest";
import { Client } from "boardgame.io/client";
import { Local } from "boardgame.io/multiplayer";
import { Trenchess } from "@/app/core/Trenchess";

describe("Chat Flow Integration", () => {
  it("should send and receive chat messages between two local clients", async () => {
    const spec = {
      game: Trenchess,
      numPlayers: 2,
      multiplayer: Local(),
    };

    // Instantiate two clients simulating a local multiplayer room
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p0 = Client({ ...spec, playerID: "0" }) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p1 = Client({ ...spec, playerID: "1" }) as any;

    p0.start();
    p1.start();

    // Verify chat is initially empty
    expect(p0.chatMessages).toEqual([]);
    expect(p1.chatMessages).toEqual([]);

    // Player 0 sends a chat message
    p0.sendChatMessage({ text: "Hello from Player 0!" });

    // boardgame.io uses setTimeout internally for Local transport propagation.
    // We'll give it a tiny wait tick for promise resolution.
    await vi.waitFor(
      () => {
        expect(p0.chatMessages).toBeDefined();
        expect(p1.chatMessages).toBeDefined();
        expect(p0.chatMessages.length).toBe(1);
        expect(p1.chatMessages.length).toBe(1);
      },
      { timeout: 1000 },
    );

    const msg0 = p0.chatMessages[0];
    const msg1 = p1.chatMessages[0];

    // Verify message payload
    expect(msg0.payload.text).toBe("Hello from Player 0!");
    expect(msg0.sender).toBe("0");

    expect(msg1.payload.text).toBe("Hello from Player 0!");
    expect(msg1.sender).toBe("0");

    // Player 1 replies
    p1.sendChatMessage({ text: "Greetings Player 0!" });

    await vi.waitFor(
      () => {
        expect(p0.chatMessages.length).toBe(2);
        expect(p1.chatMessages.length).toBe(2);
      },
      { timeout: 1000 },
    );

    const reply0 = p0.chatMessages[1];

    // Verify reply payload
    expect(reply0.payload.text).toBe("Greetings Player 0!");
    expect(reply0.sender).toBe("1");

    p0.stop();
    p1.stop();
  });
});
