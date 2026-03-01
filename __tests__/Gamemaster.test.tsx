import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import GamemasterView from "@/app/client/console/gamemaster";
import { useGameState } from "@hooks/engine/useGameState";

// Mock the components used in GamemasterView
vi.mock("@/shared/hooks/engine/useGameState");

vi.mock("@/shared/context/ThemeContext", () => ({
  useTheme: () => ({
    theme: "classic",
    setTheme: vi.fn(),
  }),
}));

vi.mock("@context", () => ({
  useRouteContext: () => ({
    darkMode: false,
    pieceStyle: "classic",
    theme: "classic",
    toggleTheme: vi.fn(),
    togglePieceStyle: vi.fn(),
  }),
  useMatchState: () => ({
    gameState: "gamemaster",
    mode: "4p",
    activePlayers: ["red", "yellow", "green", "blue"],
    inventory: {},
    terrain: Array(12)
      .fill(null)
      .map(() => Array(12).fill(null)),
    turn: "red",
    dispatch: vi.fn(),
    setIsFlipped: vi.fn(),
    getIcon: vi.fn(),
  }),
  useMatchHUD: () => ({
    placedCount: 0,
    maxPlacement: 24,
    teamPowerStats: {},
  }),
  RouteProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  GameProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  MatchStateProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  MatchHUDProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@/app/client/console/components", () => ({
  ConnectedBoard: () => <div data-testid="connected-board" />,
  ConsolePlayerColumn: ({ playerIds }: { playerIds: string[] }) => (
    <div data-testid={`player-column-${playerIds.join("-")}`} />
  ),
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

vi.mock("@/app/core/components/hud/templates", () => ({
  TopActionBar: () => <div data-testid="top-action-bar" />,
}));

vi.mock("@/app/core/blueprints/layouts/GamemasterLayout", () => ({
  GamemasterLayout: ({
    gameBoard,
    leftPanel,
    rightPanel,
    actionBar,
  }: Record<string, React.ReactNode>) => (
    <div data-testid="gamemaster-layout">
      {gameBoard}
      {leftPanel}
      {rightPanel}
      {actionBar}
    </div>
  ),
}));

vi.mock("@hooks/interface/useConsoleLogic", () => ({
  useConsoleLogic: () => ({
    placedCount: 0,
    maxPlacement: 24,
    teamPowerStats: {},
  }),
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
    ChessKing: () => <div data-testid="icon-chess-king" />,
    Orbit: () => <div data-testid="icon-orbit" />,
    ChessKnight: () => <div data-testid="icon-chess-knight" />,
    ChessQueen: () => <div data-testid="icon-chess-queen" />,
    ChessRook: () => <div data-testid="icon-chess-rook" />,
    ChessBishop: () => <div data-testid="icon-chess-bishop" />,
    ChessPawn: () => <div data-testid="icon-chess-pawn" />,
    Rabbit: () => <div data-testid="icon-rabbit" />,
    VenetianMask: () => <div data-testid="icon-venetian-mask" />,
    Flashlight: () => <div data-testid="icon-flashlight" />,
    Castle: () => <div data-testid="icon-castle" />,
    SunMoon: () => <div data-testid="icon-sun-moon" />,
    Trees: () => <div data-testid="icon-trees" />,
    Waves: () => <div data-testid="icon-waves" />,
    Mountain: () => <div data-testid="icon-mountain" />,
    MountainSnow: () => <div data-testid="icon-mountain-snow" />,
    Omega: () => <div data-testid="icon-omega" />,
    Pi: () => <div data-testid="icon-pi" />,
    Alpha: () => <div data-testid="icon-alpha" />,
    Check: () => <div data-testid="icon-check" />,
    Eye: () => <div data-testid="icon-eye" />,
    Lock: () => <div data-testid="icon-lock" />,
    LockOpen: () => <div data-testid="icon-lock-open" />,
    Sun: () => <div data-testid="icon-sun" />,
    Moon: () => <div data-testid="icon-moon" />,
  };
});

import type { GameStateHook } from "@tc.types";
import { PHASES } from "@constants/game";
import { TERRAIN_TYPES } from "@constants";
import type {
  BoardPiece,
  PieceType,
  TerrainType,
  PlayerID,
  GameMode,
} from "@tc.types";
import type { TrenchessState } from "@tc.types/game";

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
    } as unknown as NonNullable<GameStateHook["bgioState"]>,
    ctx: { phase: PHASES.GAMEMASTER } as unknown,
    client: {} as unknown,
    isEngineActive: true,
    initializeEngine: vi.fn(),
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

  it("renders player columns and board in 4p mode", () => {
    const game = createMockGame({
      mode: "4p" as GameMode,
      activePlayers: ["red", "yellow", "green", "blue"] as PlayerID[],
    });
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    expect(screen.getByTestId("player-column-red-green")).toBeDefined();
    expect(screen.getByTestId("player-column-yellow-blue")).toBeDefined();
    expect(screen.getByTestId("connected-board")).toBeDefined();
    expect(screen.getByTestId("top-action-bar")).toBeDefined();
  });

  it("renders player columns in 2p-ns mode", () => {
    const game = createMockGame({
      mode: "2p-ns" as GameMode,
      activePlayers: ["red", "blue"] as PlayerID[],
    });
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    expect(screen.getByTestId("player-column-red-green")).toBeDefined();
    expect(screen.getByTestId("player-column-yellow-blue")).toBeDefined();
    expect(screen.getByTestId("connected-board")).toBeDefined();
  });

  it("renders the connected board", () => {
    const game = createMockGame();
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    expect(screen.getByTestId("connected-board")).toBeDefined();
  });

  it("renders top action bar", () => {
    const game = createMockGame();
    vi.mocked(useGameState).mockReturnValue(game);
    render(<GamemasterView />);

    expect(screen.getByTestId("top-action-bar")).toBeDefined();
  });
});
