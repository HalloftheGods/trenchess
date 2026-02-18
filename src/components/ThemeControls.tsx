// Theme controls component
import { Sun, Moon, ChessKnight } from "lucide-react";
import { BattleKnightIcon } from "../UnitIcons";
import type { PieceStyle } from "../constants";

interface ThemeControlsProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  className?: string;
}

const ThemeControls: React.FC<ThemeControlsProps> = ({
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  className = "",
}) => (
  <div
    className={`fixed top-6 right-6 z-50 flex items-center gap-2 ${className}`}
  >
    <button
      onClick={togglePieceStyle}
      className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg hover:scale-110 transition-all text-lg"
      aria-label="Toggle piece style"
      title={`Current style: ${pieceStyle}. Click to switch.`}
    >
      {pieceStyle === "emoji" ? (
        "🏇"
      ) : pieceStyle === "bold" ? (
        "♞︎"
      ) : pieceStyle === "outlined" ? (
        "♘︎"
      ) : pieceStyle === "custom" ? (
        <BattleKnightIcon className="w-6 h-6" />
      ) : (
        <ChessKnight className="w-6 h-6" />
      )}
    </button>
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg hover:scale-110 transition-all"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-slate-600" />
      )}
    </button>
  </div>
);

export default ThemeControls;
