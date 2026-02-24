export const GAME_NAME = "Trenchess";
export const BOARD_SIZE = 12;

export const ROUTES = {
  HOME: "/",
  PLAY: "/play",
  LEARN: "/learn",
  STATS: "/stats",
  RULES: "/rules",
  SCOREBOARD: "/scoreboard",
  TUTORIAL: "/tutorial",
} as const;

const { HOME, PLAY, LEARN, STATS, RULES, SCOREBOARD, TUTORIAL } = ROUTES;

export const ROUTE_NAME_MAP: Record<string, string> = {
  [HOME]: "Home",
  [PLAY]: "Battle",
  [LEARN]: "Academy",
  [STATS]: "Hall of Fame",
  [RULES]: "Rulebook",
  [SCOREBOARD]: "Leaderboard",
  [TUTORIAL]: "Training Grounds",
};
