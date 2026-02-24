import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMultiplayer } from "@/shared/hooks/useMultiplayer";

// Mock boardgame.io LobbyClient
const mockLobbyMethods = {
  listMatches: vi.fn(),
  createMatch: vi.fn(),
  joinMatch: vi.fn(),
  getMatch: vi.fn(),
  leaveMatch: vi.fn(),
};

vi.mock("boardgame.io/client", () => ({
  LobbyClient: function () {
    return mockLobbyMethods;
  },
}));

describe("useMultiplayer", () => {
  const mockMatches = [
    {
      matchID: "room-1",
      players: [{ id: 0, name: "P1" }, { id: 1 }],
      gameover: false,
      setupData: { mode: "2p-ns" },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockLobbyMethods.listMatches.mockResolvedValue({ matches: mockMatches });
    mockLobbyMethods.createMatch.mockResolvedValue({ matchID: "new-room" });
    mockLobbyMethods.joinMatch.mockResolvedValue({
      playerCredentials: "test-creds",
    });
    mockLobbyMethods.getMatch.mockResolvedValue(mockMatches[0]);
  });

  it("should fetch available rooms on mount", async () => {
    const { result } = renderHook(() => useMultiplayer());

    await act(async () => {
      await result.current.refreshRooms();
    });

    expect(result.current.availableRooms).toHaveLength(1);
    expect(result.current.availableRooms[0].id).toBe("room-1");
    expect(result.current.isConnected).toBe(true);
  });

  it("should handle hosting a game", async () => {
    const { result } = renderHook(() => useMultiplayer());

    let matchId;
    await act(async () => {
      matchId = await result.current.hostGame();
    });

    expect(matchId).toBe("new-room");
    expect(result.current.roomId).toBe("new-room");
    expect(result.current.isHost).toBe(true);
    expect(localStorage.getItem("battle-chess-room-id")).toBe("new-room");
  });

  it("should handle joining a game", async () => {
    const { result } = renderHook(() => useMultiplayer());

    await act(async () => {
      await result.current.joinGame("room-1");
    });

    expect(result.current.roomId).toBe("room-1");
    expect(result.current.isHost).toBe(false);
    expect(localStorage.getItem("battle-chess-room-id")).toBe("room-1");
  });
});
