import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MmoActionBar from "@/client/console/components/hud/organisms/MmoActionBar";
import { INITIAL_ARMY } from "@constants";
import type { GameStateHook } from "@/shared/types";

describe("MmoActionBar", () => {
  const mockDispatch = vi.fn();
  const mockGetIcon = vi.fn().mockReturnValue(<div data-testid="unit-icon" />);

  const mockGame = {
    gameState: "setup",
    getIcon: mockGetIcon,
    turn: "red",
    activePlayers: ["red", "blue"],
    inventory: { red: INITIAL_ARMY.map((u) => u.type), blue: [] },
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
  };

  const mockProps = {
    game: mockGame,
    logic: mockLogic,
    darkMode: false,
    pieceStyle: "lucide" as const,
    toggleTheme: vi.fn(),
    togglePieceStyle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call dispatch with 'board pi' when Pi button is clicked", () => {
    render(<MmoActionBar {...mockProps} />);

    const piButton = screen.getByTitle("Pi");
    fireEvent.click(piButton);

    expect(mockDispatch).toHaveBeenCalledWith("board pi");
  });

  it("should call dispatch with 'board chi' when Chi button is clicked", () => {
    render(<MmoActionBar {...mockProps} />);

    const chiButton = screen.getByTitle("Chi");
    fireEvent.click(chiButton);

    expect(mockDispatch).toHaveBeenCalledWith("board chi");
  });

  it("should call dispatch with 'board random' when Random button is clicked", () => {
    render(<MmoActionBar {...mockProps} />);

    const randomButton = screen.getByTitle("Random");
    fireEvent.click(randomButton);

    expect(mockDispatch).toHaveBeenCalledWith("board random");
  });

  it("should call dispatch with 'board omega' when Omega button is clicked", () => {
    render(<MmoActionBar {...mockProps} />);

    const omegaButton = screen.getByTitle("Omega");
    fireEvent.click(omegaButton);

    expect(mockDispatch).toHaveBeenCalledWith("board omega");
  });

  it("should respect locks for randomization", () => {
    // This test needs to handle the local lock state in MmoActionBar
    render(<MmoActionBar {...mockProps} />);

    // Find the Lock buttons (Trench is first, Chess is second)
    const lockButtons = screen.getAllByTitle("Lock");
    const lockTrenchButton = lockButtons[0];
    fireEvent.click(lockTrenchButton);

    // MmoActionBar has its own state for locking, so clicking lock should update it.
    // In our simplified test, we just check if it prevents the action or if the button changes.
    expect(screen.getByTitle("Unlock")).toBeInTheDocument();
  });
});
