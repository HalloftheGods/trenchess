import { describe, it, expect, beforeEach } from "vitest";
import type { TrenchessState } from "@tc.types";
import {
  randomizeTerrain,
  randomizeUnits,
  setClassicalFormation,
  applyChiGarden,
} from "@/app/core/mechanics/moves/bulkSetup";
import { createInitialState } from "@/app/core/setup/initialization";
import type { Ctx } from "boardgame.io";

describe("Bulk Setup Reroll Logic", () => {
  let G: TrenchessState;
  let ctx: Ctx;

  beforeEach(() => {
    const players = ["red", "blue"];
    const mode = "2p-ns";
    const initialState = createInitialState(mode, players);

    G = {
      ...initialState,
      capturedBy: { red: [], blue: [], yellow: [], green: [] },
      lostToDesert: [],
      lastMove: null,
      mode,
      activePlayers: players,
      readyPlayers: {},
      playerMap: { "0": "red", "1": "blue" },
      winner: null,
      winnerReason: null,
    };

    ctx = {
      currentPlayer: "0",
    } as unknown as Ctx;
  });

  const random = {
    Number: () => Math.random(),
    Shuffle: <T>(array: T[]): T[] => {
      // Fisher-Yates shuffle
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
  };

  const getBoardSnapshot = (state: TrenchessState) =>
    JSON.stringify(state.board);
  const getTerrainSnapshot = (state: TrenchessState) =>
    JSON.stringify(state.terrain);

  it("should regenerate terrain on repeated randomizeTerrain calls", () => {
    randomizeTerrain({ G, ctx, random } as unknown as {
      G: TrenchessState;
      ctx: Ctx;
      random: typeof random;
    });
    const firstTerrain = getTerrainSnapshot(G);

    randomizeTerrain({ G, ctx, random } as unknown as {
      G: TrenchessState;
      ctx: Ctx;
      random: typeof random;
    });
    const secondTerrain = getTerrainSnapshot(G);

    expect(firstTerrain).not.toBe(secondTerrain);
  });

  it("should regenerate units on repeated randomizeUnits calls", () => {
    randomizeUnits({ G, ctx, random } as unknown as {
      G: TrenchessState;
      ctx: Ctx;
      random: typeof random;
    });
    const firstBoard = getBoardSnapshot(G);

    randomizeUnits({ G, ctx, random } as unknown as {
      G: TrenchessState;
      ctx: Ctx;
      random: typeof random;
    });
    const secondBoard = getBoardSnapshot(G);

    expect(firstBoard).not.toBe(secondBoard);
  });

  it("should regenerate layout on repeated setClassicalFormation (Pi) calls", () => {
    setClassicalFormation({ G, ctx, random });
    const firstTerrain = getTerrainSnapshot(G);

    setClassicalFormation({ G, ctx, random });
    const secondTerrain = getTerrainSnapshot(G);

    // Pi always uses Classical units, but terrain should be different
    expect(firstTerrain).not.toBe(secondTerrain);
  });

  it("should cycle through library layouts on repeated applyChiGarden calls", () => {
    applyChiGarden({ G, ctx, random });
    const firstTerrain = getTerrainSnapshot(G);

    // Call multiple times to increase chance of getting a different one
    // (since library might be small or we might get same one by chance)
    let different = false;
    for (let i = 0; i < 5; i++) {
      applyChiGarden({ G, ctx, random });
      if (getTerrainSnapshot(G) !== firstTerrain) {
        different = true;
        break;
      }
    }

    expect(different).toBe(true);
  });
});
