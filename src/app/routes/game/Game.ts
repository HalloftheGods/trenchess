import { BOARD_SIZE } from "@constants/core.constants";
import type { Game } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { MAX_TERRAIN_PER_PLAYER } from "@constants/terrain.constants";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import { PIECES } from "@engineConfigs/unitDetails";
import {
  createInitialState,
  canPlaceUnit,
  getPlayerCells,
} from "@setup/setupLogic";
import type {
  GameMode,
  BoardPiece,
  TerrainType,
  PieceType,
} from "@engineTypes/game";

export interface TrenchGameState {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  capturedBy: Record<string, BoardPiece[]>;
  mode: GameMode;
  activePlayers: string[];
  readyPlayers: Record<string, boolean>;
  playerMap: Record<string, string>;
}

export interface TrenchGameSetupData {
  mode?: GameMode;
  board?: (BoardPiece | null)[][];
  terrain?: TerrainType[][];
  inventory?: Record<string, PieceType[]>;
  terrainInventory?: Record<string, TerrainType[]>;
}

export const TrenchGame: Game<TrenchGameState, any, TrenchGameSetupData> = {
  name: "battle-chess",

  setup: ({ setupData }) => {
    const data = setupData as TrenchGameSetupData;
    const mode: GameMode = data?.mode || "2p-ns";
    let players: string[] = [];

    // Initialize playerMap based on mode
    const playerMap: Record<string, string> = {
      "0": "red",
      "1": "yellow",
      "2": "green",
      "3": "blue",
    };

    if (mode === "2p-ns") {
      players = ["red", "blue"];
      playerMap["0"] = "red";
      playerMap["1"] = "blue";
    } else if (mode === "2p-ew") {
      players = ["green", "yellow"];
      playerMap["0"] = "green";
      playerMap["1"] = "yellow";
    } else {
      players = ["red", "yellow", "green", "blue"];
    }

    // Default to classic initial state if no board/terrain provided in setupData
    const {
      board: initialBoard,
      terrain: initialTerrain,
      inventory: initialInventory,
      terrainInventory: initialTerrainInventory,
    } = createInitialState(mode, players);

    const board = data?.board || initialBoard;
    const terrain = data?.terrain || initialTerrain;
    const inventory = data?.inventory || initialInventory;
    const terrainInventory = data?.terrainInventory || initialTerrainInventory;

    return {
      board,
      terrain,
      inventory,
      terrainInventory,
      capturedBy: {
        red: [],
        yellow: [],
        green: [],
        blue: [],
      },
      mode,
      activePlayers: players,
      readyPlayers: {},
      playerMap,
    };
  },

  phases: {
    setup: {
      start: true,
      next: "play",
      turn: {
        activePlayers: { all: "setup" },
      },
      moves: {
        placePiece: (
          { G, playerID },
          r: number,
          c: number,
          type: PieceType | null,
        ) => {
          const pid = G.playerMap[playerID];
          if (!pid || !G.activePlayers.includes(pid)) return INVALID_MOVE;

          // 1. Check territory
          const myCells = getPlayerCells(pid, G.mode);
          if (!myCells.some(([cellR, cellC]) => cellR === r && cellC === c)) {
            return INVALID_MOVE;
          }

          const oldPiece = G.board[r][c];

          if (type === null) {
            // Remove piece
            if (oldPiece && oldPiece.player === pid) {
              G.inventory[pid].push(oldPiece.type);
              G.board[r][c] = null;
            }
            return;
          }

          // 2. Check compatibility
          if (!canPlaceUnit(type, G.terrain[r][c])) return INVALID_MOVE;

          // 3. Check inventory
          const idx = G.inventory[pid]?.indexOf(type);
          if (idx === -1 || idx === undefined) return INVALID_MOVE;

          // 4. Update
          if (oldPiece && oldPiece.player === pid) {
            G.inventory[pid].push(oldPiece.type);
          }

          G.board[r][c] = { type, player: pid };
          G.inventory[pid].splice(idx, 1);
        },

        placeTerrain: (
          { G, playerID },
          r: number,
          c: number,
          type: TerrainType,
        ) => {
          const pid = G.playerMap[playerID];
          if (!pid || !G.activePlayers.includes(pid)) return INVALID_MOVE;

          // 1. Check territory
          const myCells = getPlayerCells(pid, G.mode);
          if (!myCells.some(([cellR, cellC]) => cellR === r && cellC === c)) {
            return INVALID_MOVE;
          }

          const oldTerrain = G.terrain[r][c];

          if (type === TERRAIN_TYPES.FLAT) {
            // Remove terrain
            if (oldTerrain !== TERRAIN_TYPES.FLAT) {
              G.terrainInventory[pid].push(oldTerrain);
              G.terrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
            }
            return;
          }

          // 2. Check compatibility with existing unit
          const unit = G.board[r][c];
          if (unit && !canPlaceUnit(unit.type, type)) return INVALID_MOVE;

          // 3. Check inventory
          const idx = G.terrainInventory[pid]?.indexOf(type);
          if (idx === -1 || idx === undefined) return INVALID_MOVE;

          // 4. Check quota
          const isTwoPlayer = G.mode === "2p-ns" || G.mode === "2p-ew";
          const quota = isTwoPlayer
            ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
            : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

          let currentCount = 0;
          for (const [cellR, cellC] of myCells) {
            if (G.terrain[cellR][cellC] !== TERRAIN_TYPES.FLAT) currentCount++;
          }

          if (currentCount >= quota && G.terrain[r][c] === TERRAIN_TYPES.FLAT) {
            return INVALID_MOVE;
          }

          // 5. Update
          if (oldTerrain !== TERRAIN_TYPES.FLAT) {
            G.terrainInventory[pid].push(oldTerrain);
          }

          G.terrain[r][c] = type;
          G.terrainInventory[pid].splice(idx, 1);
        },

        ready: ({ G, playerID }, explicitPid?: string) => {
          const pid = explicitPid || G.playerMap[playerID];
          if (pid) G.readyPlayers[pid] = true;
        },
      },
      endIf: ({ G }) => {
        return G.activePlayers.every((p: string) => G.readyPlayers[p]);
      },
    },

    play: {
      turn: {
        order: {
          first: () => 0,
          next: ({ G, ctx }) => (ctx.playOrderPos + 1) % G.activePlayers.length,
        },
      },
      moves: {
        movePiece: (
          { G, playerID },
          from: [number, number],
          to: [number, number],
        ) => {
          const pid = G.playerMap[playerID];
          if (!pid) return INVALID_MOVE;

          const [fromR, fromC] = from;
          const [toR, toC] = to;
          const piece = G.board[fromR][fromC];

          if (!piece || piece.player !== pid) return INVALID_MOVE;

          const captured = G.board[toR][toC];

          // Move piece
          G.board[toR][toC] = piece;
          G.board[fromR][fromC] = null;

          // --- Pawn Promotion Logic ---
          if (piece.type === PIECES.PAWN) {
            let promoted = false;
            if (G.mode === "2p-ns") {
              if (pid === "red" && toR === BOARD_SIZE - 1) promoted = true;
              if (pid === "blue" && toR === 0) promoted = true;
            } else if (G.mode === "2p-ew") {
              if (pid === "green" && toC === BOARD_SIZE - 1) promoted = true;
              if (pid === "yellow" && toC === 0) promoted = true;
            } else {
              if (
                pid === "red" &&
                (toR === BOARD_SIZE - 1 || toC === BOARD_SIZE - 1)
              )
                promoted = true;
              if (pid === "yellow" && (toR === BOARD_SIZE - 1 || toC === 0))
                promoted = true;
              if (pid === "green" && (toR === 0 || toC === BOARD_SIZE - 1))
                promoted = true;
              if (pid === "blue" && (toR === 0 || toC === 0))
                promoted = true;
            }

            if (promoted) {
              G.board[toR][toC] = {
                ...piece,
                type: PIECES.QUEEN as PieceType,
              };
            }
          }

          // Capture Logic
          if (captured) {
            if (captured.player === pid) return INVALID_MOVE;
            G.capturedBy[pid].push(captured);

            // Commander Capture Logic
            if (captured.type === PIECES.KING) {
              const victim = captured.player;
              G.activePlayers = G.activePlayers.filter(
                (p: string) => p !== victim,
              );

              // Transfer army
              for (let r = 0; r < BOARD_SIZE; r++) {
                for (let c = 0; c < BOARD_SIZE; c++) {
                  if (G.board[r][c]?.player === victim) {
                    G.board[r][c]!.player = pid;
                  }
                }
              }
            }
          }

          // Desert Rule
          for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
              const p = G.board[r][c];
              if (
                p &&
                p.player === pid &&
                G.terrain[r][c] === TERRAIN_TYPES.DESERT
              ) {
                if (r !== toR || c !== toC) {
                  // Eliminate piece left on desert
                  if (p.type === PIECES.KING) {
                    // Commander dies on desert -> entire army eliminated (reclaimed by environment)
                    const victim = p.player;
                    G.activePlayers = G.activePlayers.filter(
                      (ap: string) => ap !== victim,
                    );
                    for (let row = 0; row < BOARD_SIZE; row++) {
                      for (let col = 0; col < BOARD_SIZE; col++) {
                        if (G.board[row][col]?.player === victim)
                          G.board[row][col] = null;
                      }
                    }
                  } else {
                    G.board[r][c] = null;
                  }
                }
              }
            }
          }
        },
      },
    },
  },

  endIf: ({ G }) => {
    if (G.activePlayers.length === 1) {
      return { winner: G.activePlayers[0] };
    }
  },
};
