/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { LobbyClient } from "boardgame.io/client";
import { analytics } from "@/shared/utils/analytics";
import type {
  RoomInfo,
  BgioMatchPlayer,
  BgioMatch,
  MultiplayerState,
  MultiplayerPlayer,
} from "@/shared/types";
import { getServerUrl } from "@/shared/utils/env";
import { appStorage, APP_KEY } from "@/shared/utils/storage";

const MultiplayerContext = createContext<MultiplayerState | null>(null);

export const MultiplayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(() =>
    appStorage.get("room-id"),
  );
  const [playerIndex, setPlayerIndex] = useState<number | null>(
    () => Number(appStorage.get("player-index")) || null,
  );
  const [playerCredentials, setPlayerCredentials] = useState<string | null>(
    () => appStorage.get("credentials"),
  );
  const [players, setPlayers] = useState<MultiplayerPlayer[]>([]);
  const [isHost, setIsHost] = useState(
    () => appStorage.get("is-host") === "true",
  );
  const [availableRooms, setAvailableRooms] = useState<RoomInfo[]>([]);

  const serverUrl = getServerUrl();
  const lobbyClient = useMemo(
    () => new LobbyClient({ server: serverUrl }),
    [serverUrl],
  );

  const refreshRooms = useCallback(async () => {
    try {
      const { matches } = await lobbyClient.listMatches(APP_KEY, {
        isGameover: false,
      });
      setAvailableRooms(
        matches.map((m: BgioMatch) => ({
          id: m.matchID,
          players: m.players.filter((p: BgioMatchPlayer) => p.name).length,
          maxPlayers: m.players.length,
          status: m.gameover ? "Finished" : "Waiting",
          mode: m.setupData?.mode || "Unknown",
          isPrivate: false,
          raw: m,
        })),
      );
      setIsConnected(true);
    } catch (e) {
      console.error(e);
      setIsConnected(false);
    }
  }, [lobbyClient]);

  useEffect(() => {
    if (!roomId) return;
    const fetchMatch = async () => {
      try {
        const match = await lobbyClient.getMatch(APP_KEY, roomId);
        setPlayers(
          match.players
            .filter((p: BgioMatchPlayer) => p.name)
            .map((p: BgioMatchPlayer) => ({ id: String(p.id), name: p.name })),
        );
      } catch (e) {
        console.error(e);
      }
    };
    fetchMatch();
    const interval = setInterval(fetchMatch, 5000);
    return () => clearInterval(interval);
  }, [roomId, lobbyClient]);

  const joinGame = useCallback(
    async (id: string) => {
      try {
        const match = await lobbyClient.getMatch(APP_KEY, id);
        const slot = match.players.find((p: BgioMatchPlayer) => !p.name);
        if (!slot) return;

        const res = await lobbyClient.joinMatch(APP_KEY, id, {
          playerID: String(slot.id),
          playerName: `Player ${slot.id}`,
        });
        setRoomId(id);
        setPlayerIndex(slot.id);
        setPlayerCredentials(res.playerCredentials);
        setIsHost(false);
        appStorage.set("room-id", id);
        appStorage.set("player-index", String(slot.id));
        appStorage.set("credentials", res.playerCredentials);
        appStorage.set("is-host", "false");
        analytics.trackEvent("Multiplayer", "Join", id);
        refreshRooms();
      } catch (e) {
        console.error(e);
      }
    },
    [refreshRooms, lobbyClient],
  );

  const hostGame = useCallback(async () => {
    try {
      const { matchID } = await lobbyClient.createMatch(APP_KEY, {
        numPlayers: 4,
      });
      const res = await lobbyClient.joinMatch(APP_KEY, matchID, {
        playerID: "0",
        playerName: "Operator",
      });
      setRoomId(matchID);
      setPlayerIndex(0);
      setPlayerCredentials(res.playerCredentials);
      setIsHost(true);
      appStorage.set("room-id", matchID);
      appStorage.set("player-index", "0");
      appStorage.set("credentials", res.playerCredentials);
      appStorage.set("is-host", "true");
      analytics.trackEvent("Multiplayer", "Host", matchID);
      refreshRooms();
      return matchID;
    } catch (e) {
      console.error(e);
      return "";
    }
  }, [refreshRooms, lobbyClient]);

  const leaveGame = useCallback(async () => {
    if (roomId && playerIndex !== null && playerCredentials) {
      try {
        await lobbyClient.leaveMatch(APP_KEY, roomId, {
          playerID: String(playerIndex),
          credentials: playerCredentials,
        });
      } catch (e) {
        console.error(e);
      }
    }
    setRoomId(null);
    setPlayerIndex(null);
    setPlayerCredentials(null);
    setPlayers([]);
    setIsHost(false);
    appStorage.clear(["room-id", "player-index", "credentials", "is-host"]);
    analytics.trackEvent("Multiplayer", "Leave", roomId || "unknown");
    refreshRooms();
  }, [roomId, playerIndex, playerCredentials, refreshRooms, lobbyClient]);

  const value = useMemo(
    () => ({
      isConnected,
      roomId,
      players,
      readyPlayers: {},
      socketId: playerIndex !== null ? String(playerIndex) : null,
      isHost,
      availableRooms,
      onlineCount: availableRooms.length * 2,
      playerIndex,
      playerCredentials,
      chatMessages: [],
      sendMessage: () => {},
      joinGame,
      hostGame,
      leaveGame,
      refreshRooms,
      toggleReady: () => {},
      sendGameState: () => {},
      sendMove: () => {},
    }),
    [
      isConnected,
      roomId,
      players,
      playerIndex,
      isHost,
      availableRooms,
      playerCredentials,
      joinGame,
      hostGame,
      leaveGame,
      refreshRooms,
    ],
  );

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export function useMultiplayer(): MultiplayerState {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error("useMultiplayer must be used within a MultiplayerProvider");
  }
  return context;
}
