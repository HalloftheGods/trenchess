import type { TerrainInteraction } from "./TerrainInteraction";
import type { Icon, s } from "../../base";

export interface TerrainIntelPanelEntry {
  label: s;
  icon: Icon;
  color: s;
  interactions: TerrainInteraction[];
}
