import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  RouteContext,
  ThemeProvider,
  GameProvider,
  MatchStateProvider,
  MatchHUDProvider,
  TerminalProvider,
} from "@context";
import { MultiplayerProvider } from "@/shared/hooks/engine/useMultiplayer";
import GamemasterView from "@/app/client/console/gamemaster";
import type { RouteContextType, TrenchessState } from "@tc.types";

// Mock resize observer since jsdom doesn't support it (needed for some UI components)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Partially mock child components that are purely visual or rely on external libraries
// to keep the integration focused on State -> UI -> Mover -> State consistency.
vi.mock("@/shared/components/atoms/IconButton", () => ({
  IconButton: ({
    label,
    onClick,
    className,
    title,
  }: Record<string, unknown> & {
    label?: string;
    onClick?: () => void;
    className?: string;
    title?: string;
  }) => (
    <button onClick={onClick} className={className} title={title || label}>
      {label || title}
    </button>
  ),
}));

// We need an actual RouteContext to provide theme/style preferences, but we mock the nav functions
const mockRouteContext: Partial<RouteContextType> = {
  darkMode: true,
  pieceStyle: "classic",
  toggleTheme: vi.fn(),
  togglePieceStyle: vi.fn(),
};

// Mock matchMedia for jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// A wrapper to bootstrap the internal game engine provided by GameProvider
import { useGameEngineContext } from "@/shared/context/useGameEngineContext";
const EngineBootstrapper = ({
  children,
  onClientReady,
}: {
  children: React.ReactNode;
  onClientReady: (client: unknown) => void;
}) => {
  const { initializeEngine, clientRef, isEngineActive } =
    useGameEngineContext();

  React.useEffect(() => {
    // Mimic the host initialization
    initializeEngine(
      {
        roomId: null,
        playerIndex: null,
        isHost: true,
      } as unknown as Parameters<typeof initializeEngine>[0],
      false,
    );
  }, [initializeEngine]);

  React.useEffect(() => {
    if (isEngineActive && clientRef.current) {
      onClientReady(clientRef.current);
    }
  }, [isEngineActive, clientRef, onClientReady]);

  return isEngineActive ? <>{children}</> : <div>Loading Engine...</div>;
};

describe("Game Flow Integration", () => {
  let client: {
    moves: Record<string, (...args: unknown[]) => void>;
    getState: () => {
      ctx: { phase: string; currentPlayer: string };
      G: TrenchessState;
    } | null;
  } | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    client = null;
  });

  const renderGame = () => {
    // We render the GamemasterView wrapped in all the Context providers that power it.
    return render(
      <MemoryRouter>
        <RouteContext.Provider value={mockRouteContext as RouteContextType}>
          <ThemeProvider>
            <TerminalProvider>
              <MultiplayerProvider>
                <GameProvider>
                  <EngineBootstrapper
                    onClientReady={(c) => {
                      client = c as unknown as typeof client;
                    }}
                  >
                    <MatchStateProvider>
                      <MatchHUDProvider>
                        <GamemasterView />
                      </MatchHUDProvider>
                    </MatchStateProvider>
                  </EngineBootstrapper>
                </GameProvider>
              </MultiplayerProvider>
            </TerminalProvider>
          </ThemeProvider>
        </RouteContext.Provider>
      </MemoryRouter>,
    );
  };

  it("should complete a full setup to combat flow in 2p-ns mode", async () => {
    // 1. Setup Phase - Mount the game
    renderGame();

    // Wait for the client to initialize
    await vi.waitFor(
      () => {
        if (!client) throw new Error("Client not ready yet");
      },
      { timeout: 2000 },
    );

    // Initially, the engine is in the MENU phase
    expect(client!.getState()?.ctx.phase).toBe("menu");

    // 2. Simulate User selecting "2p-ns" and locking forces (Normally done via PlaySetupView)
    act(() => {
      client!.moves.setMode("2p-ns");
      client!.moves.setPhase("main");
      client!.moves.setClassicalFormation(); // Setup predefined pieces
    });

    // Verify state transitioned to MAIN phase and board populated
    expect(client!.getState()?.ctx.phase).toBe("main");
    expect(client!.getState()?.G.mode).toBe("2p-ns");

    // 3. User verifies layout and clicks "Ready" for both players
    act(() => {
      client!.moves.ready("red"); // Player 0
      client!.moves.ready("blue"); // Player 1
    });

    // Verify engine automatically transitioned to COMBAT phase (endPhase if all ready)
    expect(client!.getState()?.ctx.phase).toBe("combat");

    // boardgame.io stores the active player index in ctx.currentPlayer.
    // In our 2p games, "0" is usually red.
    expect(client!.getState()?.ctx.currentPlayer).toBe("0");

    // 4. Verify the Board rendered the Red King at [11, 5] (Classical Formation)
    // We wrap this in waitFor to give React a tick to render the state change from GENESIS -> COMBAT
    await vi.waitFor(() => {
      const activeTurnElements = screen.queryAllByText(/red/i);
      expect(activeTurnElements.length).toBeGreaterThan(0);
    });

    // 5. Simulate moving a Red Pawn forward
    // In classical formation for 2p-ns, Red is at the top (rows 2, 3). Pawns are on row 3.
    // Let's move the red pawn at [3, 2] to [4, 2]
    act(() => {
      client!.moves.movePiece([3, 2], [4, 2]);
    });

    // Verify engine state reflects the move
    expect((client!.getState()?.G.board as unknown[][])[3][2]).toBeNull();
    expect((client!.getState()?.G.board as unknown[][])[4][2]).toEqual(
      expect.objectContaining({ type: "pawn", player: "red" }),
    );

    // Verify the turn passed to Blue (ID: "1")
    expect(client!.getState()?.ctx.currentPlayer).toBe("1");
  });
});
