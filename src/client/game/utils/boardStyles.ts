/**
 * boardStyles — Visual styling logic for the board quadrants and modes.
 */

type StyleConfig = {
  inner: [string, string]; // [normal, alt]
  outer: [string, string]; // [normal, alt]
};

const QUADRANT_COLORS: Record<string, StyleConfig> = {
  red: {
    inner: ["bg-red-700/80 dark:bg-red-900/80", "bg-red-900/80 dark:bg-red-950/90"],
    outer: ["bg-red-200/60 dark:bg-red-700/40", "bg-red-300/60 dark:bg-red-800/40"],
  },
  blue: {
    inner: ["bg-blue-700/80 dark:bg-blue-900/80", "bg-blue-900/80 dark:bg-blue-950/90"],
    outer: ["bg-blue-200/60 dark:bg-blue-700/40", "bg-blue-300/60 dark:bg-blue-800/40"],
  },
  yellow: {
    inner: ["bg-yellow-500/80 dark:bg-yellow-800/80", "bg-yellow-700/80 dark:bg-yellow-950/90"],
    outer: ["bg-yellow-200/60 dark:bg-yellow-600/40", "bg-yellow-300/60 dark:bg-yellow-700/40"],
  },
  green: {
    inner: ["bg-emerald-700/80 dark:bg-emerald-900/80", "bg-emerald-900/80 dark:bg-emerald-950/90"],
    outer: ["bg-emerald-200/60 dark:bg-emerald-700/40", "bg-emerald-300/60 dark:bg-emerald-800/40"],
  },
  slate: {
    inner: ["bg-slate-700 dark:bg-slate-600", "bg-slate-800 dark:bg-slate-700"],
    outer: ["bg-slate-200 dark:bg-slate-700", "bg-slate-300 dark:bg-slate-800"],
  },
};

const BORDER_STYLES = {
  orange: ["bg-orange-400/60 dark:bg-orange-700/60", "bg-orange-600/80 dark:bg-orange-900/80"],
  lime: ["bg-lime-400/60 dark:bg-lime-700/60", "bg-lime-600/80 dark:bg-lime-900/80"],
  cyan: ["bg-cyan-400/60 dark:bg-cyan-700/60", "bg-cyan-600/80 dark:bg-cyan-900/80"],
  purple: ["bg-purple-400/60 dark:bg-purple-700/60", "bg-purple-600/80 dark:bg-purple-900/80"],
};

export const getQuadrantBaseStyle = (r: number, c: number, mode: string): string => {
  const isAlt = (r + c) % 2 === 1;
  const isInner = r >= 2 && r <= 9 && c >= 2 && c <= 9;
  const altIndex = isAlt ? 1 : 0;

  const getStyle = (color: string) => {
    const config = QUADRANT_COLORS[color] || QUADRANT_COLORS.slate;
    return isInner ? config.inner[altIndex] : config.outer[altIndex];
  };

  if (mode === "2p-ns") return r < 6 ? getStyle("red") : getStyle("blue");
  if (mode === "2p-ew") return c < 6 ? getStyle("green") : getStyle("yellow");

  if (mode === "2v2") {
    const isCenter = r >= 5 && r <= 6 && c >= 5 && c <= 6;
    const isCorner = (r === 0 || r === 11) && (c === 0 || c === 11);

    if (isCenter || isCorner) {
      return isAlt
        ? "bg-slate-900 dark:bg-black border-2 border-slate-700"
        : "bg-slate-200 dark:bg-slate-300 border-2 border-slate-400";
    }

    if (r < 5 && (c === 5 || c === 6)) return BORDER_STYLES.orange[altIndex];
    if (c > 6 && (r === 5 || r === 6)) return BORDER_STYLES.lime[altIndex];
    if (r > 6 && (c === 5 || c === 6)) return BORDER_STYLES.cyan[altIndex];
    if (c < 5 && (r === 5 || r === 6)) return BORDER_STYLES.purple[altIndex];

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
