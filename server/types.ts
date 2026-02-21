export interface RoomState {
  players: string[];
  ready: Record<string, boolean>;
  gameState: any | null;
  isPrivate?: boolean;
}

export interface ServerToClientEvents {
  room_users: (users: string[]) => void;
  room_ready_status: (ready: Record<string, boolean>) => void;
  game_state_sync: (state: any) => void;
  all_players_ready: () => void;
  receive_move: (move: any) => void;
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
  room_list_update: (rooms: any[]) => void;
  online_count_update: (count: number) => void;
  scoreboard_data: (data: any) => void;
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  player_ready: (data: { roomId: string; isReady: boolean }) => void;
  leave_room: (roomId: string) => void;
  update_game_state: (data: { roomId: string; newState: any }) => void;
  send_move: (data: { roomId: string; move: any }) => void;
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
