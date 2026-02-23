import { Trophy } from "lucide-react";
import { PLAYER_CONFIGS } from "@/core/constants/unit.constants";

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
  <div className="overlay-backdrop">
    <div className="modal-container">
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
        className="btn-primary-lg mt-10"
      >
        MAIN MENU
      </button>
    </div>
  </div>
);

export default VictoryOverlay;
