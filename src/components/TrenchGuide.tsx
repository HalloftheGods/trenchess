import React, { useMemo } from "react";
import { ShieldPlus, Ban, Zap } from "lucide-react";
import InteractiveGuide, { type Slide } from "./InteractiveGuide";
import { PIECES, INITIAL_ARMY } from "../constants";
import { unitColorMap } from "../data/unitDetails";
import { TERRAIN_DETAILS, type TerrainDetail } from "../data/terrainDetails";

interface TrenchGuideProps {
  onBack: () => void;
  initialTerrain?: string | null;
}

const CHESS_NAME: Record<string, { chess: string; role: string }> = {
  [PIECES.TANK]: { chess: "Rook", role: "Heavy Armor" },
  [PIECES.SNIPER]: { chess: "Bishop", role: "Ranged" },
  [PIECES.HORSEMAN]: { chess: "Knight", role: "Cavalry" },
  [PIECES.BATTLEKNIGHT]: { chess: "Queen", role: "Elite" },
  [PIECES.COMMANDER]: { chess: "King", role: "Leader" },
  [PIECES.BOT]: { chess: "Pawn", role: "Infantry" },
};

const TrenchGuide: React.FC<TrenchGuideProps> = ({
  onBack,
  initialTerrain,
}) => {
  const getUnitIcon = (pieceKey: string) => {
    const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
    if (!unit) return null;
    const Icon = unit.lucide;
    return <Icon className="w-full h-full" />;
  };

  const renderUnitChip = (
    pieceKey: string,
    status: "allow" | "block" | "sanctuary",
    keyPrefix: string,
  ) => {
    const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
    if (!unit) return null;
    const colors = unitColorMap[pieceKey];
    const isSanctuary = status === "sanctuary";
    const isBlock = status === "block";
    const chessInfo = CHESS_NAME[pieceKey];

    return (
      <div
        key={`${keyPrefix}-${pieceKey}`}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
          isBlock
            ? "bg-red-500/5 border-red-500/20 opacity-60"
            : isSanctuary
              ? `${colors.bg} ${colors.border} border-double border-4`
              : `${colors.bg} ${colors.border}`
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isBlock ? "text-slate-500" : colors.text}`}
        >
          {getUnitIcon(pieceKey)}
        </div>
        <div className="flex-1 min-w-0">
          <span
            className={`block text-xs font-black uppercase tracking-wider leading-none mb-0.5 ${isBlock ? "text-slate-500" : colors.text}`}
          >
            {chessInfo?.chess || unit.type}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${isBlock ? "text-brand-red" : isSanctuary ? "text-amber-400" : "text-emerald-400"}`}
          >
            {isBlock
              ? "✗ Blocked"
              : isSanctuary
                ? "⚔ Sanctuary"
                : "✓ Can Enter"}
          </span>
        </div>
        <div className="shrink-0">
          {isBlock ? (
            <Ban size={16} className="text-brand-red/60" />
          ) : isSanctuary ? (
            <ShieldPlus size={16} className="text-amber-400/80" />
          ) : (
            <Zap size={16} className={`${colors.text} opacity-60`} />
          )}
        </div>
      </div>
    );
  };

  const renderSanctuaryBadges = (terrain: TerrainDetail) => {
    return (
      <div className="flex gap-2 flex-wrap justify-center">
        {terrain.sanctuaryUnits.map((pk) => {
          const colors = unitColorMap[pk];
          if (!colors) return null;
          return (
            <div
              key={`badge-${pk}`}
              title={CHESS_NAME[pk]?.chess || pk}
              className={`p-2 rounded-xl ${colors.bg} ${colors.text} border ${colors.border} shadow-sm backdrop-blur-sm`}
            >
              <div className="w-6 h-6">{getUnitIcon(pk)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const slides: Slide[] = useMemo(() => {
    const terrainSlides = TERRAIN_DETAILS.map((terrain) => {
      const IconComp = terrain.icon;
      const colorMatch = terrain.color.text.match(/text-([a-z]+)-\d+/);
      const colorName = colorMatch ? colorMatch[1] : "amber";
      const validColors = [
        "red",
        "blue",
        "emerald",
        "amber",
        "slate",
        "indigo",
      ];
      const finalColor = validColors.includes(colorName) ? colorName : "amber";

      return {
        id: terrain.key,
        title: terrain.label,
        subtitle: terrain.subtitle,
        color: finalColor as any,
        topLabel: terrain.tagline,
        icon: IconComp,
        previewConfig: {
          protocol: "terrainiffic",
          showIcons: true,
          hideUnits: true,
        },
        description: (
          <div className="space-y-6">
            <ul className="space-y-3">
              {terrain.flavorStats.map((stat, i) => (
                <li
                  key={i}
                  className="text-lg font-bold text-slate-500 dark:text-slate-400 flex items-center gap-3 text-left"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500/60 shrink-0" />
                  {stat}
                </li>
              ))}
            </ul>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Unit Interactions
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {terrain.sanctuaryUnits.map((pk) =>
                  renderUnitChip(pk, "sanctuary", terrain.key),
                )}
                {terrain.allowedUnits
                  .filter((pk) => !terrain.sanctuaryUnits.includes(pk))
                  .map((pk) => renderUnitChip(pk, "allow", terrain.key))}
                {terrain.blockedUnits.map((pk) =>
                  renderUnitChip(pk, "block", terrain.key),
                )}
              </div>
            </div>
          </div>
        ),
        leftContent:
          terrain.sanctuaryUnits.length > 0 ? (
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">
                Sanctuary Units
              </span>
              {renderSanctuaryBadges(terrain)}
            </div>
          ) : null,
      };
    });

    const rulesSlide: Slide = {
      id: "sanctuary-rules",
      title: "Sanctuary Rule",
      subtitle: "The Trenchess True Power",
      color: "amber",
      topLabel: "Gameplay Rules",
      icon: ShieldPlus,
      previewConfig: {
        protocol: "terrainiffic",
        showIcons: true,
        hideUnits: false,
      },
      description: (
        <div className="space-y-6 mt-4">
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
                Invisible to Specific Enemies
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                When a unit occupies its Sanctuary Terrain, it becomes invisible
                to specific enemy classes — those enemies cannot target or
                attack it while it remains inside.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
                Double Border = Protected
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                A unit with a double border is currently positioned inside its
                Sanctuary Terrain. The terrain tile will show a dotted border to
                indicate the protection relationship.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
                Terrain Placement is Strategic
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Positioning your units in their Sanctuary Terrain is a core
                defensive strategy in Trenchess. Place terrain strategically
                before the game begins.
              </p>
            </div>
          </div>
        </div>
      ),
    };

    // If initialTerrain was provided, move it to the front
    let sortedSlides = [...terrainSlides];
    if (initialTerrain) {
      const idx = sortedSlides.findIndex((s) => s.id === initialTerrain);
      if (idx > 0) {
        const item = sortedSlides.splice(idx, 1)[0];
        sortedSlides.unshift(item);
      }
    }

    return [...sortedSlides, rulesSlide];
  }, [initialTerrain]);

  return (
    <InteractiveGuide
      title="The Trench: Trials & Tribulations"
      slides={slides}
      onBack={onBack}
      labelColor="amber"
    />
  );
};

export default TrenchGuide;
