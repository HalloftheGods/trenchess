import { Trophy } from "lucide-react";
import { PLAYER_CONFIGS } from "../../constants";

interface VictoryOverlayProps {
  winner: string;
  getPlayerDisplayName: (pid: string) => string;
  setGameState: (state: "menu") => void;
}

const VictoryOverlay: React.FC<VictoryOverlayProps> = ({
  winner,
  getPlayerDisplayName,
  setGameState,
}) => (
  <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl rounded-2xl">
    <div className="text-center p-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[5rem]">
      <Trophy size={100} className="mx-auto text-yellow-500 mb-8" />
      <h2
        className={`text-8xl font-black mb-4 tracking-tighter uppercase leading-none ${PLAYER_CONFIGS[winner].text}`}
      >
        {getPlayerDisplayName(winner)}
        <br />
        DOMINANT
      </h2>
      <button
        onClick={() => setGameState("menu")}
        className="px-16 py-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl font-black text-3xl hover:scale-105 transition-all mt-10"
      >
        MAIN MENU
      </button>
    </div>
  </div>
);

export default VictoryOverlay;
