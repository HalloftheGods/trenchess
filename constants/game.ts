export const GAME_NAME = "Trenchess";
export const BOARD_SIZE = 12;

export const GAME = {
  NAME: GAME_NAME,
  BOARD_SIZE,
  PLAYERS: {
    MIN: 2,
    MAX: 4,
  },
};

export const PHASES = {
  GENESIS: "genesis",
  MAIN: "main",
  COMBAT: "combat",
  GAMEMASTER: "gamemaster",
  MENU: "menu",
  FINISHED: "finished",
  ZEN_GARDEN: "zen-garden",
  LIBRARY: "library",
  HOW_TO_PLAY: "how-to-play",
  TUTORIAL: "tutorial",
  CTF_GUIDE: "ctf-guide",
  TRENCH_GUIDE: "trench-guide",
  CHESS_GUIDE: "chess-guide",
} as const;
