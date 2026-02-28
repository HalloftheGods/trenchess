/**
 * boardCellHelpers — Tactical logic for the cell's visual state.
 */

export const getSetupHighlightArea = (
  isSetupPhase: boolean,
  mode: string,
  turn: string,
  row: number,
  col: number,
): string => {
  if (!isSetupPhase) return "";


  if (mode === "2p-ns") {
    if (turn === "red" && row < 6)
      return "ring-1 ring-orange-500/20 ring-inset bg-orange-500/5";
    if (turn === "blue" && row >= 6)
      return "ring-1 ring-blue-500/20 ring-inset bg-blue-500/5";
  } else if (mode === "2p-ew") {
    if (turn === "green" && col < 6)
      return "ring-1 ring-emerald-500/20 ring-inset bg-emerald-500/5";
    if (turn === "yellow" && col >= 6)
      return "ring-1 ring-yellow-500/20 ring-inset bg-yellow-500/5";
  } else {
    if (turn === "red" && row < 6 && col < 6)
      return "ring-1 ring-orange-500/20 ring-inset bg-orange-500/5";
    if (turn === "yellow" && row < 6 && col >= 6)
      return "ring-1 ring-yellow-500/20 ring-inset bg-yellow-500/5";
    if (turn === "green" && row >= 6 && col < 6)
      return "ring-1 ring-emerald-500/20 ring-inset bg-emerald-500/5";
    if (turn === "blue" && row >= 6 && col >= 6)
      return "ring-1 ring-blue-500/20 ring-inset bg-blue-500/5";
  }

  return "";
};
