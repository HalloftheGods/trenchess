import React from "react";
import type { ArmyUnit } from "./ArmyUnit";
import type { PieceStyle } from "./PieceStyle";
import type { IconProps } from "@tc.types/base";
import type { s, n, b, v } from "@tc.types/base/Primitives";

export interface GameTheme {
  darkMode: b;
  pieceStyle: PieceStyle;
  toggleTheme: () => v;
  togglePieceStyle: () => v;
  getIcon: (
    unit: ArmyUnit,
    props?: IconProps | s,
    size?: n | s,
    filled?: b,
  ) => React.ReactNode;
}
