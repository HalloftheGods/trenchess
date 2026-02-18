export interface RoomState {
  players: string[];
  ready: Record<string, boolean>;
  gameState: any | null; // using 'any' for now to avoid deep coupling with client types initially
}

export interface ServerToClientEvents {
  room_users: (users: string[]) => void;
  room_ready_status: (ready: Record<string, boolean>) => void;
  game_state_sync: (state: any) => void;
  all_players_ready: () => void;
  receive_move: (move: any) => void;
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  player_ready: (data: { roomId: string; isReady: boolean }) => void;
  leave_room: (roomId: string) => void;
  update_game_state: (data: { roomId: string; newState: any }) => void;
  send_move: (data: { roomId: string; move: any }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  roomId: string;
}
