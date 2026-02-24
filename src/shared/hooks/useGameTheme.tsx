import { useState, useEffect } from "react";
import { PIECE_STYLES } from "@/constants";
import type { GameTheme, PieceStyle, ArmyUnit } from "@/shared/types";

export function useGameTheme(): GameTheme {
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

  const getIcon = (
    unit: ArmyUnit,
    className = "",
    size: number | string = "100%",
    filled = false,
  ) => {
    const isComponentStyle = pieceStyle === "custom" || pieceStyle === "lucide";
    const IconComponent =
      pieceStyle === "custom" ? unit.custom : (unit.lucide as React.ElementType);

    const baseStyles = `${className} inline-flex items-center justify-center transition-all duration-700`;

    if (isComponentStyle) {
      return (
        <span
          className={baseStyles}
          style={{ width: size, height: size }}
        >
          <IconComponent
            size="100%"
            className={filled ? "fill-current" : ""}
          />
        </span>
      );
    }

    return (
      <span
        className={baseStyles}
        style={{ fontSize: size, width: size, height: size }}
      >
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
