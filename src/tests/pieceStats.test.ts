import { describe, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { PIECES, TERRAIN_TYPES, BOARD_SIZE } from "@constants";
import { getValidMoves } from "@/core/mechanics/movement/movementLogic";
import type { BoardPiece, TerrainType, PieceType } from "@/shared/types/game";

const ITERATIONS_PER_MATCHUP = 500_000;
const MAX_TURNS = 10;
const TOTAL_TERRAIN_TILES = 32;
const TERRAIN_PER_HALF = TOTAL_TERRAIN_TILES / 2;
const BOARD_MIDPOINT = Math.floor(BOARD_SIZE / 2);

const NON_FLAT_TERRAIN_KEYS = [
  TERRAIN_TYPES.TREES,
  TERRAIN_TYPES.PONDS,
  TERRAIN_TYPES.RUBBLE,
  TERRAIN_TYPES.DESERT,
];

const pickRandomNonFlat = (): TerrainType =>
  NON_FLAT_TERRAIN_KEYS[Math.floor(Math.random() * NON_FLAT_TERRAIN_KEYS.length)] as TerrainType;

const shuffle = (array: [number, number][]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateTerrainWithDensity = (): TerrainType[][] => {
  const terrain: TerrainType[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT),
  );

  const topHalf: [number, number][] = [];
  const bottomHalf: [number, number][] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (r < BOARD_MIDPOINT) topHalf.push([r, c]);
      else bottomHalf.push([r, c]);
    }
  }

  shuffle(topHalf);
  shuffle(bottomHalf);

  for (let i = 0; i < TERRAIN_PER_HALF; i++) {
    const [rT, cT] = topHalf[i];
    terrain[rT][cT] = pickRandomNonFlat();
    const [rB, cB] = bottomHalf[i];
    terrain[rB][cB] = pickRandomNonFlat();
  }

  return terrain;
};

interface TerrainStat {
  total: number;
  captures: number;
  rate: number;
}

const createInitialTerrainStats = () => ({
  [TERRAIN_TYPES.FLAT]: { total: 0, captures: 0, rate: 0 },
  [TERRAIN_TYPES.TREES]: { total: 0, captures: 0, rate: 0 },
  [TERRAIN_TYPES.PONDS]: { total: 0, captures: 0, rate: 0 },
  [TERRAIN_TYPES.RUBBLE]: { total: 0, captures: 0, rate: 0 },
  [TERRAIN_TYPES.DESERT]: { total: 0, captures: 0, rate: 0 },
});

describe("Piece Statistics Generator", () => {
  it("generates piece capture threat surface statistics", () => {
    const pieceKeys = Object.values(PIECES) as PieceType[];
    const stats: Record<string, any> = {};

    pieceKeys.forEach((attacker) => {
      stats[attacker] = {};

      pieceKeys.forEach((defender) => {
        let totalPlacements = 0;
        let captures = 0;
        const terrainStats: Record<string, TerrainStat> = createInitialTerrainStats();

        for (let i = 0; i < ITERATIONS_PER_MATCHUP; i++) {
          const rA = Math.floor(Math.random() * BOARD_SIZE);
          const cA = Math.floor(Math.random() * BOARD_SIZE);
          let rB = Math.floor(Math.random() * BOARD_SIZE);
          let cB = Math.floor(Math.random() * BOARD_SIZE);

          while (Math.abs(rA - rB) + Math.abs(cA - cB) < 2) {
            rB = Math.floor(Math.random() * BOARD_SIZE);
            cB = Math.floor(Math.random() * BOARD_SIZE);
          }

          const terrain = generateTerrainWithDensity();
          const startTerrain = terrain[rA][cA];

          totalPlacements++;
          terrainStats[startTerrain].total++;

          const boardState: (BoardPiece | null)[][] = Array.from({ length: BOARD_SIZE }, () =>
            Array(BOARD_SIZE).fill(null),
          );

          const p1: BoardPiece = { type: attacker, player: "red" };
          const p2: BoardPiece = { type: defender, player: "yellow" };
          boardState[rA][cA] = p1;
          boardState[rB][cB] = p2;

          let pA = [rA, cA];
          let pB = [rB, cB];
          let turn = 0;

          while (turn < MAX_TURNS) {
            const isAttackerTurn = turn % 2 === 0;
            const actingPlayer = isAttackerTurn ? "red" : "yellow";
            const pos = isAttackerTurn ? pA : pB;
            const piece = isAttackerTurn ? p1 : p2;
            const targetPos = isAttackerTurn ? pB : pA;

            const moves = getValidMoves(pos[0], pos[1], piece, actingPlayer, boardState, terrain, "2p-ns", 1);
            if (moves.length === 0) break;

            const isCapture = (m: number[]) => m[0] === targetPos[0] && m[1] === targetPos[1];
            const captureMove = moves.find(isCapture);

            if (captureMove) {
              if (isAttackerTurn) {
                captures++;
                terrainStats[startTerrain].captures++;
              }
              break;
            }

            const getDistance = (m: number[]) => Math.abs(m[0] - targetPos[0]) + Math.abs(m[1] - targetPos[1]);
            const bestMove = moves.reduce(
              (best, curr) => (getDistance(curr) < getDistance(best) ? curr : best),
              moves[0],
            );

            boardState[pos[0]][pos[1]] = null;
            boardState[bestMove[0]][bestMove[1]] = piece;
            if (isAttackerTurn) pA = bestMove;
            else pB = bestMove;

            turn++;
          }
        }

        Object.values(terrainStats).forEach((t) => {
          t.rate = t.total > 0 ? (t.captures / t.total) * 100 : 0;
        });

        stats[attacker][defender] = {
          total: totalPlacements,
          captures,
          rate: (captures / totalPlacements) * 100,
          terrainStats,
        };
      });
    });

    const outputPath = path.resolve(__dirname, "../shared/assets/statistics.json");
    fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2), "utf8");
    console.log(`Statistics generated: ${ITERATIONS_PER_MATCHUP.toLocaleString()} per matchup`);
  }, 900000);
});
