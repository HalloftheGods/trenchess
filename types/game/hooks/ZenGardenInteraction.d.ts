export interface ZenGardenInteraction {
  handleZenGardenHover: (r: number, c: number, overrideTurn?: string) => void;
  handleZenGardenClick: (r: number, c: number, overrideTurn?: string) => void;
}
