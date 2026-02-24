import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlaySetupView } from "@/client/play/setup";
import type { GameMode } from "@/shared/types";

// Mocks
const mockNavigate = vi.fn();
const mockSetSearchParams = vi.fn();
let currentSearchParams = new URLSearchParams();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [currentSearchParams, mockSetSearchParams],
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

vi.mock("@/route.context", async () => {
  const actual = await vi.importActual("@/route.context");
  return {
    ...actual,
    useRouteContext: () => mockRouteContext,
  };
});

vi.mock("@/shared/components/templates/RoutePageLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("PlaySetupView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentSearchParams = new URLSearchParams();
    mockRouteContext.selectedBoard = null;
    mockRouteContext.selectedPreset = null;
  });

  const renderSetup = () => {
    return render(
      <MemoryRouter>
        <PlaySetupView />
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
    expect(mockSetSearchParams).toHaveBeenCalled();
    const calledParams = mockSetSearchParams.mock.calls[0][0];
    expect(calledParams.get("step")).toBe("2");
  });

  it("should render Step 2 (Preset Selection) when step=2 in search params", () => {
    currentSearchParams.set("step", "2");
    renderSetup();

    expect(screen.getByText(/Omega/i)).toBeInTheDocument();
    expect(screen.getByText(/Pi/i)).toBeInTheDocument();
    expect(screen.getByText(/Chi/i)).toBeInTheDocument();
    expect(screen.getByText(/Alpha/i)).toBeInTheDocument();
  });

  it("should call onStartGame when a preset is selected in step 2", () => {
    currentSearchParams.set("step", "2");
    mockRouteContext.selectedBoard = "2p-ns" as GameMode;
    renderSetup();

    const omegaCard = screen.getByText(/Omega/i).closest("button")!;
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
