import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopActionBar as ConsoleActionBar } from "@/app/core/hud/templates/TopActionBar";
import { INITIAL_ARMY, PHASES } from "@constants";
import type { GameStateHook } from "@tc.types";

vi.mock("@/shared/hooks/engine", () => ({
  useGameState: vi.fn(),
}));

vi.mock("@/shared/context", () => ({
  useRouteContext: vi.fn(),
  useGameEngineContext: vi.fn(),
  useMatchState: vi.fn(),
  useMatchHUD: vi.fn(),
}));

import { useGameState } from "@/shared/hooks/engine";
import {
  useRouteContext,
  useGameEngineContext,
  useMatchState,
  useMatchHUD,
} from "@/shared/context";

describe("ConsoleActionBar", () => {
  const mockDispatch = vi.fn();
  const mockGetIcon = vi.fn().mockReturnValue(<div data-testid="unit-icon" />);

  const mockGame = {
    gameState: PHASES.MAIN,
    getIcon: mockGetIcon,
    turn: "red",
    activePlayers: ["red", "blue"],
    inventory: { red: INITIAL_ARMY.map((u) => u.type), blue: [] },
    terrain: Array(12).fill(Array(12).fill("flat")),
    placementPiece: null,
    placementTerrain: null,
    setPlacementPiece: vi.fn(),
    setPlacementTerrain: vi.fn(),
    setSetupMode: vi.fn(),
    mode: "2p-ns",
    isFlipped: false,
    setIsFlipped: vi.fn(),
    setTurn: vi.fn(),
    dispatch: mockDispatch,
    multiplayer: { socketId: "test-socket" },
  } as unknown as GameStateHook;

  const mockLogic = {
    placedCount: 0,
    maxPlacement: 5,
    teamPowerStats: { red: 100, blue: 100, green: 100, yellow: 100 },
    isOnline: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useGameState as ReturnType<typeof vi.fn>).mockReturnValue(mockGame);
    (useRouteContext as ReturnType<typeof vi.fn>).mockReturnValue({
      darkMode: false,
      pieceStyle: "lucide",
      toggleTheme: vi.fn(),
      togglePieceStyle: vi.fn(),
    });
    (useGameEngineContext as ReturnType<typeof vi.fn>).mockReturnValue({
      clientRef: { current: {} },
    });
    (useMatchState as ReturnType<typeof vi.fn>).mockReturnValue(mockGame);
    (useMatchHUD as ReturnType<typeof vi.fn>).mockReturnValue(mockLogic);
  });

  it("should call dispatch with 'board pi' when Pi button is clicked", () => {
    render(<ConsoleActionBar />);

    const toggleButton = screen.getByTitle("Omega Mode");
    fireEvent.click(toggleButton);

    const piButton = screen.getByTitle("Pi Mode");
    fireEvent.click(piButton);

    expect(mockDispatch).toHaveBeenCalledWith("board pi");
  });

  it("should call dispatch with 'board chi' when Chi button is clicked", () => {
    render(<ConsoleActionBar />);

    const toggleButton = screen.getByTitle("Omega Mode");
    fireEvent.click(toggleButton);

    const chiButton = screen.getByTitle("Chi Mode");
    fireEvent.click(chiButton);

    expect(mockDispatch).toHaveBeenCalledWith("board chi");
  });

  it("should call dispatch with 'board random' when Random button is clicked", () => {
    render(<ConsoleActionBar />);

    const toggleButton = screen.getByTitle("Omega Mode");
    fireEvent.click(toggleButton);

    const randomButton = screen.getByTitle("Randomize");
    fireEvent.click(randomButton);

    expect(mockDispatch).toHaveBeenCalledWith("board random");
  });

  it("should call dispatch with 'board omega' when Omega button is clicked", () => {
    render(<ConsoleActionBar />);

    const omegaButton = screen.getByTitle("Omega Mode");
    fireEvent.click(omegaButton);

    expect(mockDispatch).toHaveBeenCalledWith("board omega");
  });

  it("should respect locks for randomization", () => {
    // This test needs to handle the local lock state in MmoActionBar
    render(<ConsoleActionBar />);

    // Find the Lock buttons (Trench is first, Chess is second)
    const lockButtons = screen.getAllByTitle("Lock");
    const lockTrenchButton = lockButtons[0];
    fireEvent.click(lockTrenchButton);

    // MmoActionBar has its own state for locking, so clicking lock should update it.
    // In our simplified test, we just check if it prevents the action or if the button changes.
    expect(screen.getByTitle("Unlock")).toBeInTheDocument();
  });
});
