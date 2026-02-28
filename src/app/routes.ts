export const ROUTES = {
  home: "/",
  console: {
    gamemaster: "/console/gamemaster",
  },
  game: {
    index: "/game",
    mmo: "/game/mmo",
    console: "/console/game/:style",
    mode: "/game/board/:mode",
    detail: "/game/:roomId",
    gamemaster: "/console/gamemaster",
    library: "/library",
  },
  dev: {
    cli: "/dev/cli",
    ruleset: "/dev/rules",
  },
  learn: {
    index: "/learn",
    manual: "/learn/manual",
    endgame: {
      index: "/learn/endgame",
      captureTheWorld: "/learn/endgame/capture-the-world",
      captureTheKing: "/learn/endgame/capture-the-king",
      captureTheArmy: "/learn/endgame/capture-the-army",
    },
    trench: {
      index: "/learn/trench",
      detail: "/learn/trench/:terrain",
    },
    chess: {
      index: "/learn/chess",
      chessmen: "/learn/chess/chessmen",
      chessmenDetail: "/learn/chess/chessmen/:unitType",
    },
    math: "/learn/math",
  },
  library: "/library",
  play: {
    index: "/play",
    local: "/play/local",
    lobby: "/play/lobby",
    setup: "/play/:playMode/players/:players/setup/:step?",
  },
  rules: "/rules",
  scoreboard: "/scoreboard",
  stats: "/stats",
  tutorial: "/tutorial",
  zen: "/zen",
} as const;

export const ROUTE_NAME_MAP: Record<string, string> = {
  [ROUTES.home]: "Home",
  [ROUTES.play.index]: "Battle",
  [ROUTES.learn.index]: "Academy",
  [ROUTES.stats]: "Hall of Fame",
  [ROUTES.rules]: "Rulebook",
  [ROUTES.scoreboard]: "Leaderboard",
  [ROUTES.tutorial]: "Training Grounds",
  [ROUTES.console.gamemaster]: "Game Master",
};
