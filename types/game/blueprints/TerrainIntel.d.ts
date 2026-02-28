import type { TerrainDetail } from "./TerrainDetail";

/** Legacy support for TerrainIntel which is a subset of TerrainDetail */
export type TerrainIntel = Pick<
  TerrainDetail,
  | "label"
  | "desc"
  | "sanctuaryUnits"
  | "allowedUnits"
  | "blockedUnits"
  | "subtitle"
  | "tagline"
  | "flavorTitle"
  | "flavorStats"
>;
