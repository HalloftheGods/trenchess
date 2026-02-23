export const getQuadrantBaseStyle = (
  r: number,
  c: number,
  mode: string,
): string => {
  const isAlt = (r + c) % 2 === 1;
  const isInner = r >= 2 && r <= 9 && c >= 2 && c <= 9;

  const getStyle = (color: string): string => {
    if (color === "red") {
      if (isInner)
        return isAlt
          ? "bg-red-900/80 dark:bg-red-950/90"
          : "bg-red-700/80 dark:bg-red-900/80";
      return isAlt
        ? "bg-red-300/60 dark:bg-red-800/40"
        : "bg-red-200/60 dark:bg-red-700/40";
    }
    if (color === "blue") {
      if (isInner)
        return isAlt
          ? "bg-blue-900/80 dark:bg-blue-950/90"
          : "bg-blue-700/80 dark:bg-blue-900/80";
      return isAlt
        ? "bg-blue-300/60 dark:bg-blue-800/40"
        : "bg-blue-200/60 dark:bg-blue-700/40";
    }
    if (color === "yellow") {
      if (isInner)
        return isAlt
          ? "bg-yellow-700/80 dark:bg-yellow-950/90"
          : "bg-yellow-500/80 dark:bg-yellow-800/80";
      return isAlt
        ? "bg-yellow-300/60 dark:bg-yellow-700/40"
        : "bg-yellow-200/60 dark:bg-yellow-600/40";
    }
    if (color === "green") {
      if (isInner)
        return isAlt
          ? "bg-emerald-900/80 dark:bg-emerald-950/90"
          : "bg-emerald-700/80 dark:bg-emerald-900/80";
      return isAlt
        ? "bg-emerald-300/60 dark:bg-emerald-800/40"
        : "bg-emerald-200/60 dark:bg-emerald-700/40";
    }
    if (isInner)
      return isAlt
        ? "bg-slate-800 dark:bg-slate-700"
        : "bg-slate-700 dark:bg-slate-600";
    return isAlt
      ? "bg-slate-300 dark:bg-slate-800"
      : "bg-slate-200 dark:bg-slate-700";
  };

  if (mode === "2p-ns") {
    if (r < 6) return getStyle("red");
    return getStyle("blue");
  }
  if (mode === "2p-ew") {
    if (c < 6) return getStyle("green");
    return getStyle("yellow");
  }

  if (mode === "2v2") {
    const isCenter = r >= 5 && r <= 6 && c >= 5 && c <= 6;
    const isCorner = (r === 0 || r === 11) && (c === 0 || c === 11);

    if (isCenter || isCorner) {
      return isAlt
        ? "bg-slate-900 dark:bg-black border-2 border-slate-700"
        : "bg-slate-200 dark:bg-slate-300 border-2 border-slate-400";
    }

    // Top border (Red + Yellow = Orange)
    if (r < 5 && (c === 5 || c === 6)) {
      return isAlt
        ? "bg-orange-600/80 dark:bg-orange-900/80"
        : "bg-orange-400/60 dark:bg-orange-700/60";
    }

    // Right border (Yellow + Green = Lime/Chartreuse)
    if (c > 6 && (r === 5 || r === 6)) {
      return isAlt
        ? "bg-lime-600/80 dark:bg-lime-900/80"
        : "bg-lime-400/60 dark:bg-lime-700/60";
    }

    // Bottom border (Green + Blue = Cyan/Teal)
    if (r > 6 && (c === 5 || c === 6)) {
      return isAlt
        ? "bg-cyan-600/80 dark:bg-cyan-900/80"
        : "bg-cyan-400/60 dark:bg-cyan-700/60";
    }

    // Left border (Blue + Red = Purple/Violet)
    if (c < 5 && (r === 5 || r === 6)) {
      return isAlt
        ? "bg-purple-600/80 dark:bg-purple-900/80"
        : "bg-purple-400/60 dark:bg-purple-700/60";
    }

    if (r < 6 && c < 6) return getStyle("red");
    if (r < 6 && c >= 6) return getStyle("yellow");
    if (r >= 6 && c < 6) return getStyle("green");
    return getStyle("blue");
  }

  if (mode === "4p") {
    if (r < 6 && c < 6) return getStyle("red");
    if (r < 6 && c >= 6) return getStyle("yellow");
    if (r >= 6 && c < 6) return getStyle("green");
    return getStyle("blue");
  }

  return getStyle("slate");
};
