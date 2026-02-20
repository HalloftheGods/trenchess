import { useState, useEffect } from "react";
import { PIECE_STYLES, type PieceStyle } from "../constants";
import type { ArmyUnit } from "../types/game";

export function useGameTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("battle-chess-theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const [pieceStyle, setPieceStyle] = useState<PieceStyle>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("battle-chess-piece-style") as PieceStyle) ||
        "lucide"
      );
    }
    return "lucide";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("battle-chess-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const togglePieceStyle = () => {
    setPieceStyle((prev) => {
      const idx = PIECE_STYLES.indexOf(prev);
      const next = PIECE_STYLES[(idx + 1) % PIECE_STYLES.length];
      localStorage.setItem("battle-chess-piece-style", next);
      return next;
    });
  };

  const getIcon = (unit: ArmyUnit, className = "") => {
    if (pieceStyle === "custom") {
      const Icon = unit.custom;
      return <Icon className={className} />;
    }
    if (pieceStyle === "lucide") {
      const Icon = unit.lucide;
      return <Icon className={className} />;
    }
    return (
      <span className={className}>
        {unit[pieceStyle as "emoji" | "bold" | "outlined"]}
      </span>
    );
  };

  return {
    darkMode,
    pieceStyle,
    toggleTheme,
    togglePieceStyle,
    getIcon,
  };
}
