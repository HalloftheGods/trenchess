// Theme controls component
import { Sun, Moon, ChessKnight, Shell } from "lucide-react";
import { BattleKnightIcon } from "@/client/game/components/atoms/UnitIcons";
import type { PieceStyle } from "@/client/game/theme";
import { IconButton } from "@/shared/components/atoms/IconButton";
interface ThemeControlsProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
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
  return (
    <div className={`flex items-center gap-2 ${className}`}>
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
    </div>
  );
};

export default ThemeControls;
