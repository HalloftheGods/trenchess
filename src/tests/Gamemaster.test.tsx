import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GamemasterView from "@/client/console/gamemaster";
import React from "react";
import { TERRAIN_TYPES } from "@constants";
import type { GameStateHook, BoardPiece, PieceType } from "@/shared/types";

// Mock dependencies
vi.mock("@/shared/hooks/core/useDeployment", () => ({
  useDeployment: vi.fn(() => ({
    placedCount: 0,
    maxPlacement: 10,
    maxUnits: 16,
    unitsPlaced: 0,
  })),
}));

// Mock RouteContext
vi.mock("@/shared/context/RouteContext", () => ({
  useRouteContext: vi.fn(() => ({
    darkMode: true,
    pieceStyle: "classic",
    onLogoClick: vi.fn(),
    toggleTheme: vi.fn(),
    togglePieceStyle: vi.fn(),
  })),
  RouteProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock Lucide icons to avoid rendering issues in tests
vi.mock("lucide-react", async () => {
  const actual = await vi.importActual("lucide-react");
  return {
    ...actual,
    RotateCcw: () => <div data-testid="icon-rotate" />,
    CheckCircle2: () => <div data-testid="icon-check" />,
    User: () => <div data-testid="icon-user" />,
    Monitor: () => <div data-testid="icon-monitor" />,
    Zap: () => <div data-testid="icon-zap" />,
    Mountain: () => <div data-testid="icon-mountain" />,
    Target: () => <div data-testid="icon-target" />,
    EyeOff: () => <div data-testid="icon-eye-off" />,
  };
});

// Helper to create a mock game object
const createMockGame = (overrides = {}) => {
  const activePlayers = (overrides as Partial<GameStateHook>).activePlayers || [
    "red",
    "yellow",
    "green",
    "blue",
  ];
  const readyPlayers: Record<string, boolean> = {};
  const playerTypes: Record<string, "human" | "computer"> = {};
  const inventory: Record<string, PieceType[]> = {};
  const capturedBy: Record<string, BoardPiece[]> = {};

  activePlayers.forEach((pid: string) => {
    readyPlayers[pid] = false;
    playerTypes[pid] = "human";
    inventory[pid] = [];
    capturedBy[pid] = [];
  });

  return {
    gameState: "gamemaster",
    mode: "4p",
    turn: "red",
    activePlayers,
    board: Array(12)
      .fill(null)
      .map(() => Array(12).fill(null)),
    terrain: Array(12)
      .fill(null)
      .map(() => Array(12).fill(TERRAIN_TYPES.FLAT)),
    inventory,
    readyPlayers,
    playerTypes,
    capturedBy,
    bgioState: { G: { lostToDesert: [] }, ctx: { phase: "gamemaster" } },
    setGameState: vi.fn(),
    setMode: vi.fn(),
    setTurn: vi.fn(),
    handleZenGardenClick: vi.fn(),
    handleZenGardenHover: vi.fn(),
    setHoveredCell: vi.fn(),
    setPreviewMoves: vi.fn(),
    getIcon: vi.fn(() => <div data-testid="piece-icon" />),
    getPlayerDisplayName: (pid: string) => pid,
    finishGamemaster: vi.fn(),
    randomizeTerrain: vi.fn(),
    randomizeUnits: vi.fn(),
    setClassicalFormation: vi.fn(),
    applyChiGarden: vi.fn(),
    resetToOmega: vi.fn(),
    setIsFlipped: vi.fn(),
    resetTerrain: vi.fn(),
    resetUnits: vi.fn(),
    forfeit: vi.fn(),
    ready: vi.fn(),
    setPlayerTypes: vi.fn(),
    selectedCell: null,
    hoveredCell: null,
    validMoves: [],
    previewMoves: [],
    placementPiece: null,
    placementTerrain: null,
    setupMode: "pieces",
    winner: null,
    winnerReason: null,
    inCheck: false,
    lastMove: null,
    pieceStyle: "classic",
    isFlipped: false,
    localPlayerName: "red",
    ...overrides,
  };
};

describe("GamemasterView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all 4 player panels in 4p mode", () => {
    const game = createMockGame({
      mode: "4p",
      activePlayers: ["red", "yellow", "green", "blue"],
    });
    render(<GamemasterView game={game as unknown as GameStateHook} />);

    expect(screen.getByTestId("player-panel-red")).toBeDefined();
    expect(screen.getByTestId("player-panel-yellow")).toBeDefined();
    expect(screen.getByTestId("player-panel-green")).toBeDefined();
    expect(screen.getByTestId("player-panel-blue")).toBeDefined();
  });

  it("renders only red and blue panels in 2p-ns mode", () => {
    const game = createMockGame({
      mode: "2p-ns",
      activePlayers: ["red", "blue"],
    });
    render(<GamemasterView game={game as unknown as GameStateHook} />);

    expect(screen.getByTestId("player-panel-red")).toBeDefined();
    expect(screen.getByTestId("player-panel-blue")).toBeDefined();
    expect(screen.queryByTestId("player-panel-yellow")).toBeNull();
    expect(screen.queryByTestId("player-panel-green")).toBeNull();
  });

  it("renders only green and yellow panels in 2p-ew mode", () => {
    const game = createMockGame({
      mode: "2p-ew",
      activePlayers: ["green", "yellow"],
    });
    render(<GamemasterView game={game as unknown as GameStateHook} />);

    expect(screen.getByTestId("player-panel-green")).toBeDefined();
    expect(screen.getByTestId("player-panel-yellow")).toBeDefined();
    expect(screen.queryByTestId("player-panel-red")).toBeNull();
    expect(screen.queryByTestId("player-panel-blue")).toBeNull();
  });

  it("calls handleZenGardenClick when board cell is clicked", () => {
    const game = createMockGame();
    render(<GamemasterView game={game as unknown as GameStateHook} />);

    const cell = screen.getByTestId("cell-0-0");
    fireEvent.click(cell);

    expect(game.handleZenGardenClick).toHaveBeenCalledWith(0, 0);
  });

  it("allows selecting a player and switching turns", () => {
    const game = createMockGame({ turn: "red" });
    render(<GamemasterView game={game as unknown as GameStateHook} />);

    const bluePanel = screen.getByTestId("player-panel-blue");
    fireEvent.click(bluePanel);

    expect(game.setTurn).toHaveBeenCalledWith("blue");
  });

  it("triggers finishGamemaster when the finish button is clicked", () => {
    const game = createMockGame();
    render(<GamemasterView game={game as unknown as GameStateHook} />);

    // There are multiple finish buttons (one per panel), but they all do the same thing in GM mode
    const finishBtns = screen.getAllByText("FINISH DEPLOYMENT");
    fireEvent.click(finishBtns[0]);

    expect(game.finishGamemaster).toHaveBeenCalled();
  });
});
