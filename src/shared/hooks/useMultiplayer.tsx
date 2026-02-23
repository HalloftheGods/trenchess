import { useState, useCallback, useEffect } from "react";
import { LobbyClient } from "boardgame.io/client";

// Helper to determine prod URL vs local
export const getServerUrl = () => {
  if (typeof window === "undefined") return "http://localhost:3001";
  if (window.location.hostname.includes("loca.lt")) {
    return "https://battle-chess-server.loca.lt";
  }
  return window.location.protocol + "//" + window.location.hostname + ":3001";
};

export interface MultiplayerState {
  isConnected: boolean;
  roomId: string | null;
  players: string[];
  readyPlayers: Record<string, boolean>;
  socketId: string | null;
  isHost: boolean;
  availableRooms: any[];
  onlineCount: number;
  playerIndex: number | null;
  playerCredentials: string | null;
  chatMessages: any[];
  sendMessage: (text: string) => void;
  joinGame: (roomId: string) => Promise<void>;
  hostGame: () => Promise<string>;
  leaveGame: () => Promise<void>;
  toggleReady: (isReady: boolean) => void;
  sendGameState: (state: any) => void;
  sendMove: (move: any) => void;
  refreshRooms: () => Promise<void>;
}

export function useMultiplayer(): MultiplayerState {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("battle-chess-room-id");
    }
    return null;
  });
  const [playerIndex, setPlayerIndex] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("battle-chess-player-index");
      return stored !== null ? Number(stored) : null;
    }
    return null;
  });
  const [playerCredentials, setPlayerCredentials] = useState<string | null>(
    () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("battle-chess-credentials");
      }
      return null;
    },
  );

  const [players, setPlayers] = useState<string[]>([]);
  const [isHost, setIsHost] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("battle-chess-is-host") === "true";
    }
    return false;
  });
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  const socketId = playerIndex !== null ? String(playerIndex) : null;
  const readyPlayers = {}; // Tracked in boardgame.io G state
  const onlineCount = availableRooms.length * 2; // Approximated for global lobby
  const chatMessages: any[] = [];

  const refreshRooms = useCallback(async () => {
    try {
      const lobbyClient = new LobbyClient({ server: getServerUrl() });
      const { matches } = await lobbyClient.listMatches("battle-chess", {
        isGameover: false,
      });

      setAvailableRooms(
        matches.map((m: any) => ({
          id: m.matchID,
          players: m.players.filter((p: any) => p.name).length,
          maxPlayers: m.players.length,
          status: m.gameover ? "Finished" : "Waiting",
          mode: m.setupData?.mode || "Unknown",
          isPrivate: false,
          raw: m,
        })),
      );
      setIsConnected(true);
    } catch (e) {
      console.error("Failed to connect to lobby server", e);
      setIsConnected(false);
    }
  }, []);

  // Poll for room updates
  useEffect(() => {
    if (roomId) {
      const lobbyClient = new LobbyClient({ server: getServerUrl() });
      const fetchMatch = async () => {
        try {
          const match = await lobbyClient.getMatch("battle-chess", roomId);
          const activePlayers = match.players
            .filter((p: any) => p.name)
            .map((p: any) => String(p.id));
          setPlayers(activePlayers);
        } catch (e) {
          // Ignore polling errors
        }
      };
      fetchMatch();
      const interval = setInterval(fetchMatch, 5000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  const joinGame = useCallback(
    async (id: string) => {
      try {
        const lobbyClient = new LobbyClient({ server: getServerUrl() });
        const match = await lobbyClient.getMatch("battle-chess", id);
        const emptySlot = match.players.find((p: any) => !p.name);

        if (!emptySlot) {
          console.error("Lobby is full");
          return;
        }

        const res = await lobbyClient.joinMatch("battle-chess", id, {
          playerID: String(emptySlot.id),
          playerName: "Player " + emptySlot.id,
        });

        setRoomId(id);
        setPlayerIndex(emptySlot.id);
        setPlayerCredentials(res.playerCredentials);
        localStorage.setItem("battle-chess-room-id", id);
        localStorage.setItem("battle-chess-player-index", String(emptySlot.id));
        localStorage.setItem("battle-chess-credentials", res.playerCredentials);
        localStorage.setItem("battle-chess-is-host", "false");
        setIsHost(false);
        refreshRooms();
      } catch (e) {
        console.error("Failed to join lobby", e);
      }
    },
    [refreshRooms],
  );

  const hostGame = useCallback(async () => {
    try {
      const lobbyClient = new LobbyClient({ server: getServerUrl() });
      const { matchID } = await lobbyClient.createMatch("battle-chess", {
        numPlayers: 2, // Hardcoded for 2P initially, updated when transitioning to play
      });

      const res = await lobbyClient.joinMatch("battle-chess", matchID, {
        playerID: "0",
        playerName: "Operator",
      });

      setRoomId(matchID);
      setPlayerIndex(0);
      setPlayerCredentials(res.playerCredentials);
      localStorage.setItem("battle-chess-room-id", matchID);
      localStorage.setItem("battle-chess-player-index", "0");
      localStorage.setItem("battle-chess-credentials", res.playerCredentials);
      localStorage.setItem("battle-chess-is-host", "true");
      setIsHost(true);
      refreshRooms();
      return matchID;
    } catch (e) {
      console.error("Failed to create match", e);
      return "";
    }
  }, [refreshRooms]);

  const leaveGame = useCallback(async () => {
    if (roomId && playerIndex !== null && playerCredentials) {
      try {
        const lobbyClient = new LobbyClient({ server: getServerUrl() });
        await lobbyClient.leaveMatch("battle-chess", roomId, {
          playerID: String(playerIndex),
          credentials: playerCredentials,
        });
      } catch (e) {
        console.error("Error leaving match context", e);
      }
    }
    setRoomId(null);
    setPlayerIndex(null);
    setPlayerCredentials(null);
    setPlayers([]);
    setIsHost(false);
    localStorage.removeItem("battle-chess-room-id");
    localStorage.removeItem("battle-chess-player-index");
    localStorage.removeItem("battle-chess-credentials");
    localStorage.removeItem("battle-chess-is-host");
    refreshRooms();
  }, [roomId, playerIndex, playerCredentials, refreshRooms]);

  // Sync actions handled by boardgame.io React client now
  const toggleReady = useCallback((_isReady: boolean) => {}, []);
  const sendGameState = useCallback((_state: any) => {}, []);
  const sendMove = useCallback((_move: any) => {}, []);
  const sendMessage = useCallback((_text: string) => {}, []);

  return {
    isConnected,
    roomId,
    players,
    readyPlayers,
    socketId,
    isHost,
    availableRooms,
    onlineCount,
    playerIndex,
    playerCredentials,
    chatMessages,
    sendMessage,
    joinGame,
    hostGame,
    leaveGame,
    toggleReady,
    sendGameState,
    sendMove,
    refreshRooms,
  };
}
