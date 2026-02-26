import { route, paramRoute } from "@/shared/utils/routes";

// --- Route Definitions ---

export const ROUTES = {
  // Home
  HOME: route("/"),

  // Play
  PLAY: route("/play"),
  PLAY_LOCAL: route("/play/local"),
  PLAY_LOBBY: route("/play/lobby"),
  PLAY_SETUP: paramRoute<{ playMode: string; players: string; step?: string }>(
    "/play/:playMode/players/:players/setup/:step?",
  ),

  // Game
  GAME: route("/game"),
  GAME_MMO: route("/game/mmo"),
  GAME_CONSOLE: paramRoute<{ style: string }>("/console/game/:style"),
  GAME_MODE: paramRoute<{ mode: string }>("/game/board/:mode"),
  GAME_DETAIL: paramRoute<{ roomId: string }>("/game/:roomId"),
  GAMEMASTER: route("/console/gamemaster"),
  MASTER_CONSOLE: route("/console/master"),
  LIBRARY: route("/library"),
  ZEN: route("/zen"),

  // Learn
  LEARN: route("/learn"),
  LEARN_MANUAL: route("/learn/manual"),
  LEARN_ENDGAME: route("/learn/endgame"),
  LEARN_ENDGAME_WORLD: route("/learn/endgame/capture-the-world"),
  LEARN_ENDGAME_KING: route("/learn/endgame/capture-the-king"),
  LEARN_ENDGAME_ARMY: route("/learn/endgame/capture-the-army"),
  LEARN_TRENCH: route("/learn/trench"),
  LEARN_TRENCH_DETAIL: paramRoute<{ terrain: string }>(
    "/learn/trench/:terrain",
  ),
  LEARN_CHESS: route("/learn/chess"),
  LEARN_CHESSMEN: route("/learn/chess/chessmen"),
  LEARN_CHESSMEN_DETAIL: paramRoute<{ unitType: string }>(
    "/learn/chess/chessmen/:unitType",
  ),
  LEARN_MATH: route("/learn/math"),

  // Other
  SCOREBOARD: route("/scoreboard"),
  RULES: route("/rules"),
  STATS: route("/stats"),
  TUTORIAL: route("/tutorial"),
  DEV_CLI: route("/dev/cli"),
  DEV_RULESET: route("/dev/rules"),
} as const;

export const ROUTE_NAME_MAP: Record<string, string> = {
  [ROUTES.HOME.path]: "Home",
  [ROUTES.PLAY.path]: "Battle",
  [ROUTES.LEARN.path]: "Academy",
  [ROUTES.STATS.path]: "Hall of Fame",
  [ROUTES.RULES.path]: "Rulebook",
  [ROUTES.SCOREBOARD.path]: "Leaderboard",
  [ROUTES.TUTORIAL.path]: "Training Grounds",
};
