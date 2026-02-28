export interface BoardInteraction {
  handleCellHover: (r: number, c: number, overrideTurn?: string) => void;
  handleCellClick: (r: number, c: number, overrideTurn?: string) => void;
}
