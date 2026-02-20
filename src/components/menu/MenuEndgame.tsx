import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChessKing, ChessQueen, Earth } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";

const MenuEndgame: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useMenuContext();

  const ctkPreviewMode = useMemo(
    () => (Math.random() > 0.5 ? ("2p-ns" as const) : ("2p-ew" as const)),
    [],
  );

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
            mode: ctkPreviewMode,
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Capture the King"
          description="Some Shall Stay True to 'Checkmate' of old."
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
          description="Others shall seek to control every last Army."
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
          description="But most shall race as if to win the world."
          Icon={Earth}
          color="emerald"
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuEndgame;
