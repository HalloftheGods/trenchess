export interface RoomInfo {
  id: string;
  players: number;
  maxPlayers: number;
  status: string;
  mode: string;
  isPrivate: boolean;
  raw: Record<string, unknown>;
}
