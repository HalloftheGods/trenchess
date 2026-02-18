import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Helper to determine prod URL vs local
const getServerUrl = () => {
  if (typeof window === "undefined") return "http://localhost:3001";
  if (window.location.hostname.includes("loca.lt")) {
    // If using localtunnel or similar
    return "https://battle-chess-server.loca.lt";
  }
  // Default to localhost for dev
  return window.location.protocol + "//" + window.location.hostname + ":3001";
};

export interface MultiplayerState {
  isConnected: boolean;
  roomId: string | null;
  players: string[];
  readyPlayers: Record<string, boolean>;
  socketId: string | null;
  isHost: boolean;
  joinGame: (roomId: string) => void;
  hostGame: () => string; // returns new room ID
  leaveGame: () => void;
  toggleReady: (isReady: boolean) => void;
  sendGameState: (state: any) => void;
  sendMove: (move: any) => void;
}

export function useMultiplayer(
  onGameStateReceived: (state: any) => void,
  onMoveReceived: (move: any) => void,
): MultiplayerState {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);

  const [readyPlayers, setReadyPlayers] = useState<Record<string, boolean>>({});

  const socketRef = useRef<Socket | null>(null);

  // Initialize socket
  useEffect(() => {
    // Only connect when explicitly joining/hosting?
    // Or connect immediately? Let's connect immediately for now.
    const url = getServerUrl();
    socketRef.current = io(url);

    socketRef.current.on("connect", () => {
      console.log("Connected to Space Station (Server)");
      setIsConnected(true);
      if (socketRef.current) setSocketId(socketRef.current.id || null);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from Space Station");
      setIsConnected(false);
      setSocketId(null);
    });

    socketRef.current.on("room_users", (users: string[]) => {
      setPlayers(users);
    });

    socketRef.current.on(
      "room_ready_status",
      (status: Record<string, boolean>) => {
        setReadyPlayers(status);
      },
    );

    socketRef.current.on("game_state_sync", (state: any) => {
      // Avoid loops: verify if state is actually new/different?
      // For now, trust the caller to handle diffs
      // console.log("Received Sync:", state);
      onGameStateReceived(state);
    });

    socketRef.current.on("receive_move", (move: any) => {
      console.log("Received Move:", move);
      onMoveReceived(move);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []); // Run once

  const joinGame = useCallback((id: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("join_room", id);
    setRoomId(id);
    setIsHost(false);
  }, []);

  const hostGame = useCallback(() => {
    if (!socketRef.current) return "";
    // Generate random 4-char code
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    socketRef.current.emit("join_room", code);
    setRoomId(code);
    setIsHost(true);
    return code;
  }, []);

  const leaveGame = useCallback(() => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit("leave_room", roomId);
    setRoomId(null);
    setPlayers([]);
    setReadyPlayers({});
    setIsHost(false);
  }, [roomId]);

  const toggleReady = useCallback(
    (isReady: boolean) => {
      if (!socketRef.current || !roomId) return;
      socketRef.current.emit("player_ready", { roomId, isReady });
    },
    [roomId],
  );

  const sendGameState = useCallback(
    (state: any) => {
      if (!socketRef.current || !roomId) return;
      socketRef.current.emit("update_game_state", { roomId, newState: state });
    },
    [roomId],
  );

  const sendMove = useCallback(
    (move: any) => {
      if (!socketRef.current || !roomId) return;
      socketRef.current.emit("send_move", { roomId, move });
    },
    [roomId],
  );

  return {
    isConnected,
    roomId,
    players,
    readyPlayers,
    socketId,
    isHost,
    joinGame,
    hostGame,
    leaveGame,
    toggleReady,
    sendGameState,
    sendMove,
  };
}
