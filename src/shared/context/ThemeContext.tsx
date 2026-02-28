import React, { createContext, useContext, useState, useEffect } from "react";
import { PIECE_STYLES } from "@constants";
import type { GameTheme, PieceStyle, ArmyUnit, IconProps } from "@tc.types";

const ThemeContext = createContext<GameTheme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
    props?: IconProps | string,
    size?: number | string,
    filled?: boolean,
  ): React.ReactNode => {
    const isPropsObject = props !== null && typeof props === "object";
    const className = isPropsObject
      ? props.className
      : (props as string | undefined);
    const finalSize = isPropsObject ? props.size : size;
    const isFilled = isPropsObject ? props.filled : filled || false;
    const color = isPropsObject ? props.color : undefined;

    const isComponentStyle = pieceStyle === "custom" || pieceStyle === "lucide";
    const IconComponent =
      pieceStyle === "custom"
        ? unit.custom
        : (unit.lucide as React.ElementType);

    const baseStyles = `${className || ""} inline-flex items-center justify-center transition-all duration-700`;
    const iconSize = finalSize || "100%";

    if (isComponentStyle) {
      return (
        <span
          className={baseStyles}
          style={{ width: iconSize, height: iconSize, color }}
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
        style={{ fontSize: iconSize, width: iconSize, height: iconSize, color }}
      >
        {unit[pieceStyle as "emoji" | "bold" | "outlined"]}
      </span>
    );
  };

  const themeValue: GameTheme = {
    darkMode,
    pieceStyle,
    toggleTheme,
    togglePieceStyle,
    getIcon,
  };

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
