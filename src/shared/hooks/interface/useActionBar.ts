import React, { useState } from "react";
import {
  TERRAIN_TYPES,
  TERRAIN_INTEL,
  INITIAL_ARMY,
  PLAYER_CONFIGS,
} from "@constants";
import { useWizardState } from "@/shared/hooks/interface/useWizardState";
import type { GameStateHook, GameMode, GameState } from "@tc.types";
import type { StyleChoice } from "@/shared/hooks/interface/useWizardState";

interface UseActionBarLogicProps {
  game: GameStateHook;
  logic: { placedCount: number; maxPlacement: number };
}

export const useActionBar = ({ game, logic }: UseActionBarLogicProps) => {
  const {
    gameState,
    getIcon,
    turn,
    activePlayers,
    inventory,
    placementPiece,
    placementTerrain,
    setPlacementPiece,
    setPlacementTerrain,
    setSetupMode,
    mode,
    dispatch,
    terrain,
  } = game;
  const { placedCount, maxPlacement } = logic;

  const [trenchLocked, setTrenchLocked] = useState(false);
  const [chessLocked, setChessLocked] = useState(false);
  const [styleChoice, setStyleChoice] = useState<StyleChoice>(null);

  const bothLocked = trenchLocked && chessLocked;
  const wizard = useWizardState({
    gameState: gameState as GameState,
    mode,
    activePlayers,
    terrain,
    inventory,
    styleChoice,
  });
  const totalUnitCount = INITIAL_ARMY.reduce(
    (sum, unit) => sum + unit.count,
    0,
  );

  const terrainItems = [
    TERRAIN_TYPES.TREES,
    TERRAIN_TYPES.PONDS,
    TERRAIN_TYPES.RUBBLE,
    TERRAIN_TYPES.DESERT,
  ].map((tType) => {
    const intel = TERRAIN_INTEL[tType];
    const IconComp = intel?.icon;
    const colorClass = intel?.color?.text || "text-slate-400";
    return {
      key: tType,
      label: intel?.label || tType,
      active: placementTerrain === tType,
      disabled: placedCount >= maxPlacement,
      onClick: () => {
        setPlacementTerrain(tType);
        setPlacementPiece(null);
        setSetupMode("terrain");
      },
      icon: IconComp
        ? React.createElement(IconComp, {
            size: 24,
            className: `${colorClass} drop-shadow-md`,
          })
        : null,
      colorClass,
    };
  });

  const chessItems = INITIAL_ARMY.map((unit) => {
    const count = (inventory[turn]?.filter((u) => u === unit.type) || [])
      .length;
    const playerStyle = PLAYER_CONFIGS[turn]?.text || PLAYER_CONFIGS.red.text;
    return {
      key: unit.type,
      label: unit.type.charAt(0).toUpperCase() + unit.type.slice(1),
      badge: count,
      active: placementPiece === unit.type,
      disabled: count === 0,
      onClick: () => {
        setPlacementPiece(unit.type);
        setPlacementTerrain(null);
        setSetupMode("pieces");
      },
      icon: getIcon(unit, `${playerStyle} drop-shadow-md`, 24),
    };
  });

  const handleStyleSelect = (style: StyleChoice) => {
    setStyleChoice(style);
    if (style) dispatch(`board ${style}`);
  };

  const handleModeSelect = (selectedMode: GameMode | null) => {
    dispatch(`play ${selectedMode || "none"}`);
    setStyleChoice(null);
  };

  return {
    trenchLocked,
    setTrenchLocked,
    chessLocked,
    setChessLocked,
    styleChoice,
    setStyleChoice,
    bothLocked,
    wizard,
    totalUnitCount,
    terrainItems,
    chessItems,
    handleStyleSelect,
    handleModeSelect,
  };
};
