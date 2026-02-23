import type { PieceStyle, ArmyUnit } from "./game";

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
