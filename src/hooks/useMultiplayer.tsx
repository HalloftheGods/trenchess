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
  availableRooms: any[];
  onlineCount: number;
  playerIndex: number | null;
  chatMessages: any[];
  sendMessage: (text: string) => void;
  joinGame: (roomId: string) => void;
  hostGame: () => string; // returns new room ID
  leaveGame: () => void;
  toggleReady: (isReady: boolean) => void;
  sendGameState: (state: any) => void;
  sendMove: (move: any) => void;
  refreshRooms: () => void;
}

export function useMultiplayer(
  onGameStateReceived: (state: any) => void,
  onMoveReceived: (move: any) => void,
): MultiplayerState {
  // 1. All useState hooks grouped at the top
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("battle-chess-room-id");
    }
    return null;
  });
  const [players, setPlayers] = useState<string[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [readyPlayers, setReadyPlayers] = useState<Record<string, boolean>>({});
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [playerIndex, setPlayerIndex] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // 2. All useRef hooks
  const socketRef = useRef<Socket | null>(null);
  const onGameStateReceivedRef = useRef(onGameStateReceived);
  const onMoveReceivedRef = useRef(onMoveReceived);
  const hasAttemptedRejoin = useRef(false);

  // 3. Effects
  useEffect(() => {
    onGameStateReceivedRef.current = onGameStateReceived;
    onMoveReceivedRef.current = onMoveReceived;
  }, [onGameStateReceived, onMoveReceived]);

  // Initialize socket
  useEffect(() => {
    const url = getServerUrl();
    socketRef.current = io(url);

    socketRef.current.on("connect", () => {
      console.log("Connected to Space Station (Server)");
      setIsConnected(true);
      if (socketRef.current) setSocketId(socketRef.current.id || null);

      // Request initial data
      socketRef.current?.emit("request_room_list");

      // Auto-rejoin if we have a room ID
      if (roomId && !hasAttemptedRejoin.current) {
        console.log("Attempting to auto-rejoin room:", roomId);
        socketRef.current?.emit("join_room", roomId);
        hasAttemptedRejoin.current = true;
      }
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
      onGameStateReceivedRef.current(state);
    });

    socketRef.current.on("receive_move", (move: any) => {
      console.log("Received Move:", move);
      onMoveReceivedRef.current(move);
    });

    // New listeners for Global Lobby
    socketRef.current.on("room_list_update", (rooms: any[]) => {
      setAvailableRooms(rooms);
    });

    socketRef.current.on("online_count_update", (count: number) => {
      setOnlineCount(count);
    });

    socketRef.current.on("join_success", (data: { playerIndex: number }) => {
      console.log("Joined Room Index:", data.playerIndex);
      setPlayerIndex(data.playerIndex);
    });

    socketRef.current.on("receive_chat_message", (message: any) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []); // Run once

  const joinGame = useCallback((id: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("join_room", id);
    setRoomId(id);
    localStorage.setItem("battle-chess-room-id", id);
    setIsHost(false);
  }, []);

  const hostGame = useCallback(() => {
    if (!socketRef.current) return "";
    // Generate random 4-char code
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    socketRef.current.emit("join_room", code);
    setRoomId(code);
    localStorage.setItem("battle-chess-room-id", code);
    setIsHost(true);
    return code;
  }, []);

  const leaveGame = useCallback(() => {
    if (!socketRef.current || !roomId) return;
    socketRef.current.emit("leave_room", roomId);
    setRoomId(null);
    localStorage.removeItem("battle-chess-room-id");
    setPlayers([]);
    setReadyPlayers({});
    setIsHost(false);
    // Refresh rooms when leaving
    socketRef.current.emit("request_room_list");
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

  const refreshRooms = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit("request_room_list");
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !roomId) return;
      socketRef.current.emit("send_chat_message", { roomId, text });
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
    availableRooms,
    onlineCount,
    playerIndex,
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
