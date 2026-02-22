import React, { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { ChessKing, ChessQueen, ChessRook, Earth } from "lucide-react";
import { useMenuContext } from "@/app/context/MenuContext";

// Atomic Components
import MenuPageLayout from "@/app/routes/menu/components/templates/MenuPageLayout";
import MenuPageHeader from "@/app/routes/menu/components/organisms/MenuPageHeader";
import MenuPageFooter from "@/app/routes/menu/components/organisms/MenuPageFooter";
import MenuGrid from "@/app/routes/menu/components/templates/MenuGrid";
import MenuCard from "@/app/routes/menu/components/molecules/MenuCard";

const MenuEndgame: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useMenuContext();

  return (
    <MenuPageLayout>
      <MenuPageHeader
        label="The Endgame split into 3 different win conditions"
        color="emerald"
        onBackClick={() => navigate("/learn")}
      />

      <MenuGrid cols={3}>
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
      </MenuGrid>

      <MenuPageFooter
        onForwardClick={() =>
          navigate("/learn/chess", { state: { view: "chessmen" } })
        }
        forwardLabel="The Chessmen"
        forwardIcon={ChessRook}
      />
    </MenuPageLayout>
  );
};

export default MenuEndgame;
export const LazyMenuEndgame = lazy(() => import("./MenuEndgame"));
