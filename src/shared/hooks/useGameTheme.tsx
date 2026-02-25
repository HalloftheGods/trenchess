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

  const getIcon: GameTheme["getIcon"] = (
    unit: ArmyUnit,
    className?: string,
    size?: number | string,
    filled?: boolean,
  ): React.ReactNode => {
    const isComponentStyle = pieceStyle === "custom" || pieceStyle === "lucide";
    const IconComponent =
      pieceStyle === "custom"
        ? unit.custom
        : (unit.lucide as React.ElementType);

    const baseStyles = `${className || ""} inline-flex items-center justify-center transition-all duration-700`;
    const iconSize = size || "100%";
    const isFilled = filled || false;

    if (isComponentStyle) {
      return (
        <span
          className={baseStyles}
          style={{ width: iconSize, height: iconSize }}
        >
          <IconComponent
            size="100%"
            className={isFilled ? "fill-current" : ""}
          />
        </span>
      );
    }

    return (
      <span
        className={baseStyles}
        style={{ fontSize: iconSize as any, width: iconSize, height: iconSize }}
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
