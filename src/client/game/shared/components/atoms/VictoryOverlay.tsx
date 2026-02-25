import { Trophy, Skull } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLAYER_CONFIGS, UNIT_POINTS } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { FinalBoardPreview } from "../molecules/FinalBoardPreview";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types/game";

interface VictoryOverlayProps {
  winner: string;
  reason?: string;
  localPlayerName?: string;
  board?: (BoardPiece | null)[][];
  terrain?: TerrainType[][];
  mode?: GameMode;
  getPlayerDisplayName: (pid: string) => string;
  setGameState: (state: "menu") => void;
}

const VictoryOverlay: React.FC<VictoryOverlayProps> = ({
  winner,
  reason,
  localPlayerName,
  board,
  terrain,
  mode,
  getPlayerDisplayName,
  setGameState,
}) => {
  const navigate = useNavigate();
  const isWinner = localPlayerName === winner;
  const reasonText = reason === "forfeit" ? "CONCEDED" : "CHECKMATE";

  const winnerSide = winner === "red" || winner === "yellow" ? "left" : "right";

  const localTheme = localPlayerName
    ? PLAYER_CONFIGS[localPlayerName]
    : PLAYER_CONFIGS[winner];
  const winnerTheme = PLAYER_CONFIGS[winner];

  const statusColor = isWinner ? winnerTheme.text : localTheme.text;
  const borderClass = `border-${localTheme.color}`;
  const shadowClass = localTheme.shadow;

  const score =
    board?.reduce(
      (total, row) =>
        total +
        row.reduce(
          (rowTotal, piece) =>
            rowTotal +
            (piece?.player === winner ? UNIT_POINTS[piece.type] || 0 : 0),
          0,
        ),
      0,
    ) || 0;

  const handleReturn = () => {
    setGameState("menu");
    navigate(ROUTES.HOME);
  };

  return (
    <div className="overlay-backdrop">
      <div
        className={`relative flex flex-col lg:flex-row gap-8 items-center lg:items-stretch max-w-[95vw] lg:max-w-[1200px] w-full animate-in zoom-in-95 duration-1000`}
      >
        {/* Main Victory Card */}
        <div
          className={`modal-container relative overflow-visible border-4 ${borderClass} ${shadowClass} shadow-2xl flex-1 min-h-[600px] flex flex-col items-center justify-center p-12 lg:p-24`}
        >
          {/* Winner Name: Diagonal Corner Ribbon */}
          <div
            className={`
              ${winnerSide === "left" ? "ribbon-left" : "ribbon-right"} 
              ${winnerTheme.bg} z-30 text-white font-black uppercase tracking-[0.1em] shadow-xl text-lg
            `}
          >
            {getPlayerDisplayName(winner)}
          </div>

          {/* Score: Vertical Pennant Ribbon */}
          <div
            className={`
              ${winnerSide === "left" ? "ribbon-pennant-right" : "ribbon-pennant-left"} 
              ${winnerTheme.bg} z-30 text-white font-black flex flex-col items-center shadow-xl justify-start pt-4
            `}
          >
            <span className="text-3xl tracking-tighter leading-none">
              {score}
            </span>
          </div>

          <div className="relative mb-8 mt-4">
            {isWinner ? (
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-yellow-500/20 animate-pulse rounded-full" />
                <Trophy
                  size={140}
                  className="mx-auto text-yellow-500 relative z-10 animate-bounce"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-brand-red/20 animate-pulse rounded-full" />
                <Skull
                  size={140}
                  className="mx-auto text-slate-400 relative z-10"
                />
              </div>
            )}
          </div>

          <p className="text-slate-500 font-black tracking-[0.5em] uppercase mb-4 text-xs">
            {reasonText}
          </p>

          <h2
            className={`text-7xl lg:text-9xl font-black mb-2 tracking-tighter uppercase leading-none ${statusColor}`}
          >
            {isWinner ? "VICTORY" : "DEFEAT"}
          </h2>

          <div className="flex flex-col items-center gap-1 mb-10 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              {isWinner ? "The World is Yours" : "Your Forces Have Fallen"}
            </span>
            <div className="h-px w-12 bg-slate-800 my-2" />
            <span
              className={`text-xl font-black uppercase tracking-widest ${winnerTheme.text}`}
            >
              {getPlayerDisplayName(winner)} Dominant
            </span>
          </div>

          <button
            onClick={handleReturn}
            className={`btn-hero px-12 py-4 text-lg ${isWinner ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" : "bg-slate-800 hover:bg-slate-700 shadow-slate-900/20"}`}
          >
            RETURN TO COMMAND
          </button>
        </div>

        {/* Board Preview: Off to the right */}
        {board && terrain && mode && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-right-12 duration-1000 delay-300">
            <div className="flex items-center gap-3 px-6 py-2 bg-slate-950/50 backdrop-blur-md border border-white/5 rounded-full w-fit">
              <div
                className={`w-2 h-2 rounded-full ${winnerTheme.bg} animate-pulse`}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Final Deployment State
              </span>
            </div>
            <FinalBoardPreview board={board} terrain={terrain} mode={mode} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VictoryOverlay;
