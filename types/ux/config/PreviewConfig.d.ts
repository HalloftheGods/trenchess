import type { GameMode } from "../core/GameMode";
import type { TerrainType } from "../game/TerrainType";

export interface PreviewConfig {
  mode?: GameMode | null;
  protocol?:
    | "custom"
    | "zen-garden"
    | "classic"
    | "quick"
    | "terrainiffic"
    | null;
  label?: string;
  hideUnits?: boolean;
  highlightCells?: [number, number][];
  showIcons?: boolean;
  forcedTerrain?: TerrainType | null;
  useDefaultFormation?: boolean;
  highlightOuterSquares?: boolean;
  [key: string]: unknown;
}
