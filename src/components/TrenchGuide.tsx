/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of Trenchess.
 */
import React from "react";
import { Waves, Trees, Mountain, ShieldPlus, Ban, Zap } from "lucide-react";
import { DesertIcon } from "../UnitIcons";
import BoardPreview from "./BoardPreview";
import PageLayout from "./PageLayout";
import PageHeader from "./PageHeader";
import SectionDivider from "./ui/SectionDivider";
import { TERRAIN_TYPES, PIECES, INITIAL_ARMY } from "../constants";
import { unitColorMap } from "../data/unitDetails";
import type { PieceStyle } from "../constants";
import type { TerrainType } from "../types";

interface TrenchGuideProps {
  onBack: () => void;
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme?: () => void;
  togglePieceStyle?: () => void;
  onTutorial?: () => void;
  initialTerrain?: TerrainType | null;
}

// --- Terrain detail data ---
interface TerrainDetail {
  key: TerrainType;
  label: string;
  subtitle: string;
  /** Short "You discovered a new Trench!" style tagline */
  tagline: string;
  icon: React.ElementType;
  color: {
    text: string;
    bg: string;
    border: string;
    headerBg: string;
    glow: string;
    iconBg: string;
    iconBorder: string;
    badgeBg: string;
  };
  /** Flavor text shown in the amber-style highlight box */
  flavorTitle: string;
  flavorStats: string[];
  /** Rule badge label (optional) */
  rule?: string;
  allowedUnits: string[]; // PIECES keys
  blockedUnits: string[]; // PIECES keys
  sanctuaryUnits: string[]; // PIECES keys — protected when inside
}

const TERRAIN_DETAILS: TerrainDetail[] = [
  {
    key: TERRAIN_TYPES.TREES as TerrainType,
    label: "Forests",
    subtitle: "You discovered a new Trench!",
    tagline: "Sanctuary of the Mages",
    icon: Trees,
    color: {
      text: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      headerBg: "bg-emerald-700",
      glow: "shadow-emerald-900/20",
      iconBg: "bg-emerald-800/80",
      iconBorder: "border-emerald-600/50",
      badgeBg: "bg-emerald-500/20",
    },
    flavorTitle: "Dense Forest Cover",
    flavorStats: [
      "Bishops, Queens, Pawns, and Kings slip through the canopy.",
      "Rooks and Knights are too heavy — the forest denies their passage.",
      "Units sheltered here vanish from Rook and Knight targeting.",
    ],
    allowedUnits: [
      PIECES.SNIPER,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
    blockedUnits: [PIECES.TANK, PIECES.HORSEMAN],
    sanctuaryUnits: [
      PIECES.SNIPER,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
  },
  {
    key: TERRAIN_TYPES.PONDS as TerrainType,
    label: "Swamp",
    subtitle: "You discovered a new Trench!",
    tagline: "Sanctuary of the Paladins",
    icon: Waves,
    color: {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/40",
      headerBg: "bg-blue-700",
      glow: "shadow-blue-900/20",
      iconBg: "bg-blue-800/80",
      iconBorder: "border-blue-600/50",
      badgeBg: "bg-blue-500/20",
    },
    flavorTitle: "Murky Wetlands",
    flavorStats: [
      "Rooks push through the mire with ease.",
      "Knights and Bishops sink — movement through here is impossible for them.",
      "Units resting here are invisible to Bishop and Knight attacks.",
    ],
    allowedUnits: [
      PIECES.TANK,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
    blockedUnits: [PIECES.HORSEMAN, PIECES.SNIPER],
    sanctuaryUnits: [
      PIECES.TANK,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
  },
  {
    key: TERRAIN_TYPES.RUBBLE as TerrainType,
    label: "Mountains",
    subtitle: "You discovered a new Trench!",
    tagline: "Sanctuary of the Dark Knights",
    icon: Mountain,
    color: {
      text: "text-stone-400",
      bg: "bg-stone-500/10",
      border: "border-stone-500/40",
      headerBg: "bg-stone-700",
      glow: "shadow-stone-900/20",
      iconBg: "bg-stone-700/80",
      iconBorder: "border-stone-500/50",
      badgeBg: "bg-stone-500/20",
    },
    flavorTitle: "Treacherous Peaks",
    flavorStats: [
      "Agile Knights leap across the crags with ease.",
      "Rooks and Bishops cannot navigate the steep inclines.",
      "Units camped here are shielded from Rook and Bishop attacks.",
    ],
    allowedUnits: [
      PIECES.HORSEMAN,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
    blockedUnits: [PIECES.TANK, PIECES.SNIPER],
    sanctuaryUnits: [
      PIECES.HORSEMAN,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
  },
  {
    key: TERRAIN_TYPES.DESERT as TerrainType,
    label: "Desert",
    subtitle: "You discovered a new Trench!",
    tagline: "Sanctuary of the Sacred",
    icon: DesertIcon,
    color: {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/40",
      headerBg: "bg-amber-700",
      glow: "shadow-amber-900/20",
      iconBg: "bg-amber-700/80",
      iconBorder: "border-amber-500/50",
      badgeBg: "bg-amber-500/20",
    },
    flavorTitle: "⚠ Desert Rule",
    flavorStats: [
      "Rooks alone may walk the sands — all others are turned away.",
      "Rooks inside are immune to every attack while the sand holds.",
      "Dead-end zone: movement stops on entry. Exit on your very next turn or be lost.",
    ],
    rule: "Desert Rule",
    allowedUnits: [PIECES.TANK],
    blockedUnits: [
      PIECES.SNIPER,
      PIECES.HORSEMAN,
      PIECES.BATTLEKNIGHT,
      PIECES.BOT,
      PIECES.COMMANDER,
    ],
    sanctuaryUnits: [PIECES.TANK],
  },
];

const TrenchGuide: React.FC<TrenchGuideProps> = ({
  onBack,
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onTutorial,
  initialTerrain,
}) => {
  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";

  React.useEffect(() => {
    if (initialTerrain) {
      const element = document.getElementById(`terrain-${initialTerrain}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [initialTerrain]);

  const boardPreviewNode = (
    <BoardPreview
      key="trench-guide-preview"
      selectedMode={null}
      selectedProtocol={"terrainiffic" as any}
      darkMode={darkMode}
      pieceStyle={pieceStyle}
      isReady={false}
      terrainSeed={99999}
      showTerrainIcons={true}
      hideUnits={true}
    />
  );

  const getUnitIcon = (pieceKey: string) => {
    const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
    if (!unit) return null;
    if (pieceStyle === "lucide") {
      const Icon = unit.lucide;
      return <Icon className="w-full h-full" />;
    }
    if (pieceStyle === "custom") {
      const Icon = unit.custom;
      return <Icon className="w-full h-full" />;
    }
    return (
      <span className="text-lg leading-none">
        {unit[pieceStyle as "emoji" | "bold" | "outlined"]}
      </span>
    );
  };

  // Map PIECES key -> standard chess name
  const CHESS_NAME: Record<string, { chess: string; role: string }> = {
    [PIECES.TANK]: { chess: "Rook", role: "Heavy Armor" },
    [PIECES.SNIPER]: { chess: "Bishop", role: "Ranged" },
    [PIECES.HORSEMAN]: { chess: "Knight", role: "Cavalry" },
    [PIECES.BATTLEKNIGHT]: { chess: "Queen", role: "Elite" },
    [PIECES.COMMANDER]: { chess: "King", role: "Leader" },
    [PIECES.BOT]: { chess: "Pawn", role: "Infantry" },
  };

  const renderUnitChip = (
    pieceKey: string,
    status: "allow" | "block" | "sanctuary",
  ) => {
    const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
    if (!unit) return null;
    const colors = unitColorMap[pieceKey];
    const isSanctuary = status === "sanctuary";
    const isBlock = status === "block";
    const chessInfo = CHESS_NAME[pieceKey];

    return (
      <div
        key={pieceKey}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
          isBlock
            ? "bg-red-500/5 border-red-500/20 opacity-60"
            : isSanctuary
              ? `${colors.bg} ${colors.border} border-double border-4`
              : `${colors.bg} ${colors.border}`
        }`}
      >
        {/* Unit icon */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isBlock ? "text-slate-500" : colors.text
          }`}
        >
          {getUnitIcon(pieceKey)}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <span
            className={`block text-xs font-black uppercase tracking-wider leading-none mb-0.5 ${
              isBlock ? "text-slate-500" : colors.text
            }`}
          >
            {chessInfo?.chess || unit.type}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isBlock
                ? "text-red-400"
                : isSanctuary
                  ? "text-amber-400"
                  : "text-emerald-400"
            }`}
          >
            {isBlock
              ? "✗ Blocked"
              : isSanctuary
                ? "⚔ Sanctuary"
                : "✓ Can Enter"}
          </span>
        </div>

        {/* Status icon */}
        <div className="shrink-0">
          {isBlock ? (
            <Ban size={16} className="text-red-400/60" />
          ) : isSanctuary ? (
            <ShieldPlus size={16} className="text-amber-400/80" />
          ) : (
            <Zap size={16} className={`${colors.text} opacity-60`} />
          )}
        </div>
      </div>
    );
  };

  /** Small unit icon badges shown below the terrain icon — mirroring terrain icons in unit cards */
  const renderSanctuaryBadges = (terrain: TerrainDetail) => {
    return (
      <div className="flex gap-2 flex-wrap justify-center">
        {terrain.sanctuaryUnits.map((pk) => {
          const unit = INITIAL_ARMY.find((u) => u.type === pk);
          if (!unit) return null;
          const colors = unitColorMap[pk];
          return (
            <div
              key={pk}
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

  return (
    <PageLayout
      darkMode={darkMode}
      header={
        <PageHeader
          darkMode={darkMode}
          pieceStyle={pieceStyle}
          toggleTheme={toggleTheme || (() => {})}
          togglePieceStyle={togglePieceStyle || (() => {})}
          onTutorial={onTutorial}
          onLogoClick={onBack}
          onBack={onBack}
          boardPreview={boardPreviewNode}
        />
      }
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col items-center mb-16">
          <SectionDivider
            label="The Trench: Trials & Tribulations"
            color="amber"
            animate={true}
          />
        </div>

        {/* Terrain Cards — styled like unit/chess cards */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          {TERRAIN_DETAILS.map((terrain) => {
            const IconComp = terrain.icon;

            return (
              <div
                key={terrain.key}
                id={`terrain-${terrain.key}`}
                className={`relative p-8 rounded-3xl border-4 ${cardBg} ${terrain.color.border} flex flex-col gap-6 transition-all hover:shadow-lg overflow-hidden`}
              >
                <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
                  {/* Left: Terrain Icon + Sanctuary unit badges */}
                  <div className="flex flex-col shrink-0 gap-4 items-center">
                    {/* Big terrain icon */}
                    <div
                      className={`w-36 h-36 sm:w-48 sm:h-48 rounded-[2.5rem] ${terrain.color.iconBg} ${terrain.color.text} flex items-center justify-center shadow-inner border border-white/5 transition-transform hover:-rotate-3 group`}
                    >
                      <IconComp
                        size={80}
                        className="transition-transform group-hover:scale-110"
                      />
                    </div>

                    {/* Sanctuary unit icons below — who finds shelter here */}
                    {renderSanctuaryBadges(terrain)}
                  </div>

                  {/* Center: Name + flavor box + unit interaction grid */}
                  <div className="flex-1 min-w-0 flex flex-col text-center sm:text-left justify-center py-2">
                    {/* Title block */}
                    <div className="flex flex-col gap-1 items-center sm:items-start mb-6">
                      <div className="flex items-center gap-4 justify-center sm:justify-start w-full flex-wrap">
                        <h3
                          className={`text-4xl font-black uppercase tracking-tighter ${textColor}`}
                        >
                          {terrain.label}
                        </h3>
                        <div
                          className={`px-4 py-1.5 rounded-xl ${terrain.color.bg} ${terrain.color.text} text-[11px] font-black uppercase tracking-widest border border-white/5`}
                        >
                          {terrain.tagline}
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold uppercase tracking-[0.2em] ${terrain.color.text} opacity-80`}
                      >
                        {terrain.subtitle}
                      </span>
                    </div>

                    {/* Flavor / rules highlight box — like the levelUp amber box */}
                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-6 relative">
                      <div className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase italic tracking-wider mb-2">
                        <Zap size={14} className="fill-amber-500" />
                        {terrain.flavorTitle}
                      </div>
                      <ul className="space-y-1">
                        {terrain.flavorStats.map((stat, i) => (
                          <li
                            key={i}
                            className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 text-left"
                          >
                            <div className="w-1 h-1 rounded-full bg-amber-500/40 shrink-0" />
                            {stat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Unit interaction grid */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`h-px flex-1 ${darkMode ? "bg-white/10" : "bg-slate-200"}`}
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${subtextColor}`}
                        >
                          Unit Interactions
                        </span>
                        <div
                          className={`h-px flex-1 ${darkMode ? "bg-white/10" : "bg-slate-200"}`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Sanctuary units first */}
                        {terrain.sanctuaryUnits.map((pk) =>
                          renderUnitChip(pk, "sanctuary"),
                        )}
                        {/* Allowed-but-not-sanctuary */}
                        {terrain.allowedUnits
                          .filter((pk) => !terrain.sanctuaryUnits.includes(pk))
                          .map((pk) => renderUnitChip(pk, "allow"))}
                        {/* Blocked */}
                        {terrain.blockedUnits.map((pk) =>
                          renderUnitChip(pk, "block"),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sanctuary Rule Summary */}
        <div
          className={`mb-12 p-8 rounded-3xl border ${cardBg} ${darkMode ? "border-white/10" : "border-slate-200"} backdrop-blur-xl shadow-xl`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/30">
              <ShieldPlus size={24} />
            </div>
            <h2
              className={`text-2xl font-black tracking-widest text-amber-500`}
            >
              Sanctuary Rule
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"} font-bold`}
              >
                1
              </div>
              <div>
                <h4 className={`font-bold ${textColor}`}>
                  Invisible to Specific Enemies
                </h4>
                <p className={`text-sm ${subtextColor}`}>
                  When a unit occupies its Sanctuary Terrain, it becomes
                  invisible to specific enemy classes — those enemies cannot
                  target or attack it while it remains inside.
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
                <h4 className={`font-bold ${textColor}`}>
                  Double Border = Protected
                </h4>
                <p className={`text-sm ${subtextColor}`}>
                  In the interactive guide, a unit with a double border is
                  currently inside its Sanctuary Terrain. The terrain tile will
                  show a dotted border to indicate the protection relationship.
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
                <h4 className={`font-bold ${textColor}`}>
                  Terrain Placement is Strategic
                </h4>
                <p className={`text-sm ${subtextColor}`}>
                  Place terrain tiles before the game begins to create natural
                  fortifications. Positioning your units in their Sanctuary
                  Terrain is a core defensive strategy in Trenchess.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TrenchGuide;
