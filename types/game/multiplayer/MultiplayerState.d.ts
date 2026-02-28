import type { ChatMessage } from "./ChatMessage";
import type { RoomInfo } from "./RoomInfo";
import type { MultiplayerPlayer } from "./MultiplayerPlayer";
import type { BooleanDictionary, ID, Dictionary } from "../../base";

export interface MultiplayerState {
  isConnected: boolean;
  roomId: ID | null;
  players: MultiplayerPlayer[];
  readyPlayers: BooleanDictionary;
  socketId: ID | null;
  isHost: boolean;
  availableRooms: RoomInfo[];
  onlineCount: number;
  playerIndex: number | null;
  playerCredentials: string | null;
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  joinGame: (roomId: ID) => Promise<void>;
  hostGame: () => Promise<ID>;
  leaveGame: () => Promise<void>;
  toggleReady: (isReady: boolean) => void;
  sendGameState: (state: Dictionary<unknown>) => void;
  sendMove: (move: Dictionary<unknown>) => void;
  refreshRooms: () => Promise<void>;
}
