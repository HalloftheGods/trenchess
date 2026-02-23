import React, { useEffect } from "react";
import { Waves, Crosshair, ShieldPlus, Zap } from "lucide-react";
import { useRouteContext } from "@/route.context";
import { PIECES, INITIAL_ARMY } from "@/client/game/theme";
import { DesertIcon } from "@/client/game/components/atoms/UnitIcons";
import { UNIT_DETAILS, unitColorMap } from "@/client/game/theme";
import type { PieceStyle } from "@/client/game/theme";
import type { TerrainType } from "@/shared/types/game";

import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import { UnitMovePreview } from "@/shared/components/molecules/UnitMovePreview";
import { TerrainIconBadge } from "@/shared/components/atoms/TerrainIconBadge";
import { GuideBullet } from "@/shared/components/atoms/GuideBullet";
import SectionDivider from "@/shared/components/molecules/SectionDivider";
import TerrainIntelTool from "@/client/game/components/organisms/TerrainIntelTool";

interface LearnManualViewProps {
  onBack: () => void;
  darkMode: boolean;
  pieceStyle: PieceStyle;
}

export const LearnManualView: React.FC<LearnManualViewProps> = ({
  onBack,
  darkMode,
}) => {
  const { setTerrainSeed, setPreviewConfig } = useRouteContext();
  const [selectedTerrain, setSelectedTerrain] = React.useState<string | null>(
    null,
  );

  useEffect(() => {
    // Set fixed preview for this page
    setPreviewConfig({
      mode: null,
      protocol: "terrainiffic",
      showIcons: true,
      hideUnits: true,
    });
    setTerrainSeed(12345);
    return () => setPreviewConfig({ mode: null });
  }, [setPreviewConfig, setTerrainSeed]);

  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";

  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";
  const borderColor = darkMode ? "border-white/10" : "border-slate-200";

  const renderSectionTitle = (
    title: string,
    icon: React.ReactNode,
    isGold?: boolean,
  ) => (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`p-2 rounded-lg ${isGold ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
      >
        {icon}
      </div>
      <h2
        className={`text-2xl font-black tracking-widest ${isGold ? "text-amber-500" : textColor}`}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label="Manual Intel"
        onBackClick={onBack}
        color="amber"
      />
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col items-center mb-16">
          <SectionDivider
            label="You've Unlocked New Classes & Abilities!"
            color="amber"
            animate={true}
          />
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 gap-8">
            {[PIECES.KNIGHT, PIECES.BISHOP, PIECES.ROOK].map((type) => {
              const unit = INITIAL_ARMY.find((u) => u.type === type);
              if (!unit) return null;

              const details = UNIT_DETAILS[unit.type];
              if (!details) return null;

              const colors = unitColorMap[unit.type];
              const IconComp = unit.lucide;

              return (
                <div
                  key={unit.type}
                  className={`relative p-8 rounded-3xl border-4 ${cardBg} ${colors.border} flex flex-col gap-6 transition-all hover:shadow-lg overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row gap-10 items-center">
                    <div className="flex flex-col shrink-0 gap-4 items-center">
                      <div
                        className={`w-36 h-36 sm:w-48 sm:h-48 rounded-[2.5rem] ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner border border-white/5 transition-transform hover:-rotate-3 group`}
                      >
                        <IconComp className="w-24 h-24 sm:w-32 sm:h-32 transition-transform group-hover:scale-110" />
                      </div>
                      {details.levelUp?.sanctuaryTerrain && (
                        <div className="flex justify-center">
                          <div className="flex gap-2">
                            {details.levelUp.sanctuaryTerrain.map(
                              (key: TerrainType, idx: number) => (
                                <TerrainIconBadge
                                  key={idx}
                                  terrainKey={key}
                                  active={selectedTerrain === key}
                                  onClick={() =>
                                    setSelectedTerrain((prev) =>
                                      prev === key ? null : key,
                                    )
                                  }
                                />
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col text-center sm:text-left justify-center py-2">
                      <div className="flex flex-col gap-1 items-center sm:items-start mb-6">
                        <div className="flex items-center gap-4 justify-center sm:justify-start w-full">
                          <h3
                            className={`text-4xl font-black uppercase tracking-tighter ${textColor}`}
                          >
                            {details.title}
                          </h3>
                          <div
                            className={`px-4 py-1.5 rounded-xl ${colors.bg} ${colors.text} text-[11px] font-black uppercase tracking-widest border border-white/5`}
                          >
                            {details.role}
                          </div>
                        </div>
                        {details.subtitle && (
                          <span
                            className={`text-sm font-bold uppercase tracking-[0.2em] ${colors.text} opacity-80`}
                          >
                            {details.subtitle}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-3">
                        {details.levelUp && (
                          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-6 relative">
                            <div className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase italic tracking-wider mb-2">
                              <Zap size={14} className="fill-amber-500" />
                              {details.levelUp.title}
                            </div>
                            <ul className="space-y-1">
                              {details.levelUp.stats.map((stat, sIdx) => (
                                <li
                                  key={sIdx}
                                  className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 text-left"
                                >
                                  <GuideBullet color="amber" size="sm" />
                                  {stat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {details.desc?.map((bullet, idx) => {
                          const parts = bullet.split(": ");
                          const header = parts[0];
                          const content = parts.slice(1).join(": ");
                          return (
                            <li
                              key={idx}
                              className={`text-sm text-center sm:text-left`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                                <span
                                  className={`font-black uppercase tracking-tight text-xs ${colors.text} shrink-0`}
                                >
                                  {header
                                    .replace(/\*\*/g, "")
                                    .replace("New! ", "✨ ")}
                                </span>
                                <span
                                  className={`${subtextColor} font-medium leading-relaxed`}
                                >
                                  {content}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="shrink-0 flex flex-col gap-3 items-center sm:items-start">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${subtextColor} flex items-center gap-2`}
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Move Set
                      </span>
                      <UnitMovePreview
                        unitType={unit.type}
                        selectedTerrain={selectedTerrain}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 gap-8">
            {[PIECES.PAWN, PIECES.QUEEN, PIECES.KING].map((type) => {
              const unit = INITIAL_ARMY.find((u) => u.type === type);
              if (!unit) return null;

              const details = UNIT_DETAILS[unit.type];
              if (!details) return null;

              const colors = unitColorMap[unit.type];
              const IconComp = unit.lucide;

              return (
                <div
                  key={unit.type}
                  className={`relative p-8 rounded-3xl border-4 ${cardBg} ${colors.border} flex flex-col gap-6 transition-all hover:shadow-lg overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row gap-10 items-center">
                    <div className="flex flex-col shrink-0 gap-4 items-center">
                      <div
                        className={`w-36 h-36 sm:w-48 sm:h-48 rounded-[2.5rem] ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner border border-white/5 transition-transform hover:-rotate-3 group`}
                      >
                        <IconComp className="w-24 h-24 sm:w-32 sm:h-32 transition-transform group-hover:scale-110" />
                      </div>
                      {details.levelUp?.sanctuaryTerrain && (
                        <div className="flex justify-center">
                          <div className="flex gap-2">
                            {details.levelUp.sanctuaryTerrain.map(
                              (key: TerrainType, idx: number) => (
                                <TerrainIconBadge
                                  key={idx}
                                  terrainKey={key}
                                  active={selectedTerrain === key}
                                  onClick={() =>
                                    setSelectedTerrain((prev) =>
                                      prev === key ? null : key,
                                    )
                                  }
                                />
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col text-center sm:text-left justify-center py-2">
                      <div className="flex flex-col gap-1 items-center sm:items-start mb-6">
                        <div className="flex items-center gap-4 justify-center sm:justify-start w-full">
                          <h3
                            className={`text-4xl font-black uppercase tracking-tighter ${textColor}`}
                          >
                            {details.title}
                          </h3>
                          <div
                            className={`px-4 py-1.5 rounded-xl ${colors.bg} ${colors.text} text-[11px] font-black uppercase tracking-widest border border-white/5`}
                          >
                            {details.role}
                          </div>
                        </div>
                        {details.subtitle && (
                          <span
                            className={`text-sm font-bold uppercase tracking-[0.2em] ${colors.text} opacity-80`}
                          >
                            {details.subtitle}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-3">
                        {details.levelUp && (
                          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-6 relative">
                            <div className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase italic tracking-wider mb-2">
                              <Zap size={14} className="fill-amber-500" />
                              {details.levelUp.title}
                            </div>
                            <ul className="space-y-1">
                              {details.levelUp.stats.map((stat, sIdx) => (
                                <li
                                  key={sIdx}
                                  className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 text-left"
                                >
                                  <div className="w-1 h-1 rounded-full bg-amber-500/40" />
                                  {stat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {details.desc?.map((bullet, idx) => {
                          const parts = bullet.split(": ");
                          const header = parts[0];
                          const content = parts.slice(1).join(": ");
                          return (
                            <li
                              key={idx}
                              className={`text-sm text-center sm:text-left`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                                <span
                                  className={`font-black uppercase tracking-tight text-xs ${colors.text} shrink-0`}
                                >
                                  {header
                                    .replace(/\*\*/g, "")
                                    .replace("New! ", "✨ ")}
                                </span>
                                <span
                                  className={`${subtextColor} font-medium leading-relaxed`}
                                >
                                  {content}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="shrink-0 flex flex-col gap-3 items-center sm:items-start">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${subtextColor} flex items-center gap-2`}
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Basic Move Set
                      </span>
                      <UnitMovePreview
                        unitType={unit.type}
                        selectedTerrain={selectedTerrain}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-12">
          {renderSectionTitle(
            "The Battlefield - Terrain Intel",
            <ShieldPlus size={24} />,
            true,
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              className={`p-6 rounded-3xl border-2 border-amber-500/30 ${cardBg} backdrop-blur-xl shadow-lg relative overflow-hidden group`}
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
              <h4
                className={`text-lg font-black uppercase tracking-tight mb-3 flex items-center gap-2 ${darkMode ? "text-amber-500" : "text-amber-600"}`}
              >
                <DesertIcon className="w-6 h-6" />
                The Desert Rule
              </h4>
              <p
                className={`text-sm leading-relaxed ${subtextColor} font-bold`}
              >
                Deserts are dead-ends.{" "}
                <span className="text-slate-900 dark:text-white underline decoration-amber-500/50 underline-offset-4">
                  Deserts end movement immediately on entry
                </span>
                . Units trapped in the desert must exit on their very next turn
                or they are lost to the sands.
              </p>
            </div>

            <div
              className={`p-6 rounded-3xl border-2 border-blue-500/30 ${cardBg} backdrop-blur-xl shadow-lg relative overflow-hidden group`}
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <h4
                className={`text-lg font-black uppercase tracking-tight mb-3 flex items-center gap-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              >
                <Waves size={24} />
                Strategic Sanctuary
              </h4>
              <p
                className={`text-sm leading-relaxed ${subtextColor} font-bold`}
              >
                Use forests, swamps, and mountains to shield your units. When a
                unit is in its{" "}
                <span className="text-slate-900 dark:text-white underline decoration-blue-500/50 underline-offset-4">
                  Sanctuary Terrain
                </span>
                , it becomes invisible to specific enemy classes.
              </p>
            </div>
          </div>

          <TerrainIntelTool darkMode={darkMode} />
        </div>

        <div
          className={`mb-12 p-8 rounded-3xl border ${cardBg} ${borderColor} backdrop-blur-xl shadow-xl`}
        >
          {renderSectionTitle("Engagement Rules", <Crosshair size={24} />)}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"} font-bold`}
              >
                1
              </div>
              <div>
                <h4 className={`font-bold ${textColor}`}>
                  Turn Based Strategy
                </h4>
                <p className={`text-sm ${subtextColor}`}>
                  Players take turns maneuvering their units across the board.
                  Strategy is key—position your army to control the center and
                  trap your opponent.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"} font-bold`}
              >
                2
              </div>
              <div>
                <h4 className={`font-bold ${textColor}`}>Capture & Combat</h4>
                <p className={`text-sm ${subtextColor}`}>
                  Capture enemy pieces by landing exactly on their tile. Each
                  unit has a unique movement and attack profile—master them to
                  dominate the board.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"} font-bold`}
              >
                3
              </div>
              <div>
                <h4 className={`font-bold ${textColor}`}>Victory Conditions</h4>
                <p className={`text-sm ${subtextColor}`}>
                  The game is won by capturing the enemy King or by reaching the
                  center flag tiles in Capture the World mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoutePageLayout>
  );
};

export default LearnManualView;
