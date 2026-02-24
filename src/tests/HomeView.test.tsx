import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomeView } from "@/client/home";
import { RouteProvider } from "@/route.context";

// Mock the components that might cause issues due to missing context or complex structure
vi.mock("@/shared/components/templates/RoutePageLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/shared/components/organisms/RoutePageHeader", () => ({
  default: ({ label }: { label: string }) => <h1>{label}</h1>,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useRouteContext
const mockRouteContext = {
  darkMode: false,
  setHoveredMenu: vi.fn(),
  setTerrainSeed: vi.fn(),
  onZenGarden: vi.fn(),
  setPreviewConfig: vi.fn(),
  selectedBoard: null,
};

vi.mock("@/route.context", async () => {
  const actual = await vi.importActual("@/route.context");
  return {
    ...actual,
    useRouteContext: () => mockRouteContext,
  };
});

describe("HomeView", () => {
  const renderHome = () => {
    return render(
      <MemoryRouter>
        <HomeView />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the main menu header", () => {
    renderHome();
    expect(screen.getByText("Main Menu")).toBeInTheDocument();
  });

  it("should navigate to /learn when 'How to Play' card is clicked", () => {
    renderHome();
    const learnCard = screen.getByText(/Learn the Basics/i);
    fireEvent.click(learnCard.closest("button")!);
    expect(mockNavigate).toHaveBeenCalledWith("/learn");
  });

  it("should navigate to /play when 'Play Trenchess' card is clicked", () => {
    renderHome();
    const playCard = screen.getByText(/Master the Elements/i);
    fireEvent.click(playCard.closest("button")!);
    expect(mockNavigate).toHaveBeenCalledWith("/play");
  });

  it("should call onZenGarden when 'Lay Trenchess' card is clicked", () => {
    renderHome();
    const zenCard = screen.getByText(/Community Labrynth/i);
    fireEvent.click(zenCard.closest("button")!);
    expect(mockRouteContext.onZenGarden).toHaveBeenCalled();
  });

  it("should update hovered menu on mouse enter", () => {
    renderHome();
    const playCard = screen.getByText(/Master the Elements/i);
    fireEvent.mouseEnter(playCard.closest("button")!);
    expect(mockRouteContext.setHoveredMenu).toHaveBeenCalledWith("play-menu");
  });
});
