/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Interactive Tutorial Page
 * Using new 5-column layout.
 */
import React, { useState, useEffect, useMemo } from "react";
import { INITIAL_ARMY } from "@engineConfigs/unitDetails";
import { isUnitProtected } from "@logic/gameLogic";
import { canUnitTraverseTerrain } from "@setup/terrainCompat";
import { UNIT_DETAILS, unitColorMap } from "@engineConfigs/unitDetails";
import { TERRAIN_LIST } from "@constants/terrain.constants";
import type { PieceType, TerrainType } from "@engineTypes/game";
import { deserializeGame } from "@/shared/utils/serialization";
import TerrainDetailsPanel from "@/app/routes/game/components/organisms/TerrainDetailsPanel";
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

interface LearnTutorialViewProps {
  onBack: () => void;
  darkMode: boolean;
}

export const LearnTutorialView: React.FC<LearnTutorialViewProps> = ({
  onBack,
  darkMode,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedTerrainIdx, setSelectedTerrainIdx] = useState<number>(-1);
  const [allSeeds, setAllSeeds] = useState<SeedItem[]>([]);
  const [activeLayoutIdx, setActiveLayoutIdx] = useState<number>(-1);

  useEffect(() => {
    const stored = localStorage.getItem("trenchess_seeds");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (Array.isArray(data)) setAllSeeds(data);
      } catch (e) {
        console.error("Failed to parse seeds", e);
      }
    }
  }, []);

  const activeTerrainTypeKey =
    selectedTerrainIdx >= 0
      ? TERRAIN_LIST[selectedTerrainIdx].terrainTypeKey
      : null;
  const filteredSeeds = useMemo(() => {
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
  }, [allSeeds, activeTerrainTypeKey]);

  useEffect(() => {
    setActiveLayoutIdx(-1);
  }, [selectedTerrainIdx]);

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

  const terrainPositions = useMemo<Set<string> | undefined>(() => {
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
  }, [activeLayoutIdx, filteredSeeds, activeTerrainTypeKey]);

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
    setSelectedTerrainIdx(
      (prev) => (prev - 1 + TERRAIN_LIST.length) % TERRAIN_LIST.length,
    );
  };

  const handleNextTerrain = () => {
    setSelectedTerrainIdx((prev) => (prev + 1) % TERRAIN_LIST.length);
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
      onTerrainSelect: setSelectedTerrainIdx,
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
          ? React.cloneElement(
              TERRAIN_LIST[
                (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                  TERRAIN_LIST.length
              ].icon as React.ReactElement<any>,
              { size: 20 },
            )
          : undefined
      }
      nextTerrainIcon={
        selectedTerrainIdx >= 0
          ? React.cloneElement(
              TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                .icon as React.ReactElement<any>,
              { size: 20 },
            )
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
          onTerrainSelect={setSelectedTerrainIdx}
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
