import { TERRAIN_TYPES } from "@/constants";
import { buildBoard, buildClassicalBoard, buildTerrain, serializeGame } from "./utils";

export const createMountainPass = () => {
  const terrain = buildTerrain();
  const cols = [1, 2, 3, 4, 7, 8, 9, 10];
  const rows = [4, 5, 6, 7];
  rows.forEach((r) => {
    cols.forEach((c) => {
      terrain[r][c] = TERRAIN_TYPES.RUBBLE;
    });
  });
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "Mountain Pass");
};

export const createTheDunes = () => {
  const terrain = buildTerrain();
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
  const spots: number[][] = [];
  quadrant.forEach(([r, c]) => {
    spots.push([r, c], [r, 11 - c], [11 - r, c], [11 - r, 11 - c]);
  });
  spots.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT));
  return serializeGame("2p-ew", buildClassicalBoard("2p-ew"), terrain, "The Dunes");
};

export const createGreatDesert = () => {
  const terrain = buildTerrain();
  for (let c = 1; c < 12; c += 2) {
    terrain[3][c] = TERRAIN_TYPES.DESERT;
    terrain[8][c] = TERRAIN_TYPES.DESERT;
  }
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
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Great Desert");
};

export const createTheRockies = () => {
  const terrain = buildTerrain();
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
    [2, 2],
    [2, 3],
    [3, 2],
    [3, 3],
    [2, 8],
    [2, 9],
    [3, 8],
    [3, 9],
    [8, 2],
    [8, 3],
    [9, 2],
    [9, 3],
    [8, 8],
    [8, 9],
    [9, 8],
    [9, 9],
  ];
  [...xShape, ...mountainForts].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE),
  );
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Rockies");
};

export const createCrossfire = () => {
  const terrain = buildTerrain();
  const walls = [
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 7],
    [8, 4],
    [8, 5],
    [8, 6],
    [8, 7],
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3],
    [4, 8],
    [5, 8],
    [6, 8],
    [7, 8],
  ];
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
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "Crossfire");
};

export const createTheCage = () => {
  const terrain = buildTerrain();
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
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Cage");
};

export const createTheArena = () => {
  const terrain = buildTerrain();
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
  const inner = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];
  const corners = [
    [2, 2],
    [2, 9],
    [9, 2],
    [9, 9],
  ];
  const edges = [
    [0, 5],
    [0, 6],
    [11, 5],
    [11, 6],
  ];
  [...ring, ...inner, ...corners, ...edges].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE),
  );
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Arena");
};

export const createCrossroads = () => {
  const terrain = buildTerrain();
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
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "Crossroads");
};

export const createTargetPractice = () => {
  const terrain = buildTerrain();
  const bullseye = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];
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
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "Target Practice");
};

export const createTheWall = () => {
  const terrain = buildTerrain();
  for (let c = 0; c < 12; c++) {
    terrain[2][c] = TERRAIN_TYPES.RUBBLE;
    terrain[9][c] = TERRAIN_TYPES.RUBBLE;
  }
  terrain[5][0] = TERRAIN_TYPES.RUBBLE;
  terrain[6][0] = TERRAIN_TYPES.RUBBLE;
  terrain[5][11] = TERRAIN_TYPES.RUBBLE;
  terrain[6][11] = TERRAIN_TYPES.RUBBLE;
  terrain[5][5] = TERRAIN_TYPES.RUBBLE;
  terrain[5][6] = TERRAIN_TYPES.RUBBLE;
  terrain[6][5] = TERRAIN_TYPES.RUBBLE;
  terrain[6][6] = TERRAIN_TYPES.RUBBLE;
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Wall");
};

export const createTheFortress = () => {
  const terrain = buildTerrain();
  for (let c = 4; c <= 7; c++) {
    terrain[4][c] = TERRAIN_TYPES.RUBBLE;
    terrain[7][c] = TERRAIN_TYPES.RUBBLE;
  }
  terrain[5][4] = TERRAIN_TYPES.RUBBLE;
  terrain[6][4] = TERRAIN_TYPES.RUBBLE;
  terrain[5][7] = TERRAIN_TYPES.RUBBLE;
  terrain[6][7] = TERRAIN_TYPES.RUBBLE;
  const center = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];
  for (let c = 2; c <= 9; c++) {
    terrain[2][c] = TERRAIN_TYPES.RUBBLE;
    terrain[9][c] = TERRAIN_TYPES.RUBBLE;
  }
  center.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Fortress");
};

export const createCheckeredPast = () => {
  const terrain = buildTerrain();
  for (const r of [3, 4, 7, 8]) {
    for (let c = 0; c < 12; c++) {
      if ((r + c) % 2 !== 0) terrain[r][c] = TERRAIN_TYPES.PONDS;
    }
  }
  const corners = [
    [0, 0],
    [0, 11],
    [11, 0],
    [11, 11],
  ];
  const guards = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];
  [...corners, ...guards].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS),
  );
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "Checkered Past");
};

export const createTheGrid = () => {
  const terrain = buildTerrain();
  const rows = [2, 4, 7, 9];
  const cols = [1, 2, 4, 5, 6, 7, 9, 10];
  rows.forEach((r) => {
    cols.forEach((c) => {
      terrain[r][c] = TERRAIN_TYPES.RUBBLE;
    });
  });
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Grid");
};

export const createCornerConflicts = () => {
  const terrain = buildTerrain();
  for (let r = 0; r <= 3; r++) {
    terrain[r][0] = TERRAIN_TYPES.RUBBLE;
    terrain[r][1] = TERRAIN_TYPES.TREES;
    terrain[11 - r][0] = TERRAIN_TYPES.RUBBLE;
    terrain[11 - r][1] = TERRAIN_TYPES.TREES;
    terrain[r][11] = TERRAIN_TYPES.RUBBLE;
    terrain[r][10] = TERRAIN_TYPES.TREES;
    terrain[11 - r][11] = TERRAIN_TYPES.RUBBLE;
    terrain[11 - r][10] = TERRAIN_TYPES.TREES;
  }
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "Corner Conflicts");
};

export const createTheVoid = () => {
  const terrain = buildTerrain();
  for (let c = 2; c <= 9; c++) {
    terrain[2][c] = TERRAIN_TYPES.RUBBLE;
    terrain[9][c] = TERRAIN_TYPES.RUBBLE;
  }
  for (let r = 3; r <= 8; r++) {
    terrain[r][2] = TERRAIN_TYPES.RUBBLE;
    terrain[r][9] = TERRAIN_TYPES.RUBBLE;
  }
  const center = [
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
  ];
  center.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Void");
};

export const createTheMaze = () => {
  const terrain = buildTerrain();
  const walls = [
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
    [5, 3],
    [5, 4],
    [5, 6],
    [5, 7],
    [5, 8],
    [6, 3],
    [6, 4],
    [6, 5],
    [6, 7],
    [6, 8],
    [4, 2],
    [4, 9],
    [7, 2],
    [7, 9],
    [4, 5],
    [7, 6],
  ];
  walls.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Maze");
};

export const createTheGalaxy = () => {
  const terrain = buildTerrain();
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
  const arm2 = arm1.map(([r, c]) => [r, 11 - c]);
  const arm3 = arm1.map(([r, c]) => [11 - r, 11 - c]);
  const arm4 = arm1.map(([r, c]) => [11 - r, c]);
  [...arm1, ...arm2, ...arm3, ...arm4].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT),
  );
  return serializeGame("2p-ns", buildClassicalBoard("2p-ns"), terrain, "The Galaxy");
};
