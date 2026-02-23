export interface ChatMessage {
  id: string;
  senderId: string;
  playerIndex: number;
  text: string;
  timestamp: number;
}

export interface RoomInfo {
  id: string;
  players: number;
  maxPlayers: number;
  status: string;
  mode: string;
  isPrivate: boolean;
  raw: Record<string, unknown>;
}

export interface BgioMatchPlayer {
  id: number;
  name?: string;
}

export interface BgioMatch {
  matchID: string;
  players: BgioMatchPlayer[];
  gameover?: unknown;
  setupData?: { mode?: string };
  [key: string]: unknown;
}

export interface MultiplayerPlayer {
  id: string;
  name?: string;
}

export interface MultiplayerState {
  isConnected: boolean;
  roomId: string | null;
  players: MultiplayerPlayer[];
  readyPlayers: Record<string, boolean>;
  socketId: string | null;
  isHost: boolean;
  availableRooms: RoomInfo[];
  onlineCount: number;
  playerIndex: number | null;
  playerCredentials: string | null;
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  joinGame: (roomId: string) => Promise<void>;
  hostGame: () => Promise<string>;
  leaveGame: () => Promise<void>;
  toggleReady: (isReady: boolean) => void;
  sendGameState: (state: Record<string, unknown>) => void;
  sendMove: (move: Record<string, unknown>) => void;
  refreshRooms: () => Promise<void>;
}
