import React from "react";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import { TCText } from "@/shared/components/atoms/ui/TCTypography";
import ThemeControls from "@/shared/components/molecules/ThemeControls";
import type { PieceStyle } from "@constants";

interface ConsoleThemeOrganismProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
}

export const ConsoleThemeOrganism: React.FC<ConsoleThemeOrganismProps> = ({
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
        className="text-[10px] font-black uppercase tracking-[0.2em]"
      >
        Theme
      </TCText>
    </TCFlex>
  );
};
