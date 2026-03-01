import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import GamemasterView from "@/app/client/console/gamemaster";
import { useGameState } from "@hooks/engine/useGameState";

// Mock the components used in GamemasterView
vi.mock("@/shared/hooks/engine/useGameState");
vi.mock("@/app/client/console/components", () => ({
  CornerControls: ({
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  }: {
    topLeft: React.ReactNode;
    topRight: React.ReactNode;
    bottomLeft: React.ReactNode;
    bottomRight: React.ReactNode;
  }) => (
    <div data-testid="corner-controls">
      {topLeft}
      {topRight}
      {bottomLeft}
      {bottomRight}
    </div>
  ),
  BoardView: ({
    onCellClick,
  }: {
    onCellClick: (r: number, c: number) => void;
  }) => (
    <div data-testid="board-view" onClick={() => onCellClick(0, 0)}>
      <div data-testid="cell-0-0" onClick={() => onCellClick(0, 0)} />
    </div>
  ),
  PlayerPanel: ({ pid, isActive }: { pid: string; isActive: boolean }) => (
    <div
      data-testid={`player-panel-${pid}`}
      className={isActive ? "active" : ""}
    />
  ),
  GamemasterControls: () => <div data-testid="gamemaster-controls" />,
}));

vi.mock("@/shared/components/atoms/IconButton", () => ({
  IconButton: ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

vi.mock("lucide-react", () => {
  return {
    Settings: () => <div data-testid="icon-settings" />,
    Maximize: () => <div data-testid="icon-maximize" />,
    Target: () => <div data-testid="icon-target" />,
    EyeOff: () => <div data-testid="icon-eye-off" />,
  };
});

import type { GameStateHook } from "@tc.types";
import { PHASES, TERRAIN_TYPES } from "@constants/game";
import type {
  BoardPiece,
  PieceType,
  TerrainType,
  PlayerID,
  GameMode,
} from "@/types";
import type { TrenchessState } from "@/types/game/state";

// Helper to create a mock game object
const createMockGame = (
  overrides: Partial<GameStateHook> = {},
): GameStateHook => {
  const activePlayers = (overrides.activePlayers || [
    "red",
    "yellow",
    "green",
    "blue",
  ]) as PlayerID[];
  const readyPlayers: Record<string, boolean> = {};
  const playerTypes: Record<string, "human" | "computer"> = {};
  const inventory: Record<string, PieceType[]> = {};
  const terrainInventory: Record<string, TerrainType[]> = {};
  const capturedBy: Record<string, BoardPiece[]> = {};

  activePlayers.forEach((pid: string) => {
    readyPlayers[pid] = false;
    playerTypes[pid] = "human";
    inventory[pid] = [];
    terrainInventory[pid] = [];
    capturedBy[pid] = [];
  });

  const mockGame = {
    gameState: PHASES.GAMEMASTER,
    mode: "4p" as GameMode,
    turn: "red" as PlayerID,
    activePlayers,
    board: Array(12)
      .fill(null)
      .map(() => Array(12).fill(null)),
    terrain: Array(12)
      .fill(null)
      .map(() => Array(12).fill(TERRAIN_TYPES.FLAT)),
    inventory,
    terrainInventory,
    readyPlayers,
    playerTypes,
    capturedBy,
    bgioState: {
      G: { lostToDesert: [] } as unknown as TrenchessState,
      ctx: { phase: PHASES.GAMEMASTER } as unknown,
    },
    setGameState: vi.fn(),
    setMode: vi.fn(),
    setTurn: vi.fn(),
    handleZenGardenClick: vi.fn(),
    handleZenGardenHover: vi.fn(),
    setHoveredCell: vi.fn(),
    setPreviewMoves: vi.fn(),
    getIcon: vi.fn(() => <div data-testid="piece-icon" />),
    getPlayerDisplayName: (pid: PlayerID) => pid,
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
    setupMode: "pieces" as unknown,
    winner: null,
    winnerReason: null,
    inCheck: false,
    lastMove: null,
    pieceStyle: "classic" as unknown,
    isFlipped: false,
    localPlayerName: "red",
    multiplayer: {
      roomId: null,
      playerIndex: null,
      isHost: true,
      joinGame: vi.fn(),
      leaveGame: vi.fn(),
      toggleReady: vi.fn(),
      readyPlayers: readyPlayers as unknown,
    },
    dispatch: vi.fn(),
    patchG: vi.fn(),
    authorizeMasterProtocol: vi.fn(),
    setActiveScreen: vi.fn(),
    setLocalPlayerName: vi.fn(),
    ...overrides,
  };

  return mockGame as unknown as GameStateHook;
};

describe("GamemasterView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all 4 player panels in 4p mode", () => {
    const game = createMockGame({
      mode: "4p" as GameMode,
      activePlayers: ["red", "yellow", "green", "blue"] as PlayerID[],
    });
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    expect(screen.getByTestId("player-panel-red")).toBeDefined();
    expect(screen.getByTestId("player-panel-yellow")).toBeDefined();
    expect(screen.getByTestId("player-panel-green")).toBeDefined();
    expect(screen.getByTestId("player-panel-blue")).toBeDefined();
  });

  it("renders only red and blue panels in 2p-ns mode", () => {
    const game = createMockGame({
      mode: "2p-ns" as GameMode,
      activePlayers: ["red", "blue"] as PlayerID[],
    });
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    expect(screen.getByTestId("player-panel-red")).toBeDefined();
    expect(screen.getByTestId("player-panel-blue")).toBeDefined();
    expect(screen.queryByTestId("player-panel-yellow")).toBeNull();
    expect(screen.queryByTestId("player-panel-green")).toBeNull();
  });

  it("renders only green and yellow panels in 2p-ew mode", () => {
    const game = createMockGame({
      mode: "2p-ew" as GameMode,
      activePlayers: ["green", "yellow"] as PlayerID[],
    });
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    expect(screen.getByTestId("player-panel-green")).toBeDefined();
    expect(screen.getByTestId("player-panel-yellow")).toBeDefined();
    expect(screen.queryByTestId("player-panel-red")).toBeNull();
    expect(screen.queryByTestId("player-panel-blue")).toBeNull();
  });

  it("calls handleZenGardenClick when board cell is clicked", () => {
    const game = createMockGame();
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    const cell = screen.getByTestId("cell-0-0");
    fireEvent.click(cell);

    expect(game.handleZenGardenClick).toHaveBeenCalledWith(0, 0);
  });

  it("allows selecting a player and switching turns", () => {
    const game = createMockGame({ turn: "red" as PlayerID });
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    const bluePanel = screen.getByTestId("player-panel-blue");
    fireEvent.click(bluePanel);

    expect(game.setTurn).toHaveBeenCalledWith("blue");
  });

  it("triggers finishGamemaster when the finish button is clicked", () => {
    const game = createMockGame();
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    // There are multiple finish buttons (one per panel), but they all do the same thing in GM mode
    const finishBtns = screen.getAllByText("FINISH DEPLOYMENT");
    fireEvent.click(finishBtns[0]);

    expect(game.finishGamemaster).toHaveBeenCalled();
  });
});
