// Theme controls component
import { Sun, Moon, ChessKnight, Calculator } from "lucide-react";
import { BattleKnightIcon } from "../UnitIcons";
import type { PieceStyle } from "../constants";
import { IconButton } from "./ui/IconButton";

interface ThemeControlsProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  onTutorial?: () => void;
  className?: string;
}

const ThemeControls: React.FC<ThemeControlsProps> = ({
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onTutorial,
  className = "",
}) => (
  <div
    className={`fixed top-6 right-6 z-50 flex items-center gap-2 ${className}`}
  >
    {onTutorial && (
      <IconButton
        icon={<Calculator size={20} />}
        label="Interactive Guide"
        onClick={onTutorial}
      />
    )}
    <IconButton
      onClick={togglePieceStyle}
      icon={
        pieceStyle === "emoji" ? (
          <span className="text-xl">🏇</span>
        ) : pieceStyle === "bold" ? (
          <span className="text-xl">♞︎</span>
        ) : pieceStyle === "outlined" ? (
          <span className="text-xl">♘︎</span>
        ) : pieceStyle === "custom" ? (
          <BattleKnightIcon className="w-6 h-6" />
        ) : (
          <ChessKnight className="w-6 h-6" />
        )
      }
      label={`Piece Style: ${pieceStyle}`}
    />
    <IconButton
      onClick={toggleTheme}
      icon={
        darkMode ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-slate-600" />
        )
      }
      label={darkMode ? "Light Mode" : "Dark Mode"}
    />
  </div>
);

export default ThemeControls;
