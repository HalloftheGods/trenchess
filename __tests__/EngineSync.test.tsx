import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useGameState } from "@/shared/hooks/engine/useGameState";
import { PHASES } from "@constants/game";
import { RouteProvider, GameProvider } from "@context";
import React from "react";

// Mock hooks that use external services or complex state
vi.mock("@hooks/engine/useMultiplayer", () => ({
  useMultiplayer: () => ({
    roomId: null,
    playerIndex: null,
    isHost: true,
  }),
  getServerUrl: () => "http://localhost:3001",
}));

vi.mock("@hooks/interface/useGameTheme", () => ({
  useGameTheme: () => ({
    darkMode: false,
    theme: "classic",
    getIcon: vi.fn().mockReturnValue(null),
  }),
}));

vi.mock("@shared/context/TerminalContext", () => ({
  useTerminal: () => ({
    addLog: vi.fn(),
    clearHistory: vi.fn(),
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useLocation: () => ({ pathname: "/" }),
    createBrowserRouter: vi.fn(),
  };
});

// Mock RouteContext values
const mockRouteContext = {
  mode: "2p-ns",
  gameState: PHASES.GENESIS,
  setHoveredMenu: vi.fn(),
  setTerrainSeed: vi.fn(),
  onStartGame: vi.fn(),
  previewConfig: {},
  playerConfig: { red: "human", blue: "human" },
};

vi.mock("@/app/core/bot/stockfish", () => ({
  engineService: {
    init: vi.fn(),
    evaluate: vi.fn().mockResolvedValue({ score: 0 }),
    getBestMove: vi.fn().mockResolvedValue(null),
  },
  StockfishEngine: class {
    init = vi.fn();
    evaluate = vi.fn().mockResolvedValue({ score: 0 });
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
      <button onClick={() => state.startGame()} data-testid="start-btn">
        Start
      </button>
      <button onClick={() => state.ready()} data-testid="ready-btn">
        Ready
      </button>
      <div data-testid="ready-red">
        {state.readyPlayers["red"] ? "yes" : "no"}
      </div>
      <div data-testid="ready-blue">
        {state.readyPlayers["blue"] ? "yes" : "no"}
      </div>

      {/* Board Display */}
      {state.board && (
        <>
          <div data-testid="piece-9-0">
            {state.board[9]?.[0]?.type || "none"}
          </div>
          <div data-testid="piece-10-0">
            {state.board[10]?.[0]?.type || "none"}
          </div>
          <div data-testid="piece-10-1">
            {state.board[10]?.[1]?.type || "none"}
          </div>
          <div data-testid="piece-11-0">
            {state.board[11]?.[0]?.type || "none"}
          </div>
          <div data-testid="piece-11-1">
            {state.board[11]?.[1]?.type || "none"}
          </div>
        </>
      )}

      {/* Interaction Hooks */}
      <button
        onClick={() => state.handleCellClick(9, 0)}
        data-testid="click-9-0"
      >
        Click 9,0
      </button>
      <button
        onClick={() => state.handleCellClick(10, 0)}
        data-testid="click-10-0"
      >
        Click 10,0
      </button>
      <button
        onClick={() => state.handleCellClick(10, 1)}
        data-testid="click-10-1"
      >
        Click 10,1
      </button>
      <button
        onClick={() => state.handleCellClick(11, 0)}
        data-testid="click-11-0"
      >
        Click 11,0
      </button>
      <button
        onClick={() => state.handleCellClick(11, 1)}
        data-testid="click-11-1"
      >
        Click 11,1
      </button>
      <button
        onClick={() => state.setPlacementPiece("pawn")}
        data-testid="set-pawn"
      >
        Set Pawn
      </button>
      <button
        onClick={() => state.setPlacementPiece("king")}
        data-testid="set-king"
      >
        Set King
      </button>
      <button
        onClick={() => state.setSetupMode("pieces")}
        data-testid="set-pieces-mode"
      >
        Set Pieces Mode
      </button>
      <div data-testid="placement-piece">{state.placementPiece || "none"}</div>
      <div data-testid="setup-mode">{state.setupMode}</div>
      <div data-testid="valid-moves">{JSON.stringify(state.validMoves)}</div>
      <div data-testid="selected-cell">
        {JSON.stringify(state.selectedCell)}
      </div>
    </div>
  );
};

describe("useGameState Engine Synchronization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize in MENU phase before engine start", async () => {
    render(
      <RouteProvider
        value={
          mockRouteContext as unknown as React.ComponentProps<
            typeof RouteProvider
          >["value"]
        }
      >
        <GameProvider>
          <TestComponent />
        </GameProvider>
      </RouteProvider>,
    );

    expect(screen.getByTestId("phase").textContent).toBe(PHASES.MENU);
  });

  it("should transition out of MENU when startGame is called", async () => {
    render(
      <RouteProvider
        value={
          mockRouteContext as unknown as React.ComponentProps<
            typeof RouteProvider
          >["value"]
        }
      >
        <GameProvider>
          <TestComponent />
        </GameProvider>
      </RouteProvider>,
    );

    await act(async () => {
      screen.getByTestId("start-btn").click();
    });

    await vi.waitFor(
      () => {
        expect(screen.getByTestId("phase").textContent).not.toBe(PHASES.MENU);
      },
      { timeout: 2000 },
    );
  });
});
