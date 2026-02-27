import React from "react";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import { TCText } from "@/shared/components/atoms/ui/TCTypography";
import ThemeControls from "@/shared/components/molecules/ThemeControls";
import type { PieceStyle } from "@constants";

interface ConsoleThemeMoleculeProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
}

export const ConsoleThemeMolecule: React.FC<ConsoleThemeMoleculeProps> = ({
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
}) => {
  return (
    <TCFlex direction="col" align="center" gap={1}>
      <ThemeControls
        darkMode={darkMode}
        pieceStyle={pieceStyle}
        toggleTheme={toggleTheme}
        togglePieceStyle={togglePieceStyle}
      />
      <TCText
        variant="muted"
        className="text-[9px] font-black uppercase tracking-[0.25em] opacity-40 mt-1"
      >
        Theme
      </TCText>
    </TCFlex>
  );
};
