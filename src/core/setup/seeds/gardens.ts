import { TERRAIN_TYPES } from "@/constants";
import { buildBoard, buildTerrain, serializeGame } from "./utils";

export const createGreatDivide = () => {
  const terrain = buildTerrain();
  const rows = [0, 1, 3, 4, 7, 8, 10, 11];
  rows.forEach((r) => {
    terrain[r][5] = TERRAIN_TYPES.PONDS;
    terrain[r][6] = TERRAIN_TYPES.PONDS;
    terrain[r][4] = TERRAIN_TYPES.TREES;
    terrain[r][7] = TERRAIN_TYPES.TREES;
  });
  return serializeGame("2p-ew", buildBoard(), terrain, "The Great Divide");
};

export const createSherwood = () => {
  const terrain = buildTerrain();
  const trees = [
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
  trees.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));
  return serializeGame("2p-ns", buildBoard(), terrain, "Sherwood Forest");
};

export const createOasis = () => {
  const terrain = buildTerrain();
  terrain[5][5] = TERRAIN_TYPES.PONDS;
  terrain[5][6] = TERRAIN_TYPES.PONDS;
  terrain[6][5] = TERRAIN_TYPES.PONDS;
  terrain[6][6] = TERRAIN_TYPES.PONDS;
  const trees = [
    [4, 5],
    [4, 6],
    [7, 5],
    [7, 6],
    [5, 4],
    [6, 4],
    [5, 7],
    [6, 7],
    [4, 4],
    [4, 7],
    [7, 4],
    [7, 7],
  ];
  trees.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));
  const rubble = [
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
  rubble.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));
  return serializeGame("2p-ns", buildBoard(), terrain, "Oasis");
};

export const createSwampFever = () => {
  const terrain = buildTerrain();
  for (let r = 4; r <= 7; r++) {
    for (let c = 2; c <= 9; c++) {
      if ((r + c) % 2 === 0) terrain[r][c] = TERRAIN_TYPES.PONDS;
    }
  }
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
  return serializeGame("2p-ns", buildBoard(), terrain, "Swamp Fever");
};

export const createTwinRivers = () => {
  const terrain = buildTerrain();
  for (let r = 2; r <= 9; r++) {
    terrain[r][3] = TERRAIN_TYPES.PONDS;
    terrain[r][8] = TERRAIN_TYPES.PONDS;
  }
  for (let r = 3; r <= 6; r++) {
    terrain[r][2] = TERRAIN_TYPES.TREES;
    terrain[r][9] = TERRAIN_TYPES.TREES;
  }
  for (let r = 4; r <= 7; r++) {
    terrain[r][1] = TERRAIN_TYPES.RUBBLE;
    terrain[r][10] = TERRAIN_TYPES.RUBBLE;
  }
  return serializeGame("2p-ns", buildBoard(), terrain, "Twin Rivers");
};

export const createSnakeRiver = () => {
  const terrain = buildTerrain();
  const wavy: number[][] = [];
  [1, 3, 5, 7, 9].forEach((r) => {
    wavy.push([r, 3], [r, 8]);
  });
  [2, 4, 6, 8, 10].forEach((r) => {
    wavy.push([r, 4], [r, 7]);
  });
  const fixed = [
    [0, 5],
    [0, 6],
    [11, 5],
    [11, 6],
    [5, 0],
    [6, 0],
    [5, 11],
    [6, 11],
    [0, 0],
    [0, 11],
    [11, 0],
    [11, 11],
  ];
  [...wavy, ...fixed].forEach(
    ([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS),
  );
  return serializeGame("2p-ns", buildBoard(), terrain, "Snake River");
};

export const createForestTrails = () => {
  const terrain = buildTerrain();
  const points = [
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
    [4, 4],
    [4, 7],
    [7, 4],
    [7, 7],
    [5, 2],
    [6, 2],
    [5, 9],
    [6, 9],
    [2, 5],
    [2, 6],
    [9, 5],
    [9, 6],
    [0, 5],
    [0, 6],
    [11, 5],
    [11, 6],
  ];
  points.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));
  return serializeGame("2p-ns", buildBoard(), terrain, "Forest Trails");
};

export const createArchipelago = () => {
  const terrain = buildTerrain();
  const rows = [2, 4, 7, 9];
  const cols = [2, 4, 7, 9];
  rows.forEach((r) => {
    cols.forEach((c) => {
      terrain[r][c] = TERRAIN_TYPES.PONDS;
      terrain[r][c + 1] = TERRAIN_TYPES.TREES;
    });
  });
  return serializeGame("2p-ns", buildBoard(), terrain, "Archipelago");
};

export const createMirageLake = () => {
  const terrain = buildTerrain();
  for (let c = 4; c <= 7; c++) terrain[4][c] = TERRAIN_TYPES.DESERT;
  for (let c = 3; c <= 8; c++) terrain[5][c] = TERRAIN_TYPES.DESERT;
  for (let c = 3; c <= 8; c++) terrain[6][c] = TERRAIN_TYPES.DESERT;
  for (let c = 4; c <= 7; c++) terrain[7][c] = TERRAIN_TYPES.DESERT;
  const fixed = [
    [1, 1],
    [1, 10],
    [10, 1],
    [10, 10],
    [5, 1],
    [6, 1],
    [5, 10],
    [6, 10],
    [1, 5],
    [1, 6],
    [10, 5],
    [10, 6],
  ];
  fixed.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.DESERT));
  return serializeGame("2p-ns", buildBoard(), terrain, "Mirage Lake");
};

export const createIslandHopping = () => {
  const terrain = buildTerrain();
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
  return serializeGame("2p-ns", buildBoard(), terrain, "Island Hopping");
};

export const createForestVsSwamp = () => {
  const terrain = buildTerrain();
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
    [2, 4],
    [2, 7],
  ];
  const southPonds = northTrees.map(([r, c]) => [11 - r, c]);
  northTrees.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.TREES));
  southPonds.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS));
  return serializeGame("2p-ns", buildBoard(), terrain, "Forest vs Swamp");
};

export const createMountainVsRiver = () => {
  const terrain = buildTerrain();
  for (let c = 2; c <= 9; c++) terrain[4][c] = TERRAIN_TYPES.RUBBLE;
  const bunkers = [
    [2, 2],
    [2, 3],
    [2, 8],
    [2, 9],
    [3, 2],
    [3, 3],
    [3, 8],
    [3, 9],
  ];
  bunkers.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));
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
    [8, 10],
    [10, 3],
    [10, 8],
  ];
  river.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.PONDS));
  return serializeGame("2p-ns", buildBoard(), terrain, "Mountain vs River");
};

export const createSiegeOfTheNorth = () => {
  const terrain = buildTerrain();
  const board = buildBoard();
  for (let c = 2; c <= 9; c++) terrain[4][c] = TERRAIN_TYPES.RUBBLE;
  const fort = [
    [1, 1],
    [1, 10],
    [2, 1],
    [2, 10],
    [1, 2],
    [1, 9],
    [2, 2],
    [2, 9],
  ];
  fort.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));
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
  south.forEach(([r, c]) => (terrain[r][c] = TERRAIN_TYPES.RUBBLE));
  return serializeGame("2p-ns", board, terrain, "Siege of the North");
};

export const createTheGauntlet = () => {
  const terrain = buildTerrain();
  for (let r = 2; r <= 9; r++) {
    terrain[r][2] = TERRAIN_TYPES.TREES;
    terrain[r][3] = TERRAIN_TYPES.PONDS;
    terrain[r][8] = TERRAIN_TYPES.PONDS;
    terrain[r][9] = TERRAIN_TYPES.TREES;
  }
  return serializeGame("2p-ns", buildBoard(), terrain, "The Gauntlet");
};
