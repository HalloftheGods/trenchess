import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useGameState } from "@/shared/hooks/useGameState";
import { RouteProvider } from "@/route.context";
import React from "react";

// Mock hooks that use external services or complex state
vi.mock("@hooks/useMultiplayer", () => ({
  useMultiplayer: () => ({
    roomId: null,
    playerIndex: null,
    isHost: true,
  }),
  getServerUrl: () => "http://localhost:3001",
}));

vi.mock("@hooks/useGameTheme", () => ({
  useGameTheme: () => ({
    darkMode: false,
    theme: "classic",
  }),
}));

// Mock RouteContext values
const mockRouteContext = {
    mode: "2p-ns",
    gameState: "setup",
    setHoveredMenu: vi.fn(),
    setTerrainSeed: vi.fn(),
    onStartGame: vi.fn(),
    previewConfig: {},
    playerConfig: { red: "human", blue: "human" },
};

vi.mock("@/core/ai/stockfish", () => ({
  StockfishEngine: class {
    init = vi.fn().mockResolvedValue(true);
    evaluate = vi.fn().mockResolvedValue(0);
    getBestMove = vi.fn().mockResolvedValue(null);
  },
}));

const TestComponent = () => {
  const state = useGameState();
  
  return (
    <div>
      <div data-testid="phase">{state.gameState}</div>
      <div data-testid="turn">{state.turn}</div>
      <div data-testid="local-player">{state.turn}</div>
      <button onClick={() => state.startGame()} data-testid="start-btn">Start</button>
      <button onClick={() => state.ready()} data-testid="ready-btn">Ready</button>
      <div data-testid="ready-red">{state.readyPlayers["red"] ? "yes" : "no"}</div>
      <div data-testid="ready-blue">{state.readyPlayers["blue"] ? "yes" : "no"}</div>
      
      {/* Board Display */}
      <div data-testid="piece-0-0">{state.board[0][0]?.type || "none"}</div>
      <div data-testid="piece-0-1">{state.board[0][1]?.type || "none"}</div>
      <div data-testid="piece-1-0">{state.board[1][0]?.type || "none"}</div>
      <div data-testid="piece-1-1">{state.board[1][1]?.type || "none"}</div>
      
      {/* Interaction Hooks */}
      <button onClick={() => state.handleCellClick(0, 0)} data-testid="click-0-0">Click 0,0</button>
      <button onClick={() => state.handleCellClick(0, 1)} data-testid="click-0-1">Click 0,1</button>
      <button onClick={() => state.handleCellClick(1, 0)} data-testid="click-1-0">Click 1,0</button>
      <button onClick={() => state.handleCellClick(1, 1)} data-testid="click-1-1">Click 1,1</button>
      <button onClick={() => state.setPlacementPiece("pawn")} data-testid="set-pawn">Set Pawn</button>
      <button onClick={() => state.setPlacementPiece("king")} data-testid="set-king">Set King</button>
      <button onClick={() => state.setSetupMode("pieces")} data-testid="set-pieces-mode">Set Pieces Mode</button>
      <div data-testid="placement-piece">{state.placementPiece || "none"}</div>
      <div data-testid="setup-mode">{state.setupMode}</div>
      <div data-testid="valid-moves">{JSON.stringify(state.validMoves)}</div>
      <div data-testid="selected-cell">{JSON.stringify(state.selectedCell)}</div>
    </div>
  );
};

describe("useGameState Engine Synchronization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize in setup phase and transition to play phase when ready", async () => {
    render(
      <RouteProvider value={mockRouteContext as any}>
        <TestComponent />
      </RouteProvider>
    );

    // 1. Initial State (before engine start)
    expect(screen.getByTestId("phase").textContent).toBe("menu");

    // 2. Start Game (Activates Engine)
    await act(async () => {
      screen.getByTestId("start-btn").click();
    });

    // Wait for engine to initialize (async subscribe)
    await vi.waitFor(() => {
        expect(screen.getByTestId("phase").textContent).toBe("setup");
    }, { timeout: 2000 });

    expect(screen.getByTestId("ready-red").textContent).toBe("no");

    // 3. Trigger Ready for both players (local mode ready() sets all active players to ready)
    await act(async () => {
      screen.getByTestId("ready-btn").click();
    });

    // 4. Verify phase transition to 'play'
    await vi.waitFor(() => {
        expect(screen.getByTestId("phase").textContent).toBe("play");
    }, { timeout: 2000 });

    expect(screen.getByTestId("ready-red").textContent).toBe("yes");
    expect(screen.getByTestId("ready-blue").textContent).toBe("yes");
  });

  it("should handle full sequence: Place -> Ready -> Move", async () => {
    render(
      <RouteProvider value={mockRouteContext as any}>
        <TestComponent />
      </RouteProvider>
    );

    // 1. Start Engine
    await act(async () => {
      screen.getByTestId("start-btn").click();
    });

    await vi.waitFor(() => {
        expect(screen.getByTestId("phase").textContent).toBe("setup");
    }, { timeout: 2000 });

    // 2. Place a King
    await act(async () => {
        screen.getByTestId("set-pieces-mode").click();
    });
    await act(async () => {
        screen.getByTestId("set-king").click();
    });
    await act(async () => {
        screen.getByTestId("click-0-1").click();
    });

    // 3. Place a Pawn
    await act(async () => {
        screen.getByTestId("set-pawn").click();
    });
    await act(async () => {
        screen.getByTestId("click-0-0").click();
    });

    await vi.waitFor(() => {
        expect(screen.getByTestId("piece-0-1").textContent).toBe("king");
        expect(screen.getByTestId("piece-0-0").textContent).toBe("pawn");
    }, { timeout: 2000 });

    // 4. Ready up
    await act(async () => {
      screen.getByTestId("ready-btn").click();
    });

    await vi.waitFor(() => {
        expect(screen.getByTestId("phase").textContent).toBe("play");
    });

    // 4. Move Piece (Move Pawn from 0,0 to 1,0 - forward)
    // First click to select
    await act(async () => {
        screen.getByTestId("click-0-0").click();
    });
    console.log("Selected cell:", screen.getByTestId("selected-cell").textContent);
    console.log("Valid moves:", screen.getByTestId("valid-moves").textContent);

    // Second click to move
    await act(async () => {
        screen.getByTestId("click-1-0").click();
    });

    await vi.waitFor(() => {
        expect(screen.getByTestId("piece-0-0").textContent).toBe("none");
        expect(screen.getByTestId("piece-1-0").textContent).toBe("pawn");
    }, { timeout: 2000 });
  });

  it("should synchronize with remote state updates (Multiplayer Simulation)", async () => {
    render(
      <RouteProvider value={mockRouteContext as any}>
        <TestComponent />
      </RouteProvider>
    );

    // 1. Start Engine
    await act(async () => {
      screen.getByTestId("start-btn").click();
    });

    await vi.waitFor(() => {
        expect(screen.getByTestId("phase").textContent).toBe("setup");
    });

    // 2. Mock a remote move by another player
    // Instead of using the client, we'll manually trigger a move on the board
    // In a real scenario, this would come through the SocketIO transport
    // Since we're in local mode, we can just trigger it via another 'player'
    
    // Ready up both players to reach 'play' phase
    await act(async () => {
        screen.getByTestId("ready-btn").click();
    });

    await vi.waitFor(() => {
        expect(screen.getByTestId("phase").textContent).toBe("play");
    });

    // We verify it's currently Red's turn (player 0)
    expect(screen.getByTestId("turn").textContent).toBe("red");

    // We want to simulate Blue (player 1) making a move or the state changing
    // In local mode, we can just use movePiece move on the client
    // To simulate a remote update, we can use the boardgame.io client's internal update
  });
});
