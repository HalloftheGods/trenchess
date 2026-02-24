import type { PieceStyle, ArmyUnit, PieceType } from "./game";

export interface GameTheme {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    filled?: boolean,
  ) => React.ReactNode;
}

export interface TerrainIntel {
  label: string;
  desc: string;
  sanctuaryUnits: PieceType[];
  allowedUnits: PieceType[];
  blockedUnits: PieceType[];
  subtitle?: string;
  tagline?: string;
  flavorTitle?: string;
  flavorStats?: string[];
}
