import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Blocks,
  ChessKing,
  ChessPawn,
  ChessQueen,
  Earth,
  Tornado,
  VenetianMask,
} from "lucide-react";
import { useRouteContext } from "@context";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RoutePageFooter from "@/shared/components/organisms/RoutePageFooter";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";

export const LearnEndgameMainView: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useRouteContext();

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label="The Endgame split into 3 different ways to play"
        color="emerald"
        onBackClick={() => navigate("/learn")}
      />

      <RouteGrid cols={2}>
        {/* Capture the King */}
        <RouteCard
          Icon={Blocks}
          HoverIcon={ChessKing}
          title="Capture the King"
          description='"Some Shall Stay True to Checkmate of old."'
          className="h-full w-full"
          color="red"
          darkMode={darkMode}
          onClick={() => navigate("/learn/endgame/capture-the-king")}
          preview={{
            mode: null,
            hideUnits: true,
            highlightOuterSquares: true,
            label: "Capture the King",
          }}
        />
        {/* Capture the Mercenaries */}
        <RouteCard
          Icon={Blocks}
          HoverIcon={VenetianMask}
          title="Capture the Mercs"
          description='"Some shall sell their swords to the highest bidder."'
          className="h-full w-full"
          color="yellow"
          darkMode={darkMode}
          onClick={() => navigate("/learn/endgame/capture-the-mercenaries")}
          preview={{
            mode: "4p",
            hideUnits: true,
          }}
        />
        {/* Capture the Board */}
        <RouteCard
          Icon={Blocks}
          HoverIcon={ChessQueen}
          title="Capture the Army"
          description='"Others shall seek to control every last Army."'
          className="h-full w-full"
          color="emerald"
          darkMode={darkMode}
          onClick={() => navigate("/learn/endgame/capture-the-army")}
          preview={{
            mode: "4p",
            hideUnits: true,
          }}
        />
        {/* Capture the World */}
        <RouteCard
          Icon={Blocks}
          HoverIcon={Earth}
          title="Capture the World"
          description='"But most shall race as if to win the world."'
          className="h-full w-full"
          color="blue"
          darkMode={darkMode}
          onClick={() => navigate("/learn/endgame/capture-the-world")}
          preview={{
            mode: "2v2",
            hideUnits: true,
          }}
        />
      </RouteGrid>

      <RoutePageFooter
        onForwardClick={() =>
          navigate("/learn/chess", { state: { view: "chessmen" } })
        }
        forwardLabel="The Chessmen"
        forwardIcon={ChessPawn}
        onBackClick={() => navigate("/learn/trench")}
        backLabel="Open the Trench"
        backIcon={Tornado}
      />
    </RoutePageLayout>
  );
};

export default LearnEndgameMainView;
