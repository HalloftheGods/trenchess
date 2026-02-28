import type { s } from "../../base";
import type { TerrainType } from "../state/TerrainType";
import type { UnitBlueprint } from "./UnitBlueprint";

export interface UnitDetails extends UnitBlueprint {
  title: s;
  subtitle?: s;
  role: s;
  desc?: s[];
  levelUp?: {
    title: s;
    stats: s[];
    sanctuaryTerrain?: TerrainType[];
  };
}
