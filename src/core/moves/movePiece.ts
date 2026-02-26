import { INVALID_MOVE } from "boardgame.io/core";
import Move, { getDist, getMidpoint, isSameRow, isSameCol, calculatePath } from "@engine/moves/base";
import { PIECES } from "@constants";
import type { TrenchessState, BoardPiece } from "@/shared/types";
import type { Ctx } from "boardgame.io";
import { applyDesertRule } from "@/core/events";
import { resolvePlayerId } from "@/core/setup/coreHelpers";

const { KING, QUEEN, PAWN } = PIECES;

const handlePawnPromotion = (
  gameState: TrenchessState,
  piece: BoardPiece,
  toRow: number,
  toCol: number,
  playerId: string,
) => {
  if (piece.type !== PAWN) return;

  const lastIndex = Move.BOARD_SIZE - 1;

  // Primitive Player Checks
  const isPlayerRed = playerId === "red";
  const isPlayerBlue = playerId === "blue";
  const isPlayerGreen = playerId === "green";
  const isPlayerYellow = playerId === "yellow";

  // Primitive Boundary Checks
  const isAtFirstRow = toRow === 0;
  const isAtLastRow = toRow === lastIndex;
  const isAtFirstCol = toCol === 0;
  const isAtLastCol = toCol === lastIndex;

  // North-South Promotion Logic
  const isNorthSouthMode = gameState.mode === "2p-ns";
  const isRedAtNSRank = isPlayerRed && isAtLastRow;
  const isBlueAtNSRank = isPlayerBlue && isAtFirstRow;
  const isNSPromotion = isNorthSouthMode && (isRedAtNSRank || isBlueAtNSRank);

  // East-West Promotion Logic
  const isEastWestMode = gameState.mode === "2p-ew";
  const isGreenAtEWRank = isPlayerGreen && isAtLastCol;
  const isYellowAtEWRank = isPlayerYellow && isAtFirstCol;
  const isEWPromotion = isEastWestMode && (isGreenAtEWRank || isYellowAtEWRank);

  // 4-Player Promotion Logic
  const isFourPlayerMode = gameState.mode === "4p";
  const isRedAt4PRank = isPlayerRed && (isAtLastRow || isAtLastCol);
  const isYellowAt4PRank = isPlayerYellow && (isAtLastRow || isAtFirstCol);
  const isGreenAt4PRank = isPlayerGreen && (isAtFirstRow || isAtLastCol);
  const isBlueAt4PRank = isPlayerBlue && (isAtFirstRow || isAtFirstCol);
  const is4PPromotion =
    isFourPlayerMode &&
    (isRedAt4PRank || isYellowAt4PRank || isGreenAt4PRank || isBlueAt4PRank);

  const isEligibleForPromotion =
    isNSPromotion || isEWPromotion || is4PPromotion;

  if (isEligibleForPromotion) {
    gameState.board[toRow][toCol] = { ...piece, type: QUEEN };
  }
};

const handleJoustCapture = (
  gameState: TrenchessState,
  piece: BoardPiece,
  from: [number, number],
  to: [number, number],
  playerId: string,
): BoardPiece | null => {
  if (piece.type !== KING) return null;

  const [dr, dc] = getDist(from, to);

  const isVerticalJoust = dr === 2 && isSameCol(from, to);
  const isHorizontalJoust = dc === 2 && isSameRow(from, to);

  if (!isVerticalJoust && !isHorizontalJoust) return null;

  const [midRow, midCol] = getMidpoint(from, to);
  const midPiece = gameState.board[midRow][midCol];

  const isEnemyAtMidPoint = midPiece && midPiece.player !== playerId;

  if (isEnemyAtMidPoint) {
    gameState.board[midRow][midCol] = null;
    return midPiece;
  }

  return null;
};

const convertVictimArmy = (
  gameState: TrenchessState,
  victimId: string,
  winnerId: string,
) => {
  for (let row = 0; row < Move.BOARD_SIZE; row++) {
    for (let col = 0; col < Move.BOARD_SIZE; col++) {
      const pieceAtCell = gameState.board[row][col];
      const isVictimPiece = pieceAtCell && pieceAtCell.player === victimId;

      if (isVictimPiece) {
        pieceAtCell.player = winnerId;
      }
    }
  }
};

const eliminatePlayer = (gameState: TrenchessState, victimId: string) => {
  gameState.activePlayers = gameState.activePlayers.filter((p) => p !== victimId);
};

const handleCapture = (
  gameState: TrenchessState,
  capturedPiece: BoardPiece,
  playerId: string,
) => {
  const isSelfCapture = capturedPiece.player === playerId;
  if (isSelfCapture) return INVALID_MOVE;

  gameState.capturedBy[playerId].push(capturedPiece);

  const isKingCaptured = capturedPiece.type === KING;
  if (isKingCaptured) {
    const victimId = capturedPiece.player;
    eliminatePlayer(gameState, victimId);
    convertVictimArmy(gameState, victimId, playerId);
    if (gameState.activePlayers.length === 1) {
      gameState.winner = gameState.activePlayers[0];
      gameState.winnerReason = "checkmate";
    }
  }
};

export const movePiece = (
  {
    G: gameState,
    playerID,
    ctx: context,
  }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  from: [number, number],
  to: [number, number],
) => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  const playerId = resolvePlayerId(gameState, context, playerID);
  if (!playerId) return INVALID_MOVE;

  const pieceToMove = gameState.board[fromRow][fromCol];
  const isPieceOwnedByPlayer = pieceToMove && pieceToMove.player === playerId;

  if (!isPieceOwnedByPlayer) return INVALID_MOVE;

  const targetCellPiece = gameState.board[toRow][toCol];

  // 0. Track Move Data
  gameState.lastMove = {
    from,
    to,
    path: calculatePath(from, to),
    type: pieceToMove!.type,
    player: pieceToMove!.player,
  };

  // 1. Move Piece Atom
  gameState.board[toRow][toCol] = pieceToMove!;
  gameState.board[fromRow][fromCol] = null;

  // 2. Promotion Molecule
  handlePawnPromotion(gameState, pieceToMove!, toRow, toCol, playerId);

  // 3. Joust Capture Molecule
  const joustedPiece = handleJoustCapture(
    gameState,
    pieceToMove!,
    from,
    to,
    playerId,
  );

  const finalCapturedPiece = joustedPiece || targetCellPiece;

  // 4. Resolve Capture Molecule
  if (finalCapturedPiece) {
    const captureResult = handleCapture(
      gameState,
      finalCapturedPiece,
      playerId,
    );
    if (captureResult === INVALID_MOVE) return INVALID_MOVE;
  }

  // 5. Apply Passive Terrain Events
  applyDesertRule(gameState, playerId, { r: toRow, c: toCol });
};
