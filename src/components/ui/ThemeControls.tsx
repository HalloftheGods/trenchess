// Theme controls component
import { Sun, Moon, ChessKnight, Shell, Trophy } from "lucide-react";
import { BattleKnightIcon } from "../../UnitIcons";
import type { PieceStyle } from "../../constants";
import { IconButton } from "./IconButton";
import { useNavigate } from "react-router-dom";

interface ThemeControlsProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  onTutorial?: () => void;
  onZenGarden?: () => void;
  className?: string;
}

const ThemeControls: React.FC<ThemeControlsProps> = ({
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onZenGarden,
  className = "",
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-2 ${className}`}
    >
      {onZenGarden && (
        <IconButton
          icon={<Shell size={20} className="text-emerald-500" />}
          label="Zen Garden Editor"
          onClick={onZenGarden}
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
      <IconButton
        onClick={() => navigate("/scoreboard")}
        icon={<Trophy size={20} className="text-amber-500" />}
        label="Scoreboard"
      />
    </div>
  );
};

export default ThemeControls;
