export const LEARN_ROUTES = {
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
};

export default LEARN_ROUTES;
