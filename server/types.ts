export interface RoomState {
  players: string[];
  ready: Record<string, boolean>;
  gameState: Record<string, unknown> | null;
  isPrivate?: boolean;
}

export interface ServerToClientEvents {
  room_users: (users: string[]) => void;
  room_ready_status: (ready: Record<string, boolean>) => void;
  game_state_sync: (state: Record<string, unknown>) => void;
  all_players_ready: () => void;
  receive_move: (move: Record<string, unknown>) => void;
  // Chat
  receive_chat_message: (message: {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
    playerIndex: number;
  }) => void;
  // Join Response
  join_success: (data: { playerIndex: number }) => void;
  // Global Lobby
  room_list_update: (rooms: Record<string, unknown>[]) => void;
  online_count_update: (count: number) => void;
  scoreboard_data: (data: Record<string, unknown>) => void;
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  player_ready: (data: { roomId: string; isReady: boolean }) => void;
  leave_room: (roomId: string) => void;
  update_game_state: (data: {
    roomId: string;
    newState: Record<string, unknown>;
  }) => void;
  send_move: (data: { roomId: string; move: Record<string, unknown> }) => void;
  send_chat_message: (data: { roomId: string; text: string }) => void;
  // Global Lobby
  request_room_list: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  roomId: string;
}
