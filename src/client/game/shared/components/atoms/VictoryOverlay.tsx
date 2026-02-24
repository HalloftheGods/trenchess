import { Trophy, Skull } from "lucide-react";
import { PLAYER_CONFIGS, UNIT_POINTS } from "@/constants";

interface VictoryOverlayProps {
  winner: string;
  reason?: string;
  localPlayerName?: string;
  board?: (any | null)[][];
  getPlayerDisplayName: (pid: string) => string;
  setGameState: (state: "menu") => void;
}

const VictoryOverlay: React.FC<VictoryOverlayProps> = ({
  winner,
  reason,
  localPlayerName,
  board,
  getPlayerDisplayName,
  setGameState,
}) => {
  const isWinner = localPlayerName === winner;
  const reasonText = reason === "forfeit" ? "CONCEDED" : "CHECKMATE";

  // Determine which side the winner belongs to (for ribbon positioning)
  // N (Red), W (Yellow) -> Left
  // E (Green), S (Blue) -> Right
  const winnerSide = (winner === "red" || winner === "yellow") ? "left" : "right";
  
  // Theme color based on LOCAL player (the one viewing)
  const localTheme = localPlayerName ? PLAYER_CONFIGS[localPlayerName] : PLAYER_CONFIGS[winner];
  const winnerTheme = PLAYER_CONFIGS[winner];
  
  const statusColor = isWinner ? winnerTheme.text : localTheme.text;
  const borderClass = `border-${localTheme.color}`;
  const shadowClass = localTheme.shadow;

  // Calculate score based on remaining material for the winner
  const score = board?.reduce((total, row) => 
    total + row.reduce((rowTotal, piece) => 
      rowTotal + (piece?.player === winner ? (UNIT_POINTS[piece.type] || 0) : 0), 0
    ), 0
  ) || 0;

  return (
    <div className="overlay-backdrop">
      <div className={`modal-container relative overflow-visible border-4 ${borderClass} ${shadowClass} shadow-2xl transition-all duration-1000 animate-in zoom-in-95`}>
        
        {/* Winner Name: Diagonal Corner Ribbon on their "home" side */}
        <div 
          className={`
            ${winnerSide === 'left' ? 'ribbon-left' : 'ribbon-right'} 
            ${winnerTheme.bg} z-30 text-white font-black uppercase tracking-[0.1em] shadow-xl text-lg
          `}
        >
          {getPlayerDisplayName(winner)}
        </div>

        {/* Score: Vertical Pennant Ribbon on the opposite side */}
        <div 
          className={`
            ${winnerSide === 'left' ? 'ribbon-pennant-right' : 'ribbon-pennant-left'} 
            ${winnerTheme.bg} z-30 text-white font-black italic flex flex-col items-center shadow-xl justify-center
          `}
        >
          <span className="text-3xl leading-none">{score}</span>
        </div>

        <div className="relative mb-8 mt-4">
          {isWinner ? (
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-yellow-500/20 animate-pulse rounded-full" />
              <Trophy size={120} className="mx-auto text-yellow-500 relative z-10 animate-bounce" />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-brand-red/20 animate-pulse rounded-full" />
              <Skull size={120} className="mx-auto text-slate-400 relative z-10" />
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

        <div className="flex flex-col items-center gap-1 mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            {isWinner ? "The World is Yours" : "Your Forces Have Fallen"}
          </span>
          <div className="h-px w-12 bg-slate-800 my-2" />
          <span className={`text-xl font-black uppercase tracking-widest ${winnerTheme.text}`}>
            {getPlayerDisplayName(winner)} Dominant
          </span>
        </div>

        <button 
          onClick={() => setGameState("menu")} 
          className={`btn-hero px-12 py-4 text-lg ${isWinner ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          RETURN TO COMMAND
        </button>
      </div>
    </div>
  );
};

export default VictoryOverlay;
