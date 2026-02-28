import type { BgioMatchPlayer } from "./BgioMatchPlayer";

export interface BgioMatch {
  matchID: string;
  players: BgioMatchPlayer[];
  gameover?: unknown;
  setupData?: { mode?: string };
  [key: string]: unknown;
}
