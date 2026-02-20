import React, { useMemo } from "react";
import { Trees, Mountain } from "lucide-react";
import InteractiveGuide, { type Slide } from "./InteractiveGuide";
import { PIECES, INITIAL_ARMY } from "../constants";
import { DesertIcon } from "../UnitIcons";
import { UNIT_DETAILS, unitColorMap } from "../data/unitDetails";

interface ChessGuideProps {
  onBack: () => void;
  initialUnit?: string;
}

const ChessGuide: React.FC<ChessGuideProps> = ({ onBack, initialUnit }) => {
  const renderTerrainIcons = (icons: React.ReactNode[]) => {
    return (
      <div className="flex gap-2">
        {icons.map((icon, idx) => {
          const iconElement = icon as React.ReactElement;
          const terrainColors =
            iconElement.type === Mountain
              ? {
                  bg: "bg-brand-red/10",
                  text: "text-brand-red",
                  border: "border-brand-red/20",
                }
              : iconElement.type === Trees
                ? {
                    bg: "bg-emerald-500/10",
                    text: "text-emerald-500",
                    border: "border-emerald-500/20",
                  }
                : iconElement.type === DesertIcon
                  ? {
                      bg: "bg-amber-500/10",
                      text: "text-amber-500",
                      border: "border-amber-500/20",
                    }
                  : {
                      bg: "bg-brand-blue/10",
                      text: "text-brand-blue",
                      border: "border-brand-blue/20",
                    };
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl ${terrainColors.bg} ${terrainColors.text} border ${terrainColors.border} shadow-sm backdrop-blur-sm`}
            >
              {React.cloneElement(iconElement as React.ReactElement<any>, {
                size: 28,
                className: "fill-current",
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMovePreview = (
    unitType: string,
    movePattern: (r: number, c: number) => number[][],
  ) => {
    const previewGridSize = 9;
    const centerRow = 4;
    const centerCol = 4;
    const details = UNIT_DETAILS[unitType];
    const moves = movePattern(centerRow, centerCol);
    const newMoves = details?.newMovePattern
      ? details.newMovePattern(centerRow, centerCol)
      : [];
    const attacks = details?.attackPattern
      ? details.attackPattern(centerRow, centerCol)
      : [];

    return (
      <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-3 border border-slate-200 dark:border-white/5 w-fit shadow-inner mx-auto lg:mx-0">
        <div
          className="grid gap-[1px] w-40 h-40 sm:w-48 sm:h-48"
          style={{ gridTemplateColumns: `repeat(${previewGridSize}, 1fr)` }}
        >
          {Array.from({ length: previewGridSize * previewGridSize }).map(
            (_, i) => {
              const r = Math.floor(i / previewGridSize);
              const c = i % previewGridSize;
              const isCenter = r === centerRow && c === centerCol;
              const isMove = moves.some(([mr, mc]) => mr === r && mc === c);
              const isAttack = attacks.some(([ar, ac]) => ar === r && ac === c);
              const isPromotionRow = unitType === PIECES.BOT && r === 0;

              const isEven = (r + c) % 2 === 0;
              const baseColor = isEven
                ? "bg-slate-100/60 dark:bg-white/10"
                : "bg-slate-200/60 dark:bg-white/[0.04]";

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-[1px] relative flex items-center justify-center transition-all duration-300 ${
                    isCenter
                      ? "bg-slate-800 dark:bg-black z-20 shadow-lg scale-110"
                      : newMoves.some(([nr, nc]) => nr === r && nc === c)
                        ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] z-10 animate-pulse"
                        : isAttack
                          ? "bg-brand-red shadow-[0_0_15px_rgba(239,68,68,0.4)] z-10"
                          : isMove
                            ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"
                            : isPromotionRow
                              ? "bg-amber-500/20"
                              : baseColor
                  }`}
                >
                  {isPromotionRow && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                    </div>
                  )}
                  {isCenter && (
                    <div className="w-1 h-1 rounded-full bg-white dark:bg-black" />
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>
    );
  };

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
        ].filter((u) => u !== initialUnit),
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
    return UNIT_ORDER.map((type) => {
      const unit = INITIAL_ARMY.find((u) => u.type === type);
      const details = UNIT_DETAILS[type];

      if (!unit || !details) return null;

      const colors = unitColorMap[unit.type];
      const IconComp = unit.lucide;

      // Extract base color from the text class (e.g., "text-slate-500" -> "slate")
      const colorMatch = colors.text.match(/text-([a-z]+)-\d+/);
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
        leftContent: details.levelUp?.terrainIcons ? (
          <div className="flex items-center gap-6">
            {renderTerrainIcons(details.levelUp.terrainIcons)}
          </div>
        ) : null,
        description: (
          <div className="flex flex-row items-center gap-6 justify-center flex-wrap">
            {details.levelUp?.stats.map((stat, sIdx) => {
              const colonIndex = stat.indexOf(":");
              const name =
                colonIndex !== -1 ? stat.substring(0, colonIndex) : stat;
              return (
                <div key={sIdx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500/60 shrink-0" />
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
            {renderMovePreview(unit.type, details.movePattern)}
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
              {details.levelUp?.stats.map((stat, sIdx) => {
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
                    <div
                      className={`w-3 h-3 rounded-full ${isSanctuary ? "bg-amber-400/50" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] animate-pulse"} mt-0.5`}
                    />
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
