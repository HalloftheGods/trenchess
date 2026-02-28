import type { TerrainStatEntry } from "./TerrainStatEntry";
import type { Dictionary } from "../../base";

export interface MatchStatEntry {
  total: number;
  captures: number;
  rate: number;
  terrainStats: Dictionary<TerrainStatEntry>;
}
