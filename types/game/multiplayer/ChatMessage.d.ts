export interface ChatMessage {
  id: string;
  senderId: string;
  playerIndex: number;
  text: string;
  timestamp: number;
}
