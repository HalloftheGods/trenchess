import React from "react";
import { useNavigate } from "react-router-dom";
import { ChessKing, ChessQueen, ChessRook, Earth, Swords } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import ForwardButton from "../ui/ForwardButton";
import { useMenuContext } from "./MenuContext";
import { Route } from "lucide-react";

const MenuEndgame: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative w-full max-w-7xl mb-12">
        <SectionDivider
          label="The Endgame split into 3 different win conditions"
          color="emerald"
        />
        <BackButton
          onClick={() => navigate("/learn")}
          className="absolute left-0 -top-8"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        {/* Capture the King */}
        <MenuCard
          onClick={() => {
            navigate("/learn/endgame/capture-the-king");
          }}
          onMouseEnter={() => {
            setHoveredMenu("ctk");
          }}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: null,
            hideUnits: true,
            highlightOuterSquares: true,
            label: "Capture the King",
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Capture the King"
          description="&quot;Some Shall Stay True to 'Checkmate' of old.&quot;"
          Icon={ChessKing}
          color="red"
          className="h-full w-full"
        />
        {/* Capture the Board */}
        <MenuCard
          onClick={() => {
            navigate("/learn/endgame/capture-the-army");
          }}
          onMouseEnter={() => setHoveredMenu("ctboard")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "4p",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Capture the Army"
          description='"Others shall seek to control every last Army."'
          Icon={ChessQueen}
          color="blue"
          className="h-full w-full"
        />
        {/* Capture the World */}
        <MenuCard
          onClick={() => {
            navigate("/learn/endgame/capture-the-world");
          }}
          onMouseEnter={() => setHoveredMenu("ctf")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2v2",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Capture the World"
          description='"But most shall race as if to win the world."'
          Icon={Earth}
          color="emerald"
          className="h-full w-full"
        />
      </div>

      <div className="relative w-full max-w-7xl mt-6 space-y-2">
        <SectionDivider label="" />
        <ForwardButton
          onClick={() =>
            navigate("/learn/chess", { state: { view: "chessmen" } })
          }
          label="The Chessmen"
          className="float-right"
          Icon={ChessRook}
        />
      </div>
    </div>
  );
};

export default MenuEndgame;
