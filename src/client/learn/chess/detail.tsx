import React, { useMemo, useState } from "react";

import InteractiveGuide, {
  type Slide,
} from "@/shared/components/templates/InteractiveGuide";
import { PIECES, INITIAL_ARMY } from "@constants";
import { UNIT_DETAILS, unitColorMap } from "@constants";
import { useRouteContext } from "@context";
import type {
  PieceType,
  TerrainType,
  ArmyUnit,
  PreviewConfig,
} from "@/shared/types/game";
// Shared Route Components
import { TerrainIconBadge } from "@/shared/components/atoms/TerrainIconBadge";
import { UnitMovePreview } from "@/shared/components/molecules/UnitMovePreview";
import { MoveLegend } from "@/shared/components/molecules/MoveLegend";
import { MathOperator } from "@/shared/components/atoms/MathOperator";

interface ChessGuideProps {
  onBack: () => void;
  initialUnit?: string;
}

export const LearnChessDetailView: React.FC<ChessGuideProps> = ({
  onBack,
  initialUnit,
}) => {
  const { getIcon } = useRouteContext();
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>(null);

  const slides: Slide[] = useMemo(() => {
    const UNIT_ORDER: PieceType[] = (
      initialUnit
        ? [
            initialUnit,
            ...[
              PIECES.PAWN,
              PIECES.KNIGHT,
              PIECES.BISHOP,
              PIECES.ROOK,
              PIECES.QUEEN,
              PIECES.KING,
            ].filter((u: string) => u !== initialUnit),
          ]
        : [
            PIECES.PAWN,
            PIECES.KNIGHT,
            PIECES.BISHOP,
            PIECES.ROOK,
            PIECES.QUEEN,
            PIECES.KING,
          ]
    ) as PieceType[];

    return UNIT_ORDER.map((type: PieceType) => {
      const unit = INITIAL_ARMY.find((u: ArmyUnit) => u.type === type);
      const details = UNIT_DETAILS[type];

      if (!unit || !details) return null;

      const colors = unitColorMap[unit.type];

      // Extract base color from the text class (e.g., "text-slate-500" or "text-brand-red" -> "red")
      const colorMatch = colors.text.match(/text-(?:brand-)?([a-z]+)/);
      const colorName = colorMatch ? colorMatch[1] : "slate";
      // Ensure it's one of the valid color strings
      const validColors = [
        "red",
        "blue",
        "emerald",
        "amber",
        "slate",
        "indigo",
        "purple",
        "orange",
      ];
      const finalColor = validColors.includes(colorName) ? colorName : "slate";

      const getClassicMoveName = (ptype: string) => {
        switch (ptype) {
          case PIECES.KING:
            return "The 1 OrthogDiagonal Step";
          case PIECES.QUEEN:
            return "The ∞ Orthogonal & Diagonal";
          case PIECES.ROOK:
            return "The ∞ Orthogonal";
          case PIECES.BISHOP:
            return "The ∞ Diagonal";
          case PIECES.KNIGHT:
            return "The L-Shape Trot";
          case PIECES.PAWN:
            return "The Forward March";
          default:
            return "Standard Move";
        }
      };

      const getThemedMoveName = (ptype: string) => {
        switch (ptype) {
          case PIECES.KING:
            return "The Footsoldier Footstool";
          case PIECES.QUEEN:
            return "The 8 Legged Gallop";
          case PIECES.ROOK:
            return 'The "Four-Corners" Fortnight';
          case PIECES.BISHOP:
            return "The Leap of Faith";
          case PIECES.KNIGHT:
            return 'The "Triple-Bar" Jump';
          case PIECES.PAWN:
            return 'The "Double-back" Flip';
          default:
            return details.title;
        }
      };

      return {
        id: unit.type,
        title: details.title,
        subtitle: details.subtitle,
        color: finalColor as Slide["color"],
        topLabel: details.role,
        icon: getIcon(unit, "", 48),
        previewConfig: {
          mode: "2p-ns",
          protocol: "classic",
          showIcons: false,
          hideUnits: false,
        } as PreviewConfig,
        leftContent: details.levelUp?.sanctuaryTerrain ? (
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              {details.levelUp.sanctuaryTerrain.map(
                (key: TerrainType, idx: number) => (
                  <TerrainIconBadge
                    key={idx}
                    terrainKey={key}
                    active={selectedTerrain === key}
                    onClick={() =>
                      setSelectedTerrain((prev) =>
                        prev === key ? null : (key as string),
                      )
                    }
                  />
                ),
              )}
            </div>
          </div>
        ) : null,
        sideContent: (
          <div className="flex flex-col items-center gap-10 w-full max-w-5xl">
            <div className="flex flex-row items-center justify-center gap-2 w-full overflow-x-auto pb-4 scrollbar-hide">
              {/* Classic Move */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <UnitMovePreview
                  unitType={unit.type}
                  mode="classic"
                  selectedTerrain={selectedTerrain}
                  className=""
                />
                <div className="text-emerald-600 dark:text-emerald-500 text-center font-bold text-[9px] tracking-widest uppercase w-full">
                  {getClassicMoveName(unit.type)}
                </div>
              </div>

              <MathOperator operator="+" />

              {/* Themed Move */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <UnitMovePreview
                  unitType={unit.type}
                  mode="new"
                  selectedTerrain={selectedTerrain}
                  className=""
                />
                <div className="text-center font-bold text-[9px] tracking-widest text-amber-600 dark:text-amber-500 uppercase w-full">
                  {getThemedMoveName(unit.type)}
                </div>
              </div>

              <MathOperator operator="=" />

              {/* Both Moves */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <UnitMovePreview
                  unitType={unit.type}
                  mode="both"
                  selectedTerrain={selectedTerrain}
                  className=""
                  containerClassName="border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                />
                <div className="text-center font-bold text-[9px] tracking-widest text-indigo-600 dark:text-indigo-400 uppercase w-full">
                  {details.title}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-start justify-center w-full bg-slate-900/20 p-8 rounded-[2rem] border border-white/5 shadow-inner">
              <div className="flex flex-col gap-4 min-w-[240px]">
                <div className="flex items-center gap-3 mb-2 opacity-60">
                  <div
                    className={`w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]`}
                  />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Tactical Stats
                  </span>
                </div>
                {details.levelUp?.stats.map((stat: string, sIdx: number) => {
                  const colonIndex = stat.indexOf(":");
                  if (colonIndex === -1) {
                    if (stat.toLowerCase().includes("sanctuary")) return null;
                    return (
                      <div key={sIdx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {stat}
                        </p>
                      </div>
                    );
                  }

                  const name = stat.substring(0, colonIndex);
                  const desc = stat.substring(colonIndex + 1).trim();
                  if (name.toLowerCase().includes("sanctuary")) return null;

                  return (
                    <div key={sIdx} className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                        {name}
                      </span>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex-1 flex flex-col items-center">
                <MoveLegend />
              </div>
            </div>
          </div>
        ),
      };
    }).filter(Boolean) as Slide[];
  }, [initialUnit, selectedTerrain, getIcon]);

  return (
    <InteractiveGuide
      title="The Chess - Unit Roster"
      slides={slides}
      onBack={onBack}
      labelColor="blue"
      onSlideChange={(id) => {
        window.history.replaceState(null, "", `/learn/chess/chessmen/${id}`);
        setSelectedTerrain(null); // Reset terrain preview on slide change
      }}
    />
  );
};

export default LearnChessDetailView;
