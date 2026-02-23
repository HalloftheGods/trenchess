import { BOARD_SIZE } from "@/core/primitives/game";
import { PIECES } from "@/core/primitives/pieces";
import { TERRAIN_TYPES } from "@/core/primitives/terrain";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types/game";
import { isPlayerInCheck } from "@/core/mechanics/gameState";

export const getValidMoves = (
  r: number,
  c: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
  depth = 0,
): number[][] => {
  const moves: number[][] = [];
  const checkCell = (nr: number, nc: number) => {
    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) return false;
    const targetPiece = board[nr][nc];
    const targetTerrain = terrain[nr]?.[nc];
    if (!targetTerrain) return false;

    if (targetTerrain === TERRAIN_TYPES.DESERT) {
      if (!targetPiece || targetPiece.player !== player) {
        moves.push([nr, nc]);
      }
      return false;
    }

    if (piece.type === PIECES.KNIGHT && targetTerrain === TERRAIN_TYPES.PONDS)
      return false;
    if (piece.type === PIECES.BISHOP && targetTerrain === TERRAIN_TYPES.PONDS)
      return false;

    if (piece.type === PIECES.ROOK && targetTerrain === TERRAIN_TYPES.TREES)
      return false;
    if (piece.type === PIECES.KNIGHT && targetTerrain === TERRAIN_TYPES.TREES)
      return false;

    if (piece.type === PIECES.ROOK && targetTerrain === TERRAIN_TYPES.RUBBLE)
      return false;
    if (piece.type === PIECES.BISHOP && targetTerrain === TERRAIN_TYPES.RUBBLE)
      return false;

    if (!targetPiece) {
      moves.push([nr, nc]);
      return true;
    } else if (targetPiece.player !== player) {
      moves.push([nr, nc]);
      return false;
    }
    return false;
  };

  if (piece.type === PIECES.PAWN) {
    if (mode === "2p-ew") {
      const dir = player === "green" ? 1 : -1;
      const nf = c + dir;
      if (nf >= 0 && nf < BOARD_SIZE && !board[r][nf]) moves.push([r, nf]);
      [1, -1].forEach((dr) => {
        const nr = r + dr,
          nc = c + dir;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          board[nr][nc] &&
          board[nr][nc]?.player !== player
        ) {
          moves.push([nr, nc]);
        }
      });
      const bc = c - 2 * dir;
      if (bc >= 0 && bc < BOARD_SIZE && !board[r][bc]) {
        moves.push([r, bc]);
      }
      [1, -1].forEach((dr) => {
        const nr = r + dr,
          nc = c - 2 * dir;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          board[nr][nc] &&
          board[nr][nc]?.player !== player
        ) {
          moves.push([nr, nc]);
        }
      });
    } else if (mode === "4p") {
      let dr = 0,
        dc = 0;
      if (player === "red") {
        dr = 1;
        dc = 1;
      } else if (player === "yellow") {
        dr = 1;
        dc = -1;
      } else if (player === "green") {
        dr = -1;
        dc = 1;
      } else if (player === "blue") {
        dr = -1;
        dc = -1;
      }
      [
        [dr, 0],
        [0, dc],
      ].forEach(([ddr, ddc]) => {
        const nr = r + ddr,
          nc = c + ddc;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          !board[nr][nc]
        ) {
          moves.push([nr, nc]);
        }
      });
      const cnr = r + dr,
        cnc = c + dc;
      if (
        cnr >= 0 &&
        cnr < BOARD_SIZE &&
        cnc >= 0 &&
        cnc < BOARD_SIZE &&
        board[cnr][cnc] &&
        board[cnr][cnc]!.player !== player
      ) {
        moves.push([cnr, cnc]);
      }
      [
        [-2 * dr, 0],
        [0, -2 * dc],
      ].forEach(([ddr, ddc]) => {
        const nr = r + ddr,
          nc = c + ddc;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          !board[nr][nc]
        ) {
          moves.push([nr, nc]);
        }
      });
      [[-2 * dr, -2 * dc]].forEach(([ddr, ddc]) => {
        const snr = r + ddr,
          snc = c + ddc;
        if (
          snr >= 0 &&
          snr < BOARD_SIZE &&
          snc >= 0 &&
          snc < BOARD_SIZE &&
          board[snr][snc] &&
          board[snr][snc]!.player !== player
        ) {
          moves.push([snr, snc]);
        }
      });
    } else {
      const dir = player === "red" || player === "yellow" ? 1 : -1;
      const nf = r + dir;
      if (nf >= 0 && nf < BOARD_SIZE && !board[nf][c]) moves.push([nf, c]);
      [1, -1].forEach((dc) => {
        const nr = r + dir,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          board[nr][nc] &&
          board[nr][nc]?.player !== player
        ) {
          moves.push([nr, nc]);
        }
      });
      const br = r - 2 * dir;
      if (br >= 0 && br < BOARD_SIZE && !board[br][c]) {
        moves.push([br, c]);
      }
      [1, -1].forEach((dc) => {
        const nc = c + dc,
          nr = r - 2 * dir;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          board[nr][nc] &&
          board[nr][nc]?.player !== player
        ) {
          moves.push([nr, nc]);
        }
      });
    }
  }

  if (piece.type === PIECES.KNIGHT || piece.type === PIECES.QUEEN) {
    [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ].forEach(([dr, dc]) => {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        const targetPiece = board[nr][nc];
        const targetTerrain = terrain[nr][nc];
        if (piece.type === PIECES.KNIGHT) {
          if (
            targetTerrain === TERRAIN_TYPES.PONDS ||
            targetTerrain === TERRAIN_TYPES.TREES
          )
            return;
        }
        if (!targetPiece || targetPiece.player !== player) moves.push([nr, nc]);
      }
    });
    [
      [3, 0],
      [-3, 0],
      [0, 3],
      [0, -3],
    ].forEach(([dr, dc]) => {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        const targetPiece = board[nr][nc];
        const targetTerrain = terrain[nr][nc];
        if (
          targetTerrain === TERRAIN_TYPES.PONDS ||
          targetTerrain === TERRAIN_TYPES.TREES
        )
          return;
        if (!targetPiece || targetPiece.player !== player) moves.push([nr, nc]);
      }
    });
  }

  if (piece.type === PIECES.BISHOP || piece.type === PIECES.QUEEN) {
    [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ].forEach(([dr, dc]) => {
      let nr = r + dr,
        nc = c + dc;
      while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        const res = checkCell(nr, nc);
        if (!res || board[nr][nc]) break;
        nr += dr;
        nc += dc;
      }
    });
    [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ].forEach(([dr, dc]) => {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        if (
          terrain[nr][nc] === TERRAIN_TYPES.PONDS ||
          terrain[nr][nc] === TERRAIN_TYPES.RUBBLE
        )
          return;
        const targetPiece = board[nr][nc];
        if (!targetPiece || targetPiece.player !== player) moves.push([nr, nc]);
      }
    });
  }

  if (piece.type === PIECES.ROOK || piece.type === PIECES.QUEEN) {
    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].forEach(([dr, dc]) => {
      let nr = r + dr,
        nc = c + dc;
      while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        const res = checkCell(nr, nc);
        if (!res || board[nr][nc]) break;
        nr += dr;
        nc += dc;
      }
    });
    [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ].forEach(([dr, dc]) => {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        if (
          terrain[nr][nc] === TERRAIN_TYPES.TREES ||
          terrain[nr][nc] === TERRAIN_TYPES.RUBBLE
        )
          return;
        const targetPiece = board[nr][nc];
        if (!targetPiece || targetPiece.player !== player) moves.push([nr, nc]);
      }
    });
  }

  if (piece.type === PIECES.KING) {
    [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ].forEach(([dr, dc]) => {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        if (!board[nr][nc]) moves.push([nr, nc]);
      }
    });
    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].forEach(([dr, dc]) => {
      checkCell(r + dr, c + dc);
      const midR = r + dr;
      const midC = c + dc;
      if (midR >= 0 && midR < BOARD_SIZE && midC >= 0 && midC < BOARD_SIZE) {
        const midPiece = board[midR][midC];
        if (!midPiece || midPiece.player !== player) {
          if (depth > 0) {
            checkCell(r + dr * 2, c + dc * 2);
          } else {
            const isGuarded = board.some((row, br) =>
              row.some((cell, bc) => {
                if (!cell || cell.player === player) return false;
                const enemyMoves = getValidMoves(
                  br,
                  bc,
                  cell,
                  cell.player,
                  board,
                  terrain,
                  mode,
                  depth + 1,
                );
                return enemyMoves.some(
                  ([mr, mc]) => mr === midR && mc === midC,
                );
              }),
            );
            if (!isGuarded) {
              checkCell(r + dr * 2, c + dc * 2);
            }
          }
        }
      }
    });
  }

  if (depth === 0) {
    return moves.filter(([mr, mc]) => {
      const nextBoard = board.map((row) => [...row]);
      nextBoard[mr][mc] = { ...piece };
      nextBoard[r][c] = null;
      return !isPlayerInCheck(player, nextBoard, terrain, mode);
    });
  }

  return moves;
};
