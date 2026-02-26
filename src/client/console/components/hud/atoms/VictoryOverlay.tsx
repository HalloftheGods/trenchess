import React from "react";
import { Trophy, Skull, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PLAYER_CONFIGS, UNIT_POINTS } from "@constants";
import { ROUTES } from "@constants/routes";
import { FinalBoardPreview } from "../../board/molecules/FinalBoardPreview";
import {
  TCOverlay,
  TCCard,
  TCButton,
  TCHeading,
  TCText,
} from "@/shared/components/atoms/ui";
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
  const borderClass = `border-${winnerTheme.color}`;

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
    navigate(ROUTES.HOME.path);
  };

  return (
    <TCOverlay blur="xl" opacity="heavy">
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch max-w-[95vw] lg:max-w-[1200px] w-full animate-in zoom-in-95 duration-1000">
        {/* Main Victory Card */}
        <TCCard
          padding="none"
          className={`relative overflow-visible border-4 ${borderClass} shadow-2xl flex-1 min-h-[600px] flex flex-col items-center justify-center`}
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

          <TCText
            variant="muted"
            className="font-black tracking-[0.5em] uppercase mb-4"
          >
            {reasonText}
          </TCText>

          <TCHeading
            level={1}
            variant="plain"
            className={`text-7xl lg:text-9xl mb-2 tracking-tighter uppercase leading-none ${statusColor}`}
          >
            {isWinner ? "VICTORY" : "DEFEAT"}
          </TCHeading>

          <div className="flex flex-col items-center gap-1 mb-10 text-center px-10">
            <TCText
              variant="small"
              className="font-black uppercase tracking-[0.3em]"
            >
              {isWinner ? "The World is Yours" : "Your Forces Have Fallen"}
            </TCText>
            <div className="h-px w-12 bg-white/10 my-4" />
            <TCText
              variant="lead"
              className={`font-black uppercase tracking-widest ${winnerTheme.text}`}
            >
              {getPlayerDisplayName(winner)} Dominant
            </TCText>
          </div>

          <TCButton
            variant={isWinner ? "brand" : "secondary"}
            size="xl"
            onClick={handleReturn}
            leftIcon={<Home size={20} />}
            className="px-12"
          >
            RETURN TO COMMAND
          </TCButton>
        </TCCard>

        {/* Board Preview: Off to the right */}
        {board && terrain && mode && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-right-12 duration-1000 delay-300">
            <div className="flex items-center gap-3 px-6 py-2 bg-slate-950/50 backdrop-blur-md border border-white/5 rounded-full w-fit">
              <div
                className={`w-2 h-2 rounded-full ${winnerTheme.bg} animate-pulse`}
              />
              <TCText
                variant="small"
                className="font-black uppercase tracking-[0.2em]"
              >
                Final Deployment State
              </TCText>
            </div>
            <FinalBoardPreview board={board} terrain={terrain} mode={mode} />
          </div>
        )}
      </div>
    </TCOverlay>
  );
};

export default VictoryOverlay;
