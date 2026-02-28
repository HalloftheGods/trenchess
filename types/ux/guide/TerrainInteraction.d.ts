export interface TerrainInteraction {
  unit: string;
  status: "allow" | "block" | "special";
  text: string;
}
