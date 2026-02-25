const handlePawnPromotion = (
  G: TrenchessState,
  piece: BoardPiece,
  toR: number,
  toC: number,
  pid: string
) => {
  if (piece.type !== PAWN) return;

  const isNSPromotion =
    G.mode === '2p-ns' &&
    ((pid === 'red' && toR === BOARD_SIZE - 1) || (pid === 'blue' && toR === 0));

  const isEWPromotion =
    G.mode === '2p-ew' &&
    ((pid === 'green' && toC === BOARD_SIZE - 1) || (pid === 'yellow' && toC === 0));

  const is4PPromotion =
    G.mode === '4p' &&
    ((pid === 'red' && (toR === BOARD_SIZE - 1 || toC === BOARD_SIZE - 1)) ||
      (pid === 'yellow' && (toR === BOARD_SIZE - 1 || toC === 0)) ||
      (pid === 'green' && (toR === 0 || toC === BOARD_SIZE - 1)) ||
      (pid === 'blue' && (toR === 0 || toC === 0)));

  if (isNSPromotion || isEWPromotion || is4PPromotion) {
    G.board[toR][toC] = { ...piece, type: QUEEN };
  }
};
