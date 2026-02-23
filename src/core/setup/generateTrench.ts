import { BOARD_SIZE } from "@/core/primitives/game";
import { MAX_TERRAIN_PER_PLAYER } from "@/core/primitives/terrain";
import { TERRAIN_TYPES } from "@/core/primitives/terrain";
import type { GameMode, TerrainType } from "@/shared/types/game";
import { getPlayerCells } from "@/core/setup/setupLogic";

interface GenerationOptions {
  mode: GameMode;
  seed?: number; // Optional numeric seed for determinism
  symmetry?: "mirror" | "rotational" | "chaos";
  allowedTypes?: TerrainType[];
}

export class TerraForm {
  /**
   * Generates a 12x12 terrain grid based on the provided options.
   */
  static generate(options: GenerationOptions): TerrainType[][] {
    const {
      mode,
      seed = Math.random(),
      symmetry = "rotational",
      allowedTypes,
    } = options;

    // 1. Initialize Blank Grid
    const terrain: TerrainType[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(TERRAIN_TYPES.FLAT));

    // 2. Determine Zones & Quotas
    const zones = this.getZones(mode);
    const quota =
      mode === "2p-ns" || mode === "2p-ew"
        ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
        : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

    // 3. Generate for Primary Zone (Red)
    // We generate a "Master Pattern" for the first zone, then stick to it or mirror it.
    const masterZone = zones[0];
    const masterPattern = this.generateZonePattern(
      masterZone,
      quota,
      seed,
      allowedTypes,
    );

    // 4. Apply to all zones
    zones.forEach((zone, index) => {
      const isMaster = index === 0;
      let pattern = masterPattern;

      if (!isMaster) {
        if (symmetry === "mirror" || symmetry === "rotational") {
          // Both 2p-ns and 2p-ew are rotationally symmetric in this game
          // (Board center is point of reflection)
          pattern = this.getSymmetricalPattern(
            masterPattern,
            masterZone,
            zone,
            symmetry,
          );
        } else {
          // Chaos: Generate fresh for every zone
          pattern = this.generateZonePattern(
            zone,
            quota,
            seed + index * 0.1,
            allowedTypes,
          );
        }
      }

      // Apply the pattern to the actual grid
      this.applyPattern(terrain, pattern, zone);
    });

    return terrain;
  }

  // --- Helpers ---

  private static getZones(mode: GameMode): { r: number; c: number }[][] {
    const toObj = (cells: [number, number][]) =>
      cells.map(([r, c]) => ({ r, c }));

    if (mode === "2p-ns") {
      return [
        toObj(getPlayerCells("red", mode)), // North
        toObj(getPlayerCells("blue", mode)), // South
      ];
    }
    if (mode === "2p-ew") {
      return [
        toObj(getPlayerCells("green", mode)), // West
        toObj(getPlayerCells("yellow", mode)), // East
      ];
    }
    // 4p / 2v2
    return [
      toObj(getPlayerCells("red", mode)), // NW
      toObj(getPlayerCells("yellow", mode)), // NE
      toObj(getPlayerCells("green", mode)), // SW
      toObj(getPlayerCells("blue", mode)), // SE
    ];
  }

  private static generateZonePattern(
    zoneCells: { r: number; c: number }[],
    quota: number,
    seed: number,
    allowedTypes?: TerrainType[],
  ): TerrainType[] {
    const pattern = Array(zoneCells.length).fill(TERRAIN_TYPES.FLAT);

    // Pseudo-random number generator
    let seedState = seed;
    const rng = () => {
      seedState = (seedState * 9301 + 49297) % 233280;
      return seedState / 233280;
    };

    const allTypes = [
      TERRAIN_TYPES.TREES,
      TERRAIN_TYPES.PONDS,
      TERRAIN_TYPES.RUBBLE,
      TERRAIN_TYPES.DESERT,
    ];

    const types =
      allowedTypes && allowedTypes.length > 0 ? allowedTypes : allTypes;

    let placedCount = 0;

    // Helper to find a cell's index in the flat zone array
    const findIndex = (r: number, c: number) =>
      zoneCells.findIndex((z) => z.r === r && z.c === c);

    // Algorithm: "Clustered Expansion"
    // We want features to feel like 'blobs' or 'territories' rather than strings.

    while (placedCount < quota) {
      // 1. Pick a Feature Type and a Seed
      const featureType = types[Math.floor(rng() * types.length)];

      const emptyIndices = pattern
        .map((t, i) => (t === TERRAIN_TYPES.FLAT ? i : -1))
        .filter((i) => i !== -1);

      if (emptyIndices.length === 0) break;

      // Start a new cluster
      let baseSize = 4;
      if (featureType === TERRAIN_TYPES.TREES) baseSize = 6; // Forests are larger
      if (featureType === TERRAIN_TYPES.PONDS) baseSize = 3; // Swamps are smaller/scattered
      if (featureType === TERRAIN_TYPES.RUBBLE) baseSize = 5; // Mountains are medium/long
      if (featureType === TERRAIN_TYPES.DESERT) baseSize = 7; // Deserts sprawl

      const clusterSize = Math.min(
        quota - placedCount,
        Math.floor(rng() * 4) + baseSize,
      );
      const seedIdx = emptyIndices[Math.floor(rng() * emptyIndices.length)];

      // We'll use a simple BFS frontier to grow the cluster
      const clusterFrontier = [seedIdx];
      const currentCluster: number[] = [];

      while (
        currentCluster.length < clusterSize &&
        clusterFrontier.length > 0
      ) {
        // Pick from frontier with 'Adjacency Bias' (8-way)
        let bestIdx = 0;
        let maxWeight = -1;

        for (let i = 0; i < clusterFrontier.length; i++) {
          const idx = clusterFrontier[i];
          const cell = zoneCells[idx];

          let neighborCount = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nIdx = findIndex(cell.r + dr, cell.c + dc);
              if (nIdx !== -1 && currentCluster.includes(nIdx)) {
                // Diagonals weigh slightly less (0.7) than cardinals (1)
                neighborCount += dr === 0 || dc === 0 ? 1 : 0.7;
              }
            }
          }

          const weight = neighborCount * 8 + rng() * 3;
          if (weight > maxWeight) {
            maxWeight = weight;
            bestIdx = i;
          }
        }

        const selectedIdx = clusterFrontier.splice(bestIdx, 1)[0];
        if (pattern[selectedIdx] === TERRAIN_TYPES.FLAT) {
          pattern[selectedIdx] = featureType;
          currentCluster.push(selectedIdx);
          placedCount++;

          // Add its 8-way neighbors to frontier
          const cell = zoneCells[selectedIdx];
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nIdx = findIndex(cell.r + dr, cell.c + dc);
              if (
                nIdx !== -1 &&
                pattern[nIdx] === TERRAIN_TYPES.FLAT &&
                !clusterFrontier.includes(nIdx)
              ) {
                clusterFrontier.push(nIdx);
              }
            }
          }
        }
      }
    }

    return pattern;
  }

  /**
   * Transforms a pattern from a Source Zone to a Target Zone based on symmetry.
   * Assumes Rotational Symmetry (Point Reflection) for standard chess balance.
   */
  private static getSymmetricalPattern(
    sourcePattern: TerrainType[],
    sourceCells: { r: number; c: number }[],
    targetCells: { r: number; c: number }[],
    type: "mirror" | "rotational",
  ): TerrainType[] {
    const targetPattern = Array(targetCells.length).fill(TERRAIN_TYPES.FLAT);

    sourceCells.forEach((src, i) => {
      const terrain = sourcePattern[i];
      if (!terrain || terrain === TERRAIN_TYPES.FLAT) return;

      // Calculate Target Coordinate based on symmetry
      let tr: number, tc: number;

      if (type === "rotational" || type === "mirror") {
        // Point Reflection (Standard Chess: P1(0,0) <-> P4(11,11))
        // This works for 2P-NS, 2P-EW, and diagonals in 4P
        tr = 11 - src.r;
        tc = 11 - src.c;
      } else {
        // Fallback (Identity)
        tr = src.r;
        tc = src.c;
      }

      // Find this coordinate in the target zone
      const targetIdx = targetCells.findIndex((z) => z.r === tr && z.c === tc);

      if (targetIdx !== -1) {
        targetPattern[targetIdx] = terrain;
      }
    });

    return targetPattern;
  }

  private static applyPattern(
    grid: TerrainType[][],
    pattern: TerrainType[],
    zoneCells: { r: number; c: number }[],
  ) {
    zoneCells.forEach((cell, i) => {
      if (pattern[i] && pattern[i] !== TERRAIN_TYPES.FLAT) {
        grid[cell.r][cell.c] = pattern[i];
      }
    });
  }
}
