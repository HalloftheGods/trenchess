import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MmoActionBar from "@/client/game/shared/components/organisms/MmoActionBar";
import { PIECES } from "@/constants";
import type { GameState, PieceStyle } from "@/shared/types";

describe("MmoActionBar", () => {
  const mockProps = {
    gameState: "setup" as GameState,
    darkMode: false,
    pieceStyle: "lucide" as PieceStyle,
    toggleTheme: vi.fn(),
    togglePieceStyle: vi.fn(),
    getIcon: vi.fn().mockReturnValue(<div data-testid="unit-icon" />),
    turn: "red",
    activePlayers: ["red", "blue"],
    inventory: { red: [PIECES.PAWN, PIECES.PAWN], blue: [] },
    placementPiece: null,
    placementTerrain: null,
    setPlacementPiece: vi.fn(),
    setPlacementTerrain: vi.fn(),
    setSetupMode: vi.fn(),
    placedCount: 0,
    maxPlacement: 5,
    randomizeTerrain: vi.fn(),
    randomizeUnits: vi.fn(),
    setClassicalFormation: vi.fn(),
    applyChiGarden: vi.fn(),
    resetToOmega: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call setClassicalFormation and randomizeTerrain when Pi button is clicked", () => {
    render(<MmoActionBar {...mockProps} />);

    const piButton = screen.getByTitle("Pi");
    fireEvent.click(piButton);

    expect(mockProps.setClassicalFormation).toHaveBeenCalled();
    expect(mockProps.randomizeTerrain).toHaveBeenCalled();
  });

  it("should call applyChiGarden when Chi button is clicked", () => {
    render(<MmoActionBar {...mockProps} />);

    const chiButton = screen.getByTitle("Chi");
    fireEvent.click(chiButton);

    expect(mockProps.applyChiGarden).toHaveBeenCalled();
  });

  it("should call randomizeTerrain and randomizeUnits when Random button is clicked", () => {
    render(<MmoActionBar {...mockProps} />);

    const randomButton = screen.getByTitle("Random");
    fireEvent.click(randomButton);

    expect(mockProps.randomizeTerrain).toHaveBeenCalled();
    expect(mockProps.randomizeUnits).toHaveBeenCalled();
  });

  it("should call resetToOmega when Omega button is clicked", () => {
    render(<MmoActionBar {...mockProps} />);

    const omegaButton = screen.getByTitle("Omega");
    fireEvent.click(omegaButton);

    expect(mockProps.resetToOmega).toHaveBeenCalled();
  });

  it("should respect locks for randomization", () => {
    render(<MmoActionBar {...mockProps} />);

    // Find the Lock/Unlock buttons (Trench is first, Chess is second)
    const lockButtons = screen.getAllByTitle("Lock");
    const lockTrenchButton = lockButtons[0];
    fireEvent.click(lockTrenchButton);

    const randomButton = screen.getByTitle("Random");
    fireEvent.click(randomButton);

    expect(mockProps.randomizeTerrain).not.toHaveBeenCalled();
    expect(mockProps.randomizeUnits).toHaveBeenCalled();
  });
});
