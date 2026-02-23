import { serializeGame } from "@utils/gameUrl";
import { BOARD_SIZE } from "@/shared/constants/core.constants";
import { TERRAIN_TYPES } from "@/core/data/terrainDetails";
import type { TerrainType, BoardPiece } from "@/shared/types/game";

// Helper to create an empty board
const createEmptyBoard = (): (BoardPiece | null)[][] =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

// Helper to create empty terrain
const createEmptyTerrain = (): TerrainType[][] =>
  Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT));

// --- Generators ---

const createGreatDivide = () => {
  const terrain = createEmptyTerrain();
  // River down the middle columns 5 and 6
  // Rows: 0,1, 3,4, 7,8, 10,11 (8 rows) * 2 columns = 16 pieces
  // Forest lining the river: cols 4 and 7 on same rows = 16 pieces
  const rows = [0, 1, 3, 4, 7, 8, 10, 11];
  rows.forEach((r) => {
    // River
    terrain[r][5] = TERRAIN_TYPES.PONDS;
    terrain[r][6] = TERRAIN_TYPES.PONDS;
    // Trees
    terrain[r][4] = TERRAIN_TYPES.TREES;
    terrain[r][7] = TERRAIN_TYPES.TREES;
  });
  // Total: 32 pieces
  return serializeGame(
    "2p-ew",
    createEmptyBoard(),
    terrain,
    "The Great Divide",
  );
};

const createSherwood = () => {
  const terrain = createEmptyTerrain();

  // Let's just list 32 trees explicitly to be safe and symmetric
  const trees = [
    // NW Corner (4)
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 2],
    // NE Corner (4)
    [1, 9],
    [1, 10],
    [2, 9],
    [2, 10],
    // SW Corner (4)
    [9, 1],
    [9, 2],
    [10, 1],
    [10, 2],
    // SE Corner (4)
    [9, 9],
    [9, 10],
    [10, 9],
    [10, 10],
    // Inner Circle (16)
    [4, 4],
    [4, 5],
    [4, 6],
    [4, 7],
    [7, 4],
    [7, 5],
    [7, 6],
    [7, 7],
    [5, 4],
    [6, 4], // Left side
    [5, 7],
    [6, 7], // Right side
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6], // Center block (4)
  ];
  // Wait, the inner circle list has overlap.
  // 4,4 4,5 4,6 4,7 (4)
  // 7,4 7,5 7,6 7,7 (4)
  // 5,4 6,4 (2)
  // 5,7 6,7 (2)
  // 5,5 5,6 6,5 6,6 (4)
  // Total inner = 16. Total outer = 16. Total = 32.

  trees.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Sherwood Forest");
};

const createMountainPass = () => {
  const terrain = createEmptyTerrain();
  // Thick walls: Rows 4,5,6,7. Cols 1-4, 7-10.
  // 4 rows * 8 cols = 32 pieces.
  const cols = [1, 2, 3, 4, 7, 8, 9, 10];
  const rows = [4, 5, 6, 7];

  rows.forEach((r) => {
    cols.forEach((c) => {
      terrain[r][c] = TERRAIN_TYPES.RUBBLE;
    });
  });

  // Total: 32 pieces
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Mountain Pass");
};

const createTheDunes = () => {
  const terrain = createEmptyTerrain();
  // 32 scattered dunes (Tundra/Rubble)
  // 4 quadrants. 8 pieces per quadrant.
  const quadrant = [
    [1, 1],
    [1, 3],
    [2, 2],
    [3, 1],
    [3, 4],
    [4, 3],
    [4, 5],
    [5, 4],
  ];
  // Mirror to all 4 quadrants
  const spots: number[][] = [];
  quadrant.forEach(([r, c]) => {
    spots.push([r, c]); // TL
    spots.push([r, 11 - c]); // TR
    spots.push([11 - r, c]); // BL
    spots.push([11 - r, 11 - c]); // BR
  });

  spots.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT));
  return serializeGame("2p-ew", createEmptyBoard(), terrain, "The Dunes");
};

const createOasis = () => {
  const terrain = createEmptyTerrain();
  // Center pond (4)
  terrain[5][5] = TERRAIN_TYPES.PONDS;
  terrain[5][6] = TERRAIN_TYPES.PONDS;
  terrain[6][5] = TERRAIN_TYPES.PONDS;
  terrain[6][6] = TERRAIN_TYPES.PONDS;
  // Surrounding Trees (8)
  const trees = [
    [4, 5],
    [4, 6],
    [7, 5],
    [7, 6],
    [5, 4],
    [6, 4],
    [5, 7],
    [6, 7],
  ];
  trees.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));
  // Outer Rubble corners (20 needed to reach 32... wait)
  // 4 + 8 = 12. Need 20.
  // 4 corner blocks of 5? No.
  // Let's do 4 corner blocks of 4 RUBBLE (16).
  // Total 12 + 16 = 28. Still need 4.
  // Add 4 more trees at diagonals of the pond: 4,4; 4,7; 7,4; 7,7.
  const extraTrees = [
    [4, 4],
    [4, 7],
    [7, 4],
    [7, 7],
  ];
  extraTrees.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));

  // Rubble Corners (16)
  const rubble = [
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 2], // TL
    [1, 9],
    [1, 10],
    [2, 9],
    [2, 10], // TR
    [9, 1],
    [9, 2],
    [10, 1],
    [10, 2], // BL
    [9, 9],
    [9, 10],
    [10, 9],
    [10, 10], // BR
  ];
  rubble.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));

  // Total: 4 (pond) + 8 (inner trees) + 4 (outer trees) + 16 (rubble) = 32.
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Oasis");
};

const createGreatDesert = () => {
  const terrain = createEmptyTerrain();
  // 1. Vertical Stripes (Columns 3 & 8) - Full length? 12 rows * 2 = 24.
  // Too blocking.
  // Let's stick to the pattern:
  // Odd columns in rows 3,8 (12 pieces).
  // Even columns in rows 2,9 (12 pieces).
  // Total 24.
  // Need 8 more.
  // 4 center guards (5,2; 6,2; 5,9; 6,9) = 4.
  // 4 corner guards (1,1; 1,10; 10,1; 10,10) = 4.
  // Total 32.

  // Rows 3 & 8, odd cols
  for (let c = 1; c < 12; c += 2) {
    terrain[3][c] = TERRAIN_TYPES.DESERT;
    terrain[8][c] = TERRAIN_TYPES.DESERT;
  }
  // Rows 2 & 9, even cols
  for (let c = 0; c < 12; c += 2) {
    terrain[2][c] = TERRAIN_TYPES.DESERT;
    terrain[9][c] = TERRAIN_TYPES.DESERT;
  }

  const guards = [
    [5, 2],
    [6, 2],
    [5, 9],
    [6, 9],
    [1, 1],
    [1, 10],
    [10, 1],
    [10, 10],
  ];
  guards.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT));

  return serializeGame(
    "2p-ns",
    createEmptyBoard(),
    terrain,
    "The Great Desert",
  );
};

const createTheRockies = () => {
  const terrain = createEmptyTerrain();
  // X shape (16 pieces) + 4 quadrants of 2x2 (16 pieces) = 32.
  const xShape = [
    [0, 0],
    [1, 1],
    [4, 4],
    [5, 5],
    [0, 11],
    [1, 10],
    [4, 7],
    [5, 6],
    [11, 0],
    [10, 1],
    [7, 4],
    [6, 5],
    [11, 11],
    [10, 10],
    [7, 7],
    [6, 6],
  ];

  const mountainForts = [
    // TL Quadrant
    [2, 2],
    [2, 3],
    [3, 2],
    [3, 3],
    // TR Quadrant
    [2, 8],
    [2, 9],
    [3, 8],
    [3, 9],
    // BL Quadrant
    [8, 2],
    [8, 3],
    [9, 2],
    [9, 3],
    // BR Quadrant
    [8, 8],
    [8, 9],
    [9, 8],
    [9, 9],
  ];

  [...xShape, ...mountainForts].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE),
  );
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Rockies");
};

const createSwampFever = () => {
  const terrain = createEmptyTerrain();
  // 1. Central Checkerboard 4x8 = 32 slots -> 16 pieces.
  for (let r = 4; r <= 7; r++) {
    for (let c = 2; c <= 9; c++) {
      if ((r + c) % 2 === 0) terrain[r][c] = TERRAIN_TYPES.PONDS;
    }
  }
  // 2. Corner Swamps (4 clumps of 4 = 16)
  const corners = [
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 2],
    [1, 9],
    [1, 10],
    [2, 9],
    [2, 10],
    [9, 1],
    [9, 2],
    [10, 1],
    [10, 2],
    [9, 9],
    [9, 10],
    [10, 9],
    [10, 10],
  ];
  corners.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS));
  // Total 16+16=32.
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Swamp Fever");
};

const createCrossfire = () => {
  const terrain = createEmptyTerrain();
  // 16 wall pieces (from previous).
  // Walls
  const walls = [
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7], // Top horiz
    [8, 4],
    [8, 5],
    [8, 6],
    [8, 7], // Bot horiz
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3], // Left vert
    [4, 8],
    [5, 8],
    [6, 8],
    [7, 8], // Right vert
  ];
  // 16 pieces.

  // Add 4 corner bunkers (2x2) = 16 pieces.
  const bunkers = [
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 2],
    [1, 9],
    [1, 10],
    [2, 9],
    [2, 10],
    [9, 1],
    [9, 2],
    [10, 1],
    [10, 2],
    [9, 9],
    [9, 10],
    [10, 9],
    [10, 10],
  ];

  [...walls, ...bunkers].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE),
  );
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Crossfire");
};

const createTheCage = () => {
  const terrain = createEmptyTerrain();

  // Diagonals
  const diagonals = [
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [0, 11],
    [1, 10],
    [2, 9],
    [3, 8],
    [11, 0],
    [10, 1],
    [9, 2],
    [8, 3],
    [11, 11],
    [10, 10],
    [9, 9],
    [8, 8],
  ];

  // Center Box (4x4 hollow)
  // r4: c4..7 (4)
  // r7: c4..7 (4)
  // r5: c4, c7 (2)
  // r6: c4, c7 (2)
  // Total 12.
  // Plus center 2x2.
  // r5: c5, c6 (2)
  // r6: c5, c6 (2)
  // Total 16.

  const box = [
    [4, 4],
    [4, 5],
    [4, 6],
    [4, 7],
    [7, 4],
    [7, 5],
    [7, 6],
    [7, 7],
    [5, 4],
    [6, 4],
    [5, 7],
    [6, 7],
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];

  [...diagonals, ...box].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE),
  );
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Cage");
};

const createTwinRivers = () => {
  const terrain = createEmptyTerrain();
  // River vertical: Cols 3, 8. Rows 2-9 (8 rows). 8*2 = 16 pieces.
  for (let r = 2; r <= 9; r++) {
    terrain[r][3] = TERRAIN_TYPES.PONDS;
    terrain[r][8] = TERRAIN_TYPES.PONDS;
  }
  // Trees: Cols 2, 9. Rows 3-6 (4 rows). 4*2 = 8 pieces.
  for (let r = 3; r <= 6; r++) {
    terrain[r][2] = TERRAIN_TYPES.TREES;
    terrain[r][9] = TERRAIN_TYPES.TREES;
  }
  // Rubble: Cols 1, 10. Rows 4-7 (4 rows). 4*2 = 8 pieces.
  for (let r = 4; r <= 7; r++) {
    terrain[r][1] = TERRAIN_TYPES.RUBBLE;
    terrain[r][10] = TERRAIN_TYPES.RUBBLE;
  }
  // Total 16+8+8=32
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Twin Rivers");
};

const createTheArena = () => {
  const terrain = createEmptyTerrain();
  // Ring of 6x6 box (20 pieces)
  // Top: 3,3 to 3,8 (6)
  // Bot: 8,3 to 8,8 (6)
  // Left: 4,3 to 7,3 (4)
  // Right: 4,8 to 7,8 (4)
  const ring = [
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7],
    [3, 8],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 6],
    [8, 7],
    [8, 8],
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3],
    [4, 8],
    [5, 8],
    [6, 8],
    [7, 8],
  ];
  // Inner center 4 (4)
  const inner = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];
  // Outer corners 4 (4)
  const corners = [
    [2, 2],
    [2, 9],
    [9, 2],
    [9, 9],
  ];
  // Mid edges 4 (4)
  const edges = [
    [0, 5],
    [0, 6],
    [11, 5],
    [11, 6],
  ];

  [...ring, ...inner, ...corners, ...edges].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE),
  );
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Arena");
};

const createCrossroads = () => {
  const terrain = createEmptyTerrain();
  // 4 blocks of 4x2 = 32 pieces? No, 4 blocks of 8 pieces.
  // Block 1: R2-3, C2-5 (8)
  // Block 2: R2-3, C6-9 (8)
  // Block 3: R8-9, C2-5 (8)
  // Block 4: R8-9, C6-9 (8)
  const blocks = [];
  for (let r = 2; r <= 3; r++) {
    for (let c = 2; c <= 5; c++) blocks.push([r, c]);
    for (let c = 6; c <= 9; c++) blocks.push([r, c]);
  }
  for (let r = 8; r <= 9; r++) {
    for (let c = 2; c <= 5; c++) blocks.push([r, c]);
    for (let c = 6; c <= 9; c++) blocks.push([r, c]);
  }
  blocks.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Crossroads");
};

const createTargetPractice = () => {
  const terrain = createEmptyTerrain();
  // Center Bullseye (4)
  const bullseye = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];
  // Ring radius 2 (20)
  const ring = [
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7],
    [3, 8],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 6],
    [8, 7],
    [8, 8],
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3],
    [4, 8],
    [5, 8],
    [6, 8],
    [7, 8],
  ];
  // Corners (8)
  const corners = [
    [1, 1],
    [1, 10],
    [10, 1],
    [10, 10],
    [2, 2],
    [2, 9],
    [9, 2],
    [9, 9],
  ];

  [...bullseye, ...ring, ...corners].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT),
  );
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Target Practice");
};

const createSnakeRiver = () => {
  const terrain = createEmptyTerrain();
  // Wavy lines
  const wavy: number[][] = [];
  [1, 3, 5, 7, 9].forEach((r) => {
    wavy.push([r, 3]);
    wavy.push([r, 8]);
  });
  [2, 4, 6, 8, 10].forEach((r) => {
    wavy.push([r, 4]);
    wavy.push([r, 7]);
  });

  // Center top/bot (4)
  const center = [
    [0, 5],
    [0, 6],
    [11, 5],
    [11, 6],
  ];
  // Mid sides (4)
  const mids = [
    [5, 0],
    [6, 0],
    [5, 11],
    [6, 11],
  ];
  // Corners (4)
  const corners = [
    [0, 0],
    [0, 11],
    [11, 0],
    [11, 11],
  ];

  [...wavy, ...center, ...mids, ...corners].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS),
  );
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Snake River");
};

const createTheWall = () => {
  const terrain = createEmptyTerrain();
  // R2 and R9 full (24)
  for (let c = 0; c < BOARD_SIZE; c++) {
    terrain[2][c] = TERRAIN_TYPES.RUBBLE;
    terrain[9][c] = TERRAIN_TYPES.RUBBLE;
  }
  // Edges (4)
  terrain[5][0] = TERRAIN_TYPES.RUBBLE;
  terrain[6][0] = TERRAIN_TYPES.RUBBLE;
  terrain[5][11] = TERRAIN_TYPES.RUBBLE;
  terrain[6][11] = TERRAIN_TYPES.RUBBLE;
  // Center (4)
  terrain[5][5] = TERRAIN_TYPES.RUBBLE;
  terrain[5][6] = TERRAIN_TYPES.RUBBLE;
  terrain[6][5] = TERRAIN_TYPES.RUBBLE;
  terrain[6][6] = TERRAIN_TYPES.RUBBLE;

  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Wall");
};

const createForestTrails = () => {
  const terrain = createEmptyTerrain();
  // Corners 3x3 (16)
  const corners = [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
    [0, 9],
    [0, 11],
    [2, 9],
    [2, 11],
    [9, 0],
    [9, 2],
    [11, 0],
    [11, 2],
    [9, 9],
    [9, 11],
    [11, 9],
    [11, 11],
  ];
  // Center 4x4 corners (4)
  const center = [
    [4, 4],
    [4, 7],
    [7, 4],
    [7, 7],
  ];
  // Mid-lines (12)
  const mids = [
    [5, 2],
    [6, 2],
    [5, 9],
    [6, 9], // Sides
    [2, 5],
    [2, 6],
    [9, 5],
    [9, 6], // Top/Bot inner
    [0, 5],
    [0, 6],
    [11, 5],
    [11, 6], // Top/Bot outer
  ];

  [...corners, ...center, ...mids].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES),
  );
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Forest Trails");
};

const createMirageLake = () => {
  const terrain = createEmptyTerrain();
  // Center Lake (20)
  // R4 C4..7 (4)
  for (let c = 4; c <= 7; c++) terrain[4][c] = TERRAIN_TYPES.DESERT;
  // R5 C3..8 (6)
  for (let c = 3; c <= 8; c++) terrain[5][c] = TERRAIN_TYPES.DESERT;
  // R6 C3..8 (6)
  for (let c = 3; c <= 8; c++) terrain[6][c] = TERRAIN_TYPES.DESERT;
  // R7 C4..7 (4)
  for (let c = 4; c <= 7; c++) terrain[7][c] = TERRAIN_TYPES.DESERT;

  // Corners (4)
  const corners = [
    [1, 1],
    [1, 10],
    [10, 1],
    [10, 10],
  ];
  // Edges (4)
  const edges = [
    [5, 1],
    [6, 1],
    [5, 10],
    [6, 10],
  ];
  // Top/Bot (4)
  const ends = [
    [1, 5],
    [1, 6],
    [10, 5],
    [10, 6],
  ];

  [...corners, ...edges, ...ends].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT),
  );
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Mirage Lake");
};

const createTheFortress = () => {
  const terrain = createEmptyTerrain();
  // Inner Box Hollow (12)
  for (let c = 4; c <= 7; c++) {
    terrain[4][c] = TERRAIN_TYPES.RUBBLE;
    terrain[7][c] = TERRAIN_TYPES.RUBBLE;
  }
  terrain[5][4] = TERRAIN_TYPES.RUBBLE;
  terrain[6][4] = TERRAIN_TYPES.RUBBLE;
  terrain[5][7] = TERRAIN_TYPES.RUBBLE;
  terrain[6][7] = TERRAIN_TYPES.RUBBLE;

  // Inner Center (4)
  const center = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];
  // Outer Walls (16)
  for (let c = 2; c <= 9; c++) {
    terrain[2][c] = TERRAIN_TYPES.RUBBLE;
    terrain[9][c] = TERRAIN_TYPES.RUBBLE;
  }

  center.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Fortress");
};

const createCheckeredPast = () => {
  const terrain = createEmptyTerrain();
  // Rows 3,4 and 7,8 checkerboard (24)
  for (const r of [3, 4, 7, 8]) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if ((r + c) % 2 !== 0) terrain[r][c] = TERRAIN_TYPES.PONDS;
    }
  }
  // Corners (4)
  const corners = [
    [0, 0],
    [0, 11],
    [11, 0],
    [11, 11],
  ];
  // Guards (4)
  const guards = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];

  [...corners, ...guards].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS),
  );
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Checkered Past");
};

const createIslandHopping = () => {
  const terrain = createEmptyTerrain();

  // Trees (8)
  const trees = [
    [4, 4],
    [4, 3],
    [4, 7],
    [4, 8],
    [7, 4],
    [7, 3],
    [7, 7],
    [7, 8],
  ];
  // Ponds (8)
  const ponds = [
    [5, 5],
    [4, 5],
    [5, 6],
    [4, 6],
    [6, 5],
    [7, 5],
    [6, 6],
    [7, 6],
  ];
  // Desert (8)
  const desert = [
    [2, 2],
    [1, 1],
    [2, 9],
    [1, 10],
    [9, 2],
    [10, 1],
    [9, 9],
    [10, 10],
  ];
  // Rubble (8)
  const rubble = [
    [3, 5],
    [2, 5],
    [3, 6],
    [2, 6],
    [8, 5],
    [9, 5],
    [8, 6],
    [9, 6],
  ];

  trees.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));
  ponds.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS));
  desert.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT));
  rubble.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));

  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Island Hopping");
};

// --- Asymmetric & Unit Presets ---

const createForestVsSwamp = () => {
  const terrain = createEmptyTerrain();
  // North: Forest (16 trees)
  // 4 rows of 4 trees scattered in top half
  const northTrees = [
    [1, 2],
    [1, 5],
    [1, 6],
    [1, 9],
    [2, 3],
    [2, 8],
    [3, 1],
    [3, 4],
    [3, 7],
    [3, 10],
    [4, 2],
    [4, 5],
    [4, 6],
    [4, 9],
  ]; // 14 trees. Need 2 more. [2,4], [2,7]
  northTrees.push([2, 4], [2, 7]);

  // South: Swamp (16 ponds)
  // Mirror pattern but with ponds
  const southPonds = northTrees.map(([r, c]) => [11 - r, c]);

  northTrees.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));
  southPonds.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS));

  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Forest vs Swamp");
};

const createMountainVsRiver = () => {
  const terrain = createEmptyTerrain();
  // North: Mountains (16 Rubble)
  // Defensive wall
  for (let c = 2; c <= 9; c++) terrain[4][c] = TERRAIN_TYPES.RUBBLE; // 8
  // Bunkers
  terrain[2][2] = TERRAIN_TYPES.RUBBLE;
  terrain[2][3] = TERRAIN_TYPES.RUBBLE;
  terrain[2][8] = TERRAIN_TYPES.RUBBLE;
  terrain[2][9] = TERRAIN_TYPES.RUBBLE;
  terrain[3][2] = TERRAIN_TYPES.RUBBLE;
  terrain[3][3] = TERRAIN_TYPES.RUBBLE;
  terrain[3][8] = TERRAIN_TYPES.RUBBLE;
  terrain[3][9] = TERRAIN_TYPES.RUBBLE; // 8

  // South: River (16 Ponds)
  // Winding river
  const river = [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [8, 5],
    [8, 6],
    [9, 6],
    [9, 7],
    [9, 8],
    [9, 9],
    [9, 10],
    [8, 1],
    [8, 10], // Extra pools
  ]; // 14. Need 2 more.
  river.push([10, 3], [10, 8]);

  river.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS));

  return serializeGame(
    "2p-ns",
    createEmptyBoard(),
    terrain,
    "Mountain vs River",
  );
};

// Preset with Units!
const createSiegeOfTheNorth = () => {
  const terrain = createEmptyTerrain();
  const board = createEmptyBoard();

  // Terrain: Fortress North (16 Rubble)
  // Wall at R4
  for (let c = 2; c <= 9; c++) terrain[4][c] = TERRAIN_TYPES.RUBBLE;
  // Corners
  terrain[1][1] = TERRAIN_TYPES.RUBBLE;
  terrain[1][10] = TERRAIN_TYPES.RUBBLE;
  terrain[2][1] = TERRAIN_TYPES.RUBBLE;
  terrain[2][10] = TERRAIN_TYPES.RUBBLE;
  terrain[1][2] = TERRAIN_TYPES.RUBBLE;
  terrain[1][9] = TERRAIN_TYPES.RUBBLE;
  terrain[2][2] = TERRAIN_TYPES.RUBBLE;
  terrain[2][9] = TERRAIN_TYPES.RUBBLE;

  // Terrain: Open Field South (16 Flat? No, need 16 terrain pieces for South player too?
  // Actually, standard setup usually allows placing terrain.
  // But for a preset, we define it.
  // Let's give scatter rubble south too for fairness, or Tundra.
  const south = [
    [7, 2],
    [7, 9],
    [8, 3],
    [8, 8],
    [9, 4],
    [9, 7],
    [8, 1],
    [8, 10],
    [9, 1],
    [9, 10],
    [10, 1],
    [10, 10],
    [7, 5],
    [7, 6],
    [10, 5],
    [10, 6],
  ];
  south.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE)); // Siege implies rocks

  return serializeGame("2p-ns", board, terrain, "Siege of the North");
};

const createTheGauntlet = () => {
  const terrain = createEmptyTerrain();
  // Narrow corridor down middle
  // Sides filled with Ponds/Trees
  for (let r = 2; r <= 9; r++) {
    terrain[r][2] = TERRAIN_TYPES.TREES;
    terrain[r][3] = TERRAIN_TYPES.PONDS;
    // path at 4,5,6,7
    terrain[r][8] = TERRAIN_TYPES.PONDS;
    terrain[r][9] = TERRAIN_TYPES.TREES;
  }
  // 8 rows * 4 cols = 32 pieces precisely.
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Gauntlet");
};

const createArchipelago = () => {
  const terrain = createEmptyTerrain();
  // 4x4 grid of 2x1 islands (32 pieces)
  // Island size 2. 16 islands.
  // Rows 2,4,7,9. Cols 2,4,7,9. (4x4 grid)
  const rows = [2, 4, 7, 9];
  const cols = [2, 4, 7, 9];

  rows.forEach((r) => {
    cols.forEach((c) => {
      terrain[r][c] = TERRAIN_TYPES.PONDS;
      terrain[r][c + 1] = TERRAIN_TYPES.TREES;
    });
  });

  return serializeGame("2p-ns", createEmptyBoard(), terrain, "Archipelago");
};

const createTheSpiral = () => {
  const terrain = createEmptyTerrain();
  // Hard to make a perfect spiral with 32 blocks on grid.
  // Let's make a "galaxy" arms shape.
  // 4 arms of 8 pieces.
  // TL Arm
  const arm1 = [
    [2, 2],
    [2, 3],
    [2, 4],
    [3, 2],
    [4, 2],
    [5, 2],
    [5, 3],
    [5, 4],
  ];
  const arm2 = arm1.map(([r, c]) => [r, 11 - c]); // TR
  const arm3 = arm1.map(([r, c]) => [11 - r, 11 - c]); // BR
  const arm4 = arm1.map(([r, c]) => [11 - r, c]); // BL

  // Wait, check overlaps?
  // 5,4 mirrored to TR is 5,7.
  // Mirrored to BR is 6,7.
  // Mirrored to BL is 6,4.
  // No central overlap. Safe.

  arm1.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT));
  arm2.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT));
  arm3.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT));
  arm4.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT));

  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Galaxy");
};

const createTheMaze = () => {
  const terrain = createEmptyTerrain();
  // A maze-like structure
  // 32 wall segments
  // R3: 1-10 (10)
  // R8: 1-10 (10)
  // R5: 3-8 (6)
  // R6: 3-8 (6)
  // Total 32.
  // Leave gaps.
  // R3: Gap at 5,6. (8 pieces)
  // R8: Gap at 5,6. (8 pieces)
  // R5: Gap at 2,9. (Wait 3-8 is len 6). Gap at 5. (5 pieces)
  // R6: Gap at 6. (5 pieces)
  // Total 8+8+5+5=26. Need 6 more.
  // Vertical plugs: R4C2, R4C9, R7C2, R7C9 (4).
  // R4C5, R7C6 (2).
  // Total 32.

  const walls = [
    // Outer Rings
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 7],
    [3, 8],
    [3, 9],
    [3, 10],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 7],
    [8, 8],
    [8, 9],
    [8, 10],
    // Inner Rings
    [5, 3],
    [5, 4],
    [5, 6],
    [5, 7],
    [5, 8], // Gap at 5,5
    [6, 3],
    [6, 4],
    [6, 5],
    [6, 7],
    [6, 8], // Gap at 6,6
    // Plugs
    [4, 2],
    [4, 9],
    [7, 2],
    [7, 9],
    [4, 5],
    [7, 6],
  ];

  walls.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Maze");
};

const createTheGrid = () => {
  const terrain = createEmptyTerrain();
  // 32 single blocks spaced out
  // Rows 2,4,7,9. Cols 1,2, 4,5, 6,7, 9,10. (4 * 8 = 32)
  const rows = [2, 4, 7, 9];
  const cols = [1, 2, 4, 5, 6, 7, 9, 10];

  rows.forEach((r) => {
    cols.forEach((c) => {
      terrain[r][c] = TERRAIN_TYPES.RUBBLE;
    });
  });
  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Grid");
};

const createCornerConflicts = () => {
  const terrain = createEmptyTerrain();
  // Heavy corners, open center
  // 4 corners of 8 pieces (32)
  // TL: R0-3, C0-1 (8)
  // TR: R0-3, C10-11 (8)
  // BL: R8-11, C0-1 (8)
  // BR: R8-11, C10-11 (8)
  for (let r = 0; r <= 3; r++) {
    terrain[r][0] = TERRAIN_TYPES.RUBBLE;
    terrain[r][1] = TERRAIN_TYPES.TREES;
    terrain[11 - r][0] = TERRAIN_TYPES.RUBBLE; // BL
    terrain[11 - r][1] = TERRAIN_TYPES.TREES;

    terrain[r][11] = TERRAIN_TYPES.RUBBLE; // TR
    terrain[r][10] = TERRAIN_TYPES.TREES;
    terrain[11 - r][11] = TERRAIN_TYPES.RUBBLE; // BR
    terrain[11 - r][10] = TERRAIN_TYPES.TREES;
  }
  return serializeGame(
    "2p-ns",
    createEmptyBoard(),
    terrain,
    "Corner Conflicts",
  );
};

const createTheVoid = () => {
  const terrain = createEmptyTerrain();
  // Solid block of nothingness... wait, I need 32 pieces.
  // "The Void" - outline the board?
  // Perimeter.
  // Top/Bot rows 0,11. 12+12=24.
  // Left/Right cols 0,11. (10+10=20 middle).
  // Too many.
  // Inner Ring.
  // R2 C2-9 (8)
  // R9 C2-9 (8)
  // R3-8 C2 (6)
  // R3-8 C9 (6)
  // Total 8+8+6+6=28.
  // Need 4.
  // Center 2x2. 5,5 5,6 6,5 6,6.
  // Total 32.

  const ring = [];
  for (let c = 2; c <= 9; c++) {
    ring.push([2, c]);
    ring.push([9, c]);
  }
  for (let r = 3; r <= 8; r++) {
    ring.push([r, 2]);
    ring.push([r, 9]);
  }
  const center = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];

  [...ring, ...center].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE),
  );

  return serializeGame("2p-ns", createEmptyBoard(), terrain, "The Void");
};

export const DEFAULT_SEEDS = [
  {
    id: "default-divide",
    name: "The Great Divide",
    seed: createGreatDivide(),
    mode: "2p-ew",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-sherwood",
    name: "Sherwood Forest",
    seed: createSherwood(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-pass",
    name: "Mountain Pass",
    seed: createMountainPass(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-dunes",
    name: "The Dunes",
    seed: createTheDunes(),
    mode: "2p-ew",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-oasis",
    name: "Oasis",
    seed: createOasis(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-desert",
    name: "The Great Desert",
    seed: createGreatDesert(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-rockies",
    name: "The Rockies",
    seed: createTheRockies(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-swamp",
    name: "Swamp Fever",
    seed: createSwampFever(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-crossfire",
    name: "Crossfire",
    seed: createCrossfire(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-cage",
    name: "The Cage",
    seed: createTheCage(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-islands",
    name: "Island Hopping",
    seed: createIslandHopping(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  // Batch 2
  {
    id: "default-twinrivers",
    name: "Twin Rivers",
    seed: createTwinRivers(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-arena",
    name: "The Arena",
    seed: createTheArena(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-crossroads",
    name: "Crossroads",
    seed: createCrossroads(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-target",
    name: "Target Practice",
    seed: createTargetPractice(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-snake",
    name: "Snake River",
    seed: createSnakeRiver(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-wall",
    name: "The Wall",
    seed: createTheWall(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-trails",
    name: "Forest Trails",
    seed: createForestTrails(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-mirage",
    name: "Mirage Lake",
    seed: createMirageLake(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-fortress",
    name: "The Fortress",
    seed: createTheFortress(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-checkered",
    name: "Checkered Past",
    seed: createCheckeredPast(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  // Batch 3
  {
    id: "default-fvs",
    name: "Forest vs Swamp",
    seed: createForestVsSwamp(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-mvr",
    name: "Mountain vs River",
    seed: createMountainVsRiver(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-siege",
    name: "Siege of the North",
    seed: createSiegeOfTheNorth(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-gauntlet",
    name: "The Gauntlet",
    seed: createTheGauntlet(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-archipelago",
    name: "Archipelago",
    seed: createArchipelago(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-galaxy",
    name: "The Galaxy",
    seed: createTheSpiral(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-maze",
    name: "The Maze",
    seed: createTheMaze(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-grid",
    name: "The Grid",
    seed: createTheGrid(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-corners",
    name: "Corner Conflicts",
    seed: createCornerConflicts(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-void",
    name: "The Void",
    seed: createTheVoid(),
    mode: "2p-ns",
    createdAt: new Date().toISOString(),
  },
];
