import { Trophy } from "lucide-react";
import { PLAYER_CONFIGS } from "@/constants";

interface VictoryOverlayProps {
  winner: string;
  reason?: string;
  getPlayerDisplayName: (pid: string) => string;
  setGameState: (state: "menu") => void;
}

const VictoryOverlay: React.FC<VictoryOverlayProps> = ({
  winner,
  reason,
  getPlayerDisplayName,
  setGameState,
}) => {
  const reasonText = reason === "forfeit" ? "CONCEDED" : "CHECKMATE";

  return (
    <div className="overlay-backdrop">
      <div className="modal-container">
        <Trophy size={100} className="mx-auto text-yellow-500 mb-8" />
        <p className="text-slate-500 font-bold tracking-[0.4em] uppercase mb-2">
          {reasonText}
        </p>
        <h2
          className={`text-8xl font-black mb-4 tracking-tighter uppercase leading-none ${PLAYER_CONFIGS[winner].text}`}
        >
          {getPlayerDisplayName(winner)}
          <br />
          DOMINANT
        </h2>
        <button onClick={() => setGameState("menu")} className="btn-hero mt-10">
          MAIN MENU
        </button>
      </div>
    </div>
  );
};

export default VictoryOverlay;
