import React, { lazy, useMemo } from "react";
import InteractiveGuide, {
  type Slide,
} from "@/app/routes/guides/components/templates/InteractiveGuide";
import { PIECES, INITIAL_ARMY } from "@engineConfigs/unitDetails";
import { UNIT_DETAILS, unitColorMap } from "@engineConfigs/unitDetails";
import { TerrainIconBadge } from "@/app/routes/guides/components/atoms/TerrainIconBadge";
import { UnitMovePreview } from "@/app/routes/guides/components/molecules/UnitMovePreview";
import { GuideBullet } from "@/app/routes/guides/components/atoms/GuideBullet";

interface ChessGuideProps {
  onBack: () => void;
  initialUnit?: string;
}

const ChessGuide: React.FC<ChessGuideProps> = ({ onBack, initialUnit }) => {
  const UNIT_ORDER = initialUnit
    ? [
        initialUnit,
        ...[
          PIECES.BOT,
          PIECES.HORSEMAN,
          PIECES.SNIPER,
          PIECES.TANK,
          PIECES.BATTLEKNIGHT,
          PIECES.COMMANDER,
        ].filter((u: any) => u !== initialUnit),
      ]
    : [
        PIECES.BOT,
        PIECES.HORSEMAN,
        PIECES.SNIPER,
        PIECES.TANK,
        PIECES.BATTLEKNIGHT,
        PIECES.COMMANDER,
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
                <TerrainIconBadge key={idx} terrainKey={key} />
              ))}
            </div>
          </div>
        ) : null,
        description: (
          <div className="flex flex-row items-center gap-6 justify-center flex-wrap">
            {details.levelUp?.stats.map((stat: any, sIdx: any) => {
              const colonIndex = stat.indexOf(":");
              const name =
                colonIndex !== -1 ? stat.substring(0, colonIndex) : stat;
              return (
                <div key={sIdx} className="flex items-center gap-2">
                  <GuideBullet color="amber" />
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-widest">
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        ),
        sideContent: (
          <div className="flex flex-col items-center gap-4">
            <UnitMovePreview unitType={unit.type} />
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

              {/* Promotion for Bots */}
              {unit.type === PIECES.BOT && (
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
  }, [UNIT_ORDER]);

  return (
    <InteractiveGuide
      title="The Chess - Unit Roster"
      slides={slides}
      onBack={onBack}
      labelColor="blue"
    />
  );
};

export default ChessGuide;
export const LazyChessGuide = lazy(() => import("./ChessGuide"));
