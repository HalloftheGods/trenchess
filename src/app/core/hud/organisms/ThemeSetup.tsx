import { ThemeSelection } from "../molecules";
import type { PieceStyle } from "@constants";

interface ThemeSetupProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
}

export const ThemeSetup: React.FC<ThemeSetupProps> = ({
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
}) => {
  return (
    <ThemeSelection
      darkMode={darkMode}
      pieceStyle={pieceStyle}
      toggleTheme={toggleTheme}
      togglePieceStyle={togglePieceStyle}
    />
  );
};
