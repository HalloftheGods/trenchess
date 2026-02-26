export interface TerrainStatEntry {
  total: number;
  captures: number;
  rate: number;
}

export interface MatchStatEntry {
  total: number;
  captures: number;
  rate: number;
  terrainStats: Record<string, TerrainStatEntry>;
}

export type CombatStats = Record<string, Record<string, MatchStatEntry>>;
