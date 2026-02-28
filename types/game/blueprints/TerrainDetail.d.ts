import type { TerrainBlueprint } from "./TerrainBlueprint";
import type { Icon, s, TT } from "../../base";

export interface TerrainDetail extends TerrainBlueprint {
  key: s;
  name: s;
  terrainTypeKey: TT;
  label: s;
  desc: s;
  subtitle?: s;
  tagline?: s;
  flavorTitle?: s;
  flavorStats?: s[];
  icon?: Icon;
  bg?: s;
  text?: s;
  border?: s;
  ring?: s;
  headerBg?: s;
  iconBg?: s;
  color?: {
    bg: s;
    text: s;
    border: s;
    headerBg: s;
    iconBg?: s;
  };
}
