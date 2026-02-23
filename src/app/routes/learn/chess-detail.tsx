import React, { useMemo, useState } from "react";

import InteractiveGuide, {
  type Slide,
} from "@/app/routes/shared/components/templates/InteractiveGuide";
import { PIECES, INITIAL_ARMY } from "@engineConfigs/unitDetails";
import { UNIT_DETAILS, unitColorMap } from "@engineConfigs/unitDetails";
// Shared Route Components
import { TerrainIconBadge } from "@/app/routes/shared/components/atoms/TerrainIconBadge";
import { UnitMovePreview } from "@/app/routes/shared/components/molecules/UnitMovePreview";
import { GuideBullet } from "@/app/routes/shared/components/atoms/GuideBullet";
import { MathOperator } from "@/app/routes/shared/components/atoms/MathOperator";

interface ChessGuideProps {
  onBack: () => void;
  initialUnit?: string;
}

export const LearnChessDetailView: React.FC<ChessGuideProps> = ({
  onBack,
  initialUnit,
}) => {
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>(null);

  const UNIT_ORDER = initialUnit
    ? [
        initialUnit,
        ...[
          PIECES.PAWN,
          PIECES.KNIGHT,
          PIECES.BISHOP,
          PIECES.ROOK,
          PIECES.QUEEN,
          PIECES.KING,
        ].filter((u: any) => u !== initialUnit),
      ]
    : [
        PIECES.PAWN,
        PIECES.KNIGHT,
        PIECES.BISHOP,
        PIECES.ROOK,
        PIECES.QUEEN,
        PIECES.KING,
      ];

  const slides: Slide[] = useMemo(() => {
    return UNIT_ORDER.map((type: any) => {
      const unit = INITIAL_ARMY.find((u: any) => u.type === type);
      const details = UNIT_DETAILS[type];

      if (!unit || !details) return null;

      const colors = unitColorMap[unit.type];
      const IconComp = unit.lucide;

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
      ];
      const finalColor = validColors.includes(colorName) ? colorName : "slate";

      const getClassicMoveName = (type: string) => {
        switch (type) {
          case PIECES.KING:
            return "1-Step";
          case PIECES.QUEEN:
            return "Orthogonal & Diagonal";
          case PIECES.ROOK:
            return "Orthogonal";
          case PIECES.BISHOP:
            return "Diagonal";
          case PIECES.KNIGHT:
            return "L-Shape";
          case PIECES.PAWN:
            return "Forward Step";
          default:
            return "Standard Move";
        }
      };

      const getThemedMoveName = (type: string) => {
        switch (type) {
          case PIECES.KING:
            return "Charge";
          case PIECES.QUEEN:
            return "Sacred Gallop";
          case PIECES.ROOK:
            return "4-Corners (Moat)";
          case PIECES.BISHOP:
            return "Staff Vault";
          case PIECES.KNIGHT:
            return "Triple Bar Jump";
          case PIECES.PAWN:
            return "Backflip";
          default:
            return details.title;
        }
      };

      return {
        id: unit.type,
        title: details.title,
        subtitle: details.subtitle,
        color: finalColor as any,
        topLabel: details.role,
        icon: IconComp,
        previewConfig: {
          mode: "2p-ns",
          protocol: "classic",
          showIcons: false,
          hideUnits: false,
        },
        leftContent: details.levelUp?.sanctuaryTerrain ? (
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              {details.levelUp.sanctuaryTerrain.map((key: any, idx: any) => (
                <TerrainIconBadge
                  key={idx}
                  terrainKey={key}
                  active={selectedTerrain === key}
                  onClick={() =>
                    setSelectedTerrain((prev) => (prev === key ? null : key))
                  }
                />
              ))}
            </div>
          </div>
        ) : null,
        description: null,
        sideContent: (
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
                {details.levelUp?.title || details.title}
              </div>
            </div>
          </div>
        ),
        infoContent: (
          <div className="flex flex-col items-center gap-8">
            {/* Move Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 p-6 rounded-3xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 w-full max-w-2xl mx-auto">
              {/* Basic Movement */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Unit Movement
                </span>
              </div>

              {/* Standard Capture */}
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-brand-red shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Capture Zone
                </span>
              </div>

              {/* Promotion for Pawns */}
              {unit.type === PIECES.PAWN && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-amber-500/60" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Promotion Rank
                  </span>
                </div>
              )}

              {/* Special Abilities from stats */}
              {details.levelUp?.stats.map((stat: any, sIdx: any) => {
                const colonIndex = stat.indexOf(":");
                if (colonIndex === -1) {
                  if (stat.toLowerCase().includes("sanctuary")) return null;

                  return (
                    <div
                      key={`legend-${sIdx}`}
                      className="flex items-start gap-3 sm:col-span-2"
                    >
                      <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] mt-0.5 animate-pulse" />
                      <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                        <span className="font-black uppercase tracking-wider text-amber-500 mr-2">
                          Special:
                        </span>
                        {stat}
                      </p>
                    </div>
                  );
                }

                const name = stat.substring(0, colonIndex);
                const desc = stat.substring(colonIndex + 1).trim();
                const isSanctuary = name.toLowerCase().includes("sanctuary");

                return (
                  <div
                    key={`legend-${sIdx}`}
                    className={`flex items-start gap-3 ${isSanctuary ? "sm:col-span-2" : "sm:col-span-2"}`}
                  >
                    <GuideBullet color="amber" />
                    <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                      <span className="font-black uppercase tracking-wider text-amber-500 mr-2">
                        {name}:
                      </span>
                      {desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ),
      };
    }).filter(Boolean) as Slide[];
  }, [UNIT_ORDER, selectedTerrain]);

  return (
    <InteractiveGuide
      title="The Chess - Unit Roster"
      slides={slides}
      onBack={onBack}
      labelColor="blue"
      onSlideChange={(id) => {
        window.history.replaceState(null, "", `/learn/chess/${id}`);
        setSelectedTerrain(null); // Reset terrain preview on slide change
      }}
    />
  );
};

export default LearnChessDetailView;
