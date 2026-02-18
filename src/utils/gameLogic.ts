import { BOARD_SIZE, TERRAIN_TYPES, PIECES } from "../constants";
import type { BoardPiece, TerrainType, GameMode } from "../types";

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
    if (!targetTerrain) return false; // Safety check

    // Desert: Only Tanks can land on it. Blocks passing for everyone.
    if (targetTerrain === TERRAIN_TYPES.DESERT) {
      if (piece.type === PIECES.TANK) {
        if (!targetPiece) {
          moves.push([nr, nc]);
        } else if (targetPiece.player !== player) {
          moves.push([nr, nc]);
        }
      }
      return false; // Break sliders (like Tank/Rook) and block others
    }

    // Swamp: Pro Tank. Blocks Horseman, Sniper
    if (piece.type === PIECES.HORSEMAN && targetTerrain === TERRAIN_TYPES.PONDS)
      return false;
    if (piece.type === PIECES.SNIPER && targetTerrain === TERRAIN_TYPES.PONDS)
      return false;

    // Forest: Pro Sniper. Blocks Tank, Horseman
    if (piece.type === PIECES.TANK && targetTerrain === TERRAIN_TYPES.TREES)
      return false;
    if (piece.type === PIECES.HORSEMAN && targetTerrain === TERRAIN_TYPES.TREES)
      return false;

    // Mountains: Pro Horseman. Blocks Tank, Sniper
    if (piece.type === PIECES.TANK && targetTerrain === TERRAIN_TYPES.RUBBLE)
      return false;
    if (piece.type === PIECES.SNIPER && targetTerrain === TERRAIN_TYPES.RUBBLE)
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

  if (piece.type === PIECES.BOT) {
    if (mode === "2p-ew") {
      const dir = player === "player3" ? 1 : -1;
      if (
        c + dir >= 0 &&
        c + dir < BOARD_SIZE &&
        !board[r][c + dir] &&
        terrain[r]?.[c + dir] !== TERRAIN_TYPES.DESERT
      )
        moves.push([r, c + dir]);

      // Backflip Jump: Backward 2 squares
      const bdc = -2 * dir;
      if (
        c + bdc >= 0 &&
        c + bdc < BOARD_SIZE &&
        !board[r][c + bdc] &&
        terrain[r]?.[c + bdc] !== TERRAIN_TYPES.DESERT
      )
        moves.push([r, c + bdc]);
      [
        [1, dir],
        [-1, dir],
      ].forEach(([dr, dc]) => {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          board[nr][nc] &&
          board[nr][nc]!.player !== player &&
          terrain[nr]?.[nc] !== TERRAIN_TYPES.DESERT
        )
          moves.push([nr, nc]);
      });
    } else if (mode === "4p") {
      // 4p: NW=p1, NE=p2, SW=p3, SE=p4
      // NW (p1) moves S(+r) & E(+c)
      // NE (p2) moves S(+r) & W(-c)
      // SW (p3) moves N(-r) & E(+c)
      // SE (p4) moves N(-r) & W(-c)
      let dr = 0,
        dc = 0;
      if (player === "player1") {
        dr = 1;
        dc = 1;
      } else if (player === "player2") {
        dr = 1;
        dc = -1;
      } else if (player === "player3") {
        dr = -1;
        dc = 1;
      } else if (player === "player4") {
        dr = -1;
        dc = -1;
      }

      // Orthogonal moves (forward)
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
          !board[nr][nc] &&
          terrain[nr]?.[nc] !== TERRAIN_TYPES.DESERT
        )
          moves.push([nr, nc]);
      });

      // Backflip Jumps: Backward 2 squares (NW moves SE, etc)
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
          !board[nr][nc] &&
          terrain[nr]?.[nc] !== TERRAIN_TYPES.DESERT
        )
          moves.push([nr, nc]);
      });

      // Diagonal captures (three directions: forward-center, forward-left, forward-right)
      [
        [dr, dc],
        [dr, -dc],
        [-dr, dc],
      ].forEach(([ddr, ddc]) => {
        const nr = r + ddr,
          nc = c + ddc;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          board[nr][nc] &&
          board[nr][nc]!.player !== player &&
          terrain[nr]?.[nc] !== TERRAIN_TYPES.DESERT
        )
          moves.push([nr, nc]);
      });
    } else {
      // Default NS direction (2p-ns)
      const dir = player === "player1" || player === "player2" ? 1 : -1;
      if (
        r + dir >= 0 &&
        r + dir < BOARD_SIZE &&
        !board[r + dir][c] &&
        terrain[r + dir]?.[c] !== TERRAIN_TYPES.DESERT
      )
        moves.push([r + dir, c]);

      // Backflip Jump: Backward 2 squares
      const bdr = -2 * dir;
      if (
        r + bdr >= 0 &&
        r + bdr < BOARD_SIZE &&
        !board[r + bdr][c] &&
        terrain[r + bdr]?.[c] !== TERRAIN_TYPES.DESERT
      )
        moves.push([r + bdr, c]);
      [
        [dir, 1],
        [dir, -1],
      ].forEach(([dr, dc]) => {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          board[nr][nc] &&
          board[nr][nc]!.player !== player &&
          terrain[nr]?.[nc] !== TERRAIN_TYPES.DESERT
        )
          moves.push([nr, nc]);
      });
    }
  }

  if (piece.type === PIECES.HORSEMAN || piece.type === PIECES.BATTLEKNIGHT) {
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
        if (targetTerrain === TERRAIN_TYPES.DESERT) return;
        if (piece.type === PIECES.HORSEMAN) {
          if (
            targetTerrain === TERRAIN_TYPES.PONDS ||
            targetTerrain === TERRAIN_TYPES.TREES
          )
            return;
        }
        if (!targetPiece || targetPiece.player !== player) moves.push([nr, nc]);
      }
    });
  }

  if (piece.type === PIECES.SNIPER || piece.type === PIECES.BATTLEKNIGHT) {
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
  }

  if (piece.type === PIECES.TANK || piece.type === PIECES.BATTLEKNIGHT) {
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
  }

  if (piece.type === PIECES.COMMANDER) {
    [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ].forEach(([dr, dc]) => checkCell(r + dr, c + dc));
    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].forEach(([dr, dc]) => {
      checkCell(r + dr, c + dc);
      const midR = r + dr;
      const midC = c + dc;
      if (
        midR >= 0 &&
        midR < BOARD_SIZE &&
        midC >= 0 &&
        midC < BOARD_SIZE &&
        !board[midR]?.[midC] &&
        terrain[midR][midC] !== TERRAIN_TYPES.DESERT
      ) {
        if (depth > 0) {
          checkCell(r + dr * 2, c + dc * 2);
        } else {
          // Recursive check for guards
          const isGuarded = board.some((row, br) =>
            row.some((cell, bc) => {
              if (!cell || cell.player === player) return false;
              // Recursive call with higher depth to avoid check filtering
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
              return enemyMoves.some(([mr, mc]) => mr === midR && mc === midC);
            }),
          );
          if (!isGuarded) {
            checkCell(r + dr * 2, c + dc * 2);
          }
        }
      }
    });
  }

  // Check Rule: Filter moves that leave the king in check (only at top level)
  if (depth === 0) {
    return moves.filter(([mr, mc]) => {
      // Simulate move
      const nextBoard = board.map((row) => [...row]);
      nextBoard[mr][mc] = { ...piece }; // Move piece
      nextBoard[r][c] = null; // Clear source

      // If this move captures someone, they are gone (already overwritten)

      // Check if we are in check after this move
      return !isPlayerInCheck(player, nextBoard, terrain, mode);
    });
  }

  return moves;
};

export const isPlayerInCheck = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  // 1. Find King (Commander)
  let kingPos: [number, number] | null = null;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const p = board[r][c];
      if (p && p.player === player && p.type === PIECES.COMMANDER) {
        kingPos = [r, c];
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return true; // No king = lost (conceptually)

  const [kr, kc] = kingPos;

  // 2. Check if any enemy piece can attack kingPos
  return board.some((row, r) =>
    row.some((cell, c) => {
      // If it's an enemy piece
      if (cell && cell.player !== player) {
        // Get their raw moves (depth 1 to skip check filter)
        const moves = getValidMoves(
          r,
          c,
          cell,
          cell.player,
          board,
          terrain,
          mode,
          1,
        );
        // If they can hit the king
        return moves.some(([mr, mc]) => mr === kr && mc === kc);
      }
      return false;
    }),
  );
};

export const hasAnyValidMoves = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  return board.some((row, r) =>
    row.some((cell, c) => {
      if (cell && cell.player === player) {
        const moves = getValidMoves(
          r,
          c,
          cell,
          player,
          board,
          terrain,
          mode,
          0,
        );
        return moves.length > 0;
      }
      return false;
    }),
  );
};
