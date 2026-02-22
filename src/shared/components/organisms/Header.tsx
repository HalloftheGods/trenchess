import { BookOpen, Database } from "lucide-react";
import type { GameMode } from "@engineTypes/game";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { SegmentedControl } from "@/shared/components/molecules/SegmentedControl";
import { PlayerBadge } from "@/app/routes/game/components/atoms/PlayerBadge";
import { PLAYER_CONFIGS } from "@constants/unit.constants";
import GameLogo from "@/shared/components/molecules/GameLogo";
import ThemeControls from "@/shared/components/molecules/ThemeControls";
import type { PieceStyle } from "@constants/unit.constants";

interface HeaderProps {
  onMenuClick: () => void;
  onHowToPlayClick: () => void;
  onLibraryClick: () => void;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  gameState: string;
  gameMode: GameMode;
  turn: string;
  activePlayers: string[];
  // getPlayerDisplayName: (id: string) => string; // unused
  children?: React.ReactNode; // For extra header content like Zen Garden inputs
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  onZenGarden?: () => void;
}

const Header = ({
  onMenuClick,
  onHowToPlayClick,
  onLibraryClick,
  isFlipped,
  setIsFlipped,
  gameState,
  turn,
  activePlayers,
  // getPlayerDisplayName,
  children,
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onZenGarden,
}: HeaderProps) => {
  return (
    <div className="w-full max-w-[1600px] grid grid-cols-1 xl:grid-cols-3 items-center mb-8 gap-6 relative z-20">
      {/* Left Section: Logo & Navigation */}
      <div className="flex items-center gap-4 justify-center xl:justify-start">
        <div
          className="flex items-center gap-5 cursor-pointer"
          onClick={onMenuClick}
        >
          <GameLogo size="small" />
        </div>

        <IconButton
          icon={<BookOpen size={20} />}
          label="Field Manual"
          onClick={onHowToPlayClick}
        />

        <IconButton
          icon={<Database size={20} />}
          label="Seed Library"
          onClick={onLibraryClick}
        />
      </div>

      {/* Center Section: Board Controls */}
      <div className="flex flex-col items-center justify-center gap-3">
        <SegmentedControl
          value={isFlipped}
          onChange={setIsFlipped}
          options={[
            {
              label: "North",
              value: false,
              activeColor: "bg-red-600",
            },
            {
              label: "South",
              value: true,
              activeColor: "bg-blue-600",
            },
          ]}
        />
        {children}
      </div>

      {/* Right Section: Player Status & Theme */}
      <div className="flex items-center justify-center xl:justify-end gap-3">
        <ThemeControls
          darkMode={darkMode}
          pieceStyle={pieceStyle}
          toggleTheme={toggleTheme}
          togglePieceStyle={togglePieceStyle}
          onZenGarden={onZenGarden}
        />

        {/* Helper function to check if we should show player badges */}
        {gameState !== "menu" && (
          <div className="flex flex-wrap justify-center gap-3 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 p-2 rounded-3xl shadow-2xl">
            {activePlayers.map((pid) => (
              <PlayerBadge
                key={pid}
                // player={pid}
                config={PLAYER_CONFIGS[pid]}
                isActive={turn === pid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
