import { getPath } from "@/app/router/router";
/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Interactive Tutorial Page
 * Using new 5-column layout.
 */
import React, { useState, useEffect } from "react";
import { INITIAL_ARMY } from "@constants";
import { isUnitProtected, canUnitTraverseTerrain } from "@/app/core/mechanics";
import { UNIT_DETAILS, unitColorMap, TERRAIN_LIST } from "@constants";
import type { PieceType, TerrainType } from "@tc.types/game";
import { deserializeGame } from "@/shared/utilities/serialization";
import { analytics } from "@/shared/utilities/analytics";
import { TerrainDetailsPanel } from "@/app/client/console/components";
import InteractiveHeader from "@/shared/components/organisms/InteractiveHeader";
import CopyrightFooter from "@/shared/components/molecules/CopyrightFooter";
import { UnitPortfolio } from "./components/organisms/UnitPortfolio";
import { SimulationPreview } from "./components/organisms/SimulationPreview";
import { LogicDivider } from "./components/atoms/LogicDivider";
import { TutorialPageLayout } from "./components/templates/TutorialPageLayout";
import type { TerrainAffinityItem } from "./components/molecules/TerrainAffinityBar";

interface SeedItem {
  id: string;
  name: string;
  seed: string;
  mode: string;
  createdAt: string;
}

import { useTheme } from "@shared/context/ThemeContext";
import { useNavigate } from "react-router-dom";


export const LearnTutorialView: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const onBack = () => navigate(getPath("home"));
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedTerrainIdx, setSelectedTerrainIdx] = useState<number>(-1);
  const [allSeeds] = useState<SeedItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("trenchess_seeds");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (Array.isArray(data)) return data;
        } catch (e) {
          console.error("Failed to parse seeds", e);
        }
      }
    }
    return [];
  });
  const [activeLayoutIdx, setActiveLayoutIdx] = useState<number>(-1);

  useEffect(() => {
    if (selectedUnit) {
      analytics.trackEvent("Tutorial", "Select Unit", selectedUnit);
    }
  }, [selectedUnit]);

  useEffect(() => {
    if (selectedTerrainIdx >= 0) {
      const terrainType = TERRAIN_LIST[selectedTerrainIdx].terrainTypeKey;
      analytics.trackEvent("Tutorial", "Select Terrain", terrainType);
    }
  }, [selectedTerrainIdx]);

  const handleSetSelectedTerrainIdx = (
    idx: number | ((prev: number) => number),
  ) => {
    setSelectedTerrainIdx(idx);
    setActiveLayoutIdx(-1);
  };

  const activeTerrainTypeKey =
    selectedTerrainIdx >= 0
      ? TERRAIN_LIST[selectedTerrainIdx].terrainTypeKey
      : null;

  const filteredSeeds = (() => {
    return allSeeds.filter((item) => {
      const data = deserializeGame(item.seed);
      if (!data) return false;
      const { terrain } = data;
      for (let r = 0; r < terrain.length; r++) {
        for (let c = 0; c < terrain[r].length; c++) {
          if (terrain[r][c] === activeTerrainTypeKey) return true;
        }
      }
      return false;
    });
  })();

  const handlePrevLayout = () => {
    if (filteredSeeds.length === 0) return;
    setActiveLayoutIdx((prev) => {
      if (prev <= -1) return filteredSeeds.length - 1;
      return prev - 1;
    });
  };
  const handleNextLayout = () => {
    if (filteredSeeds.length === 0) return;
    setActiveLayoutIdx((prev) => {
      if (prev >= filteredSeeds.length - 1) return -1;
      return prev + 1;
    });
  };

  const activeLayoutLabel =
    activeLayoutIdx === -1
      ? "Default"
      : filteredSeeds[activeLayoutIdx]?.name || "Saved Layout";

  const terrainPositions = (() => {
    if (
      activeLayoutIdx === -1 ||
      !filteredSeeds[activeLayoutIdx] ||
      !activeTerrainTypeKey
    )
      return undefined;
    const data = deserializeGame(filteredSeeds[activeLayoutIdx].seed);
    if (!data) return undefined;
    const positions = new Set<string>();
    const { terrain } = data;
    for (let r = 0; r < terrain.length; r++) {
      for (let c = 0; c < terrain[r].length; c++) {
        if (terrain[r][c] === activeTerrainTypeKey) {
          positions.add(`${r},${c}`);
        }
      }
    }
    return positions.size > 0 ? positions : undefined;
  })();

  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";
  const borderColor = darkMode ? "border-white/10" : "border-slate-200";

  const unitTypes = Object.keys(UNIT_DETAILS);

  const handlePrevUnit = () => {
    const idx = selectedUnit ? unitTypes.indexOf(selectedUnit) : 0;
    const newIdx = (idx - 1 + unitTypes.length) % unitTypes.length;
    setSelectedUnit(unitTypes[newIdx]);
  };

  const handleNextUnit = () => {
    const idx = selectedUnit ? unitTypes.indexOf(selectedUnit) : 0;
    const newIdx = (idx + 1) % unitTypes.length;
    setSelectedUnit(unitTypes[newIdx]);
  };

  const handlePrevTerrain = () => {
    handleSetSelectedTerrainIdx(
      (prev) => (prev - 1 + TERRAIN_LIST.length) % TERRAIN_LIST.length,
    );
  };

  const handleNextTerrain = () => {
    handleSetSelectedTerrainIdx((prev) => (prev + 1) % TERRAIN_LIST.length);
  };

  const getPortfolioProps = () => {
    if (!selectedUnit) return null;

    const details = UNIT_DETAILS[selectedUnit];
    const colors = unitColorMap[selectedUnit];
    const unit = INITIAL_ARMY.find((u) => u.type === selectedUnit);

    if (!details || !unit || !colors) return null;

    const unitIsProtected =
      selectedTerrainIdx >= 0 &&
      isUnitProtected(
        selectedUnit as PieceType,
        activeTerrainTypeKey as TerrainType,
      );
    const unitCanTraverse =
      selectedTerrainIdx >= 0
        ? canUnitTraverseTerrain(
            selectedUnit as PieceType,
            TERRAIN_LIST[selectedTerrainIdx].terrainTypeKey as TerrainType,
          )
        : true;
    const panelBorderStyle = unitIsProtected
      ? "border-8 border-double"
      : !unitCanTraverse
        ? "border-8 border-dotted"
        : "border-4";

    const idx = unitTypes.indexOf(selectedUnit);
    const prevUnitType =
      unitTypes[(idx - 1 + unitTypes.length) % unitTypes.length];
    const nextUnitType = unitTypes[(idx + 1) % unitTypes.length];
    const prevUnit = INITIAL_ARMY.find((u) => u.type === prevUnitType);
    const nextUnit = INITIAL_ARMY.find((u) => u.type === nextUnitType);

    const terrainItems: TerrainAffinityItem[] = TERRAIN_LIST.map((t) => ({
      name: t.name,
      icon: t.icon,
      bg: t.bg,
      text: t.text,
      border: t.border,
      ring: t.ring,
      isProtected: isUnitProtected(
        selectedUnit as PieceType,
        t.terrainTypeKey as TerrainType,
      ),
      canTraverse: canUnitTraverseTerrain(
        selectedUnit as PieceType,
        t.terrainTypeKey as TerrainType,
      ),
    }));

    return {
      selectedUnit,
      details,
      colors,
      unit,
      prevUnitType,
      nextUnitType,
      prevUnitColors: unitColorMap[prevUnitType],
      nextUnitColors: unitColorMap[nextUnitType],
      PrevIcon: prevUnit?.lucide,
      NextIcon: nextUnit?.lucide,
      handlePrevUnit,
      handleNextUnit,
      terrainItems,
      selectedTerrainIdx,
      onTerrainSelect: handleSetSelectedTerrainIdx,
      textColor,
      subtextColor,
      cardBg,
      borderColor,
      panelBorderStyle,
      darkMode,
    };
  };

  const portfolioProps = getPortfolioProps();

  const portfolioSlot = portfolioProps ? (
    <UnitPortfolio {...portfolioProps} />
  ) : (
    <UnitPortfolio
      selectedUnit={null}
      details={null}
      colors={null}
      unit={null}
      prevUnitType=""
      nextUnitType=""
      prevUnitColors={null}
      nextUnitColors={null}
      handlePrevUnit={handlePrevUnit}
      handleNextUnit={handleNextUnit}
      terrainItems={[]}
      selectedTerrainIdx={-1}
      onTerrainSelect={() => {}}
      textColor={textColor}
      subtextColor={subtextColor}
      cardBg={cardBg}
      borderColor={borderColor}
      panelBorderStyle=""
      darkMode={darkMode}
    />
  );

  const terrainDetailsSlot = (
    <TerrainDetailsPanel
      darkMode={darkMode}
      terrainTypeKey={
        selectedTerrainIdx >= 0
          ? TERRAIN_LIST[selectedTerrainIdx].terrainTypeKey
          : ""
      }
      selectedUnit={selectedUnit || undefined}
      onUnitSelect={setSelectedUnit}
      onPrev={handlePrevTerrain}
      onNext={handleNextTerrain}
      prevTerrainIcon={
        selectedTerrainIdx >= 0
          ? TERRAIN_LIST[
              (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                TERRAIN_LIST.length
            ].icon
          : undefined
      }
      nextTerrainIcon={
        selectedTerrainIdx >= 0
          ? TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length].icon
          : undefined
      }
      prevTerrainColors={
        selectedTerrainIdx >= 0
          ? {
              bg: TERRAIN_LIST[
                (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                  TERRAIN_LIST.length
              ].bg,
              text: TERRAIN_LIST[
                (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                  TERRAIN_LIST.length
              ].text,
              border:
                TERRAIN_LIST[
                  (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                    TERRAIN_LIST.length
                ].border,
            }
          : undefined
      }
      nextTerrainColors={
        selectedTerrainIdx >= 0
          ? {
              bg: TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                .bg,
              text: TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                .text,
              border:
                TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                  .border,
            }
          : undefined
      }
    />
  );

  const simulationPreviewSlot = (
    <SimulationPreview
      darkMode={darkMode}
      selectedUnit={selectedUnit || ""}
      selectedTerrainIdx={selectedTerrainIdx}
      terrainPositions={terrainPositions}
      activeLayoutLabel={activeLayoutLabel}
      activeLayoutIdx={activeLayoutIdx}
      filteredSeedsLength={filteredSeeds.length}
      handlePrevLayout={handlePrevLayout}
      handleNextLayout={handleNextLayout}
      cardBg={cardBg}
    />
  );

  return (
    <TutorialPageLayout
      darkMode={darkMode}
      HeaderSlot={
        <InteractiveHeader
          darkMode={darkMode}
          selectedUnit={selectedUnit || ""}
          onUnitSelect={setSelectedUnit}
          selectedTerrainIdx={selectedTerrainIdx}
          onTerrainSelect={handleSetSelectedTerrainIdx}
          onBack={onBack}
        />
      }
      PortfolioSlot={portfolioSlot}
      TerrainDetailsSlot={terrainDetailsSlot}
      SimulationPreviewSlot={simulationPreviewSlot}
      Divider1={<LogicDivider label="+" />}
      Divider2={<LogicDivider label="=" />}
      FooterSlot={<CopyrightFooter />}
    />
  );
};

export default LearnTutorialView;
