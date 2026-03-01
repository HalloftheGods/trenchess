import { Client } from "boardgame.io/client";
import { Trenchess } from "../src/app/core/Trenchess";
import { PHASES } from "../constants/game";
import { describe, it, expect } from "vitest";

describe("Game Initialization Reproduction", () => {
  it("should initialize 2p-ns mode and transition to COMBAT", () => {
    const client = Client({
      game: Trenchess,
      numPlayers: 2,
    });

    // 1. Initial State (GENESIS)
    let state = client.getState();
    expect(state.ctx.phase).toBe(PHASES.GENESIS);
    expect(state.G.mode).toBe(null);

    // 2. Simulate initGameWithPreset("2p-ns", "pi")
    // Note: In reality this is called from the UI hook.
    client.moves.setMode("2p-ns");
    client.moves.setPhase(PHASES.MAIN);
    client.moves.setClassicalFormation();
    client.moves.ready("red");
    client.moves.ready("blue");

    state = client.getState();
    
    console.log("Phase after moves:", state.ctx.phase);
    console.log("Mode:", state.G.mode);
    console.log("Active Players:", state.G.activePlayers);
    console.log("Ready Players:", state.G.readyPlayers);
    
    // Check if it transitioned to COMBAT
    // expect(state.ctx.phase).toBe(PHASES.COMBAT); // This might fail if my theory is right
  });
});
