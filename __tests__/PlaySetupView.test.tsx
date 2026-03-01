import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlaySetupView } from "@/app/client/play/setup";
import { RouteContext } from "@context";
import React from "react";
import type { GameMode, RouteContextType } from "@tc.types";

// Mocks
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

const mockNavigate = vi.fn();
let currentParams: Record<string, string> = {};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => currentParams,
  };
});

const mockRouteContext = {
  darkMode: false,
  onStartGame: vi.fn(),
  setSelectedPreset: vi.fn(),
  setSelectedBoard: vi.fn(),
  setPlayerTypes: vi.fn(),
  setPreviewSeedIndex: vi.fn(),
  setPreviewConfig: vi.fn(),
  selectedBoard: null as GameMode | null,
  selectedPreset: null as string | null,
  playerConfig: {},
  seeds: [],
  previewSeedIndex: 0,
  previewConfig: {},
};

vi.mock("@/shared/components/templates/RoutePageLayout", () => {
  const Dummy = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );
  return { default: Dummy, RoutePageLayout: Dummy };
});

describe("PlaySetupView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentParams = {};
    mockRouteContext.selectedBoard = null;
    mockRouteContext.selectedPreset = null;
  });

  const renderSetup = () => {
    return render(
      <MemoryRouter>
        <RouteContext.Provider
          value={mockRouteContext as unknown as RouteContextType}
        >
          <PlaySetupView />
        </RouteContext.Provider>
      </MemoryRouter>,
    );
  };

  it("should render Step 1 (Board Selection) initially", () => {
    renderSetup();
    expect(screen.getByText(/North/i)).toBeInTheDocument();
    expect(screen.getByText(/West/i)).toBeInTheDocument();
  });

  it("should call setSelectedBoard and update step to 2 when a board is selected", () => {
    renderSetup();
    const nsCard = screen.getByText(/North/i).closest("button")!;
    fireEvent.click(nsCard);

    expect(mockRouteContext.setSelectedBoard).toHaveBeenCalledWith("2p-ns");
    expect(mockNavigate).toHaveBeenCalledWith("/play/couch/players/2/setup/2?");
  });

  it("should render Step 2 (Preset Selection) when step=2 in search params", () => {
    currentParams = { step: "2" };
    renderSetup();

    expect(
      screen.getByText((_c, el) => el?.textContent === "Ω Omega"),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_c, el) => el?.textContent === "π Pi"),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_c, el) => el?.textContent === "χ Chi"),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_c, el) => el?.textContent === "α Alpha"),
    ).toBeInTheDocument();
  });

  it("should call onStartGame when a preset is selected in step 2", () => {
    currentParams = { step: "2" };
    mockRouteContext.selectedBoard = "2p-ns" as GameMode;
    renderSetup();

    const omegaCard = screen
      .getByText((_c, el) => el?.textContent === "Ω Omega")
      .closest("button")!;
    fireEvent.click(omegaCard);

    expect(mockRouteContext.setSelectedPreset).toHaveBeenCalledWith("custom");
    expect(mockRouteContext.onStartGame).toHaveBeenCalledWith(
      "2p-ns",
      "custom",
      expect.any(Object),
      undefined,
    );
  });
});
