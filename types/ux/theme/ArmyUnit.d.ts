import type { PieceType } from "../../game/state/PieceType";
import type { Icon } from "../../base";
import type { s, n } from "../../base/Primitives";

export interface ArmyUnit {
  type: PieceType;
  count: n;
  emoji: s;
  bold: s;
  outlined: s;
  custom: Icon;
  lucide: Icon;
  hoverIcon?: Icon;
}
