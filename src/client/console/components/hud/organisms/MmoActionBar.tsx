import React, { useState } from "react";
import {
  INITIAL_ARMY,
  PLAYER_CONFIGS,
  TERRAIN_TYPES,
  TERRAIN_INTEL,
} from "@constants";
import {
  ArchitectOrganism,
  TrenchOrganism,
  ChessmanOrganism,
  PlayTurnOrganism,
  ConsoleThemeOrganism,
  PovOrganism,
} from "./index";
import { ActionBarTemplate } from "../templates";
import type { TerrainType, GameStateHook } from "@/shared/types";
import type { PieceStyle } from "@constants";

interface MmoActionBarProps {
  game: GameStateHook;
  logic: {
    placedCount: number;
    maxPlacement: number;
  };
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
}

/**
 * MmoActionBar — Compose the action bar organisms into the structural template.
 */
const MmoActionBar: React.FC<MmoActionBarProps> = ({
  game,
  logic,
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
}) => {
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
    isFlipped,
    setIsFlipped,
    setTurn,
    dispatch,
  } = game;

  const { placedCount, maxPlacement } = logic;

  const [trenchLocked, setTrenchLocked] = useState(false);
  const [chessLocked, setChessLocked] = useState(false);

  const bothLocked = trenchLocked && chessLocked;

  const totalUnitCount = INITIAL_ARMY.reduce(
    (sum, unit) => sum + unit.count,
    0,
  );

  const terrainKeys: TerrainType[] = [
    TERRAIN_TYPES.TREES,
    TERRAIN_TYPES.PONDS,
    TERRAIN_TYPES.RUBBLE,
    TERRAIN_TYPES.DESERT,
  ];

  const terrainItems = terrainKeys.map((tType) => {
    const intel = TERRAIN_INTEL[tType];
    const IconComp = intel?.icon;
    const colorClass = intel?.color?.text || "text-slate-400";
    const isActive = placementTerrain === tType;
    const isDisabled = placedCount >= maxPlacement;

    return {
      key: tType,
      label: intel?.label || tType,
      active: isActive,
      disabled: isDisabled,
      onClick: () => {
        setPlacementTerrain(tType);
        setPlacementPiece(null);
        setSetupMode("terrain");
      },
      icon: IconComp ? (
        <IconComp size={24} className={`${colorClass} drop-shadow-md`} />
      ) : null,
    };
  });

  const chessItems = INITIAL_ARMY.map((unit) => {
    const count =
      (inventory[turn]?.filter((u) => u === unit.type) || []).length || 0;
    const isActive = placementPiece === unit.type;
    const isDisabled = count === 0;

    return {
      key: unit.type,
      label: unit.type.charAt(0).toUpperCase() + unit.type.slice(1),
      badge: count,
      active: isActive,
      disabled: isDisabled,
      onClick: () => {
        setPlacementPiece(unit.type);
        setPlacementTerrain(null);
        setSetupMode("pieces");
      },
      icon: getIcon(
        unit,
        `${PLAYER_CONFIGS[turn]?.text || PLAYER_CONFIGS.red.text} drop-shadow-md`,
        24,
      ),
    };
  });

  return (
    <ActionBarTemplate
      showSetup={gameState !== "play"}
      showPlay={gameState === "play"}
      showPov={gameState === "gamemaster" || !!game.setMode}
      architect={
        <ArchitectOrganism
          gameState={gameState}
          mode={mode}
          setMode={(m) => dispatch(`play ${m}`)}
          chessLocked={chessLocked}
          trenchLocked={trenchLocked}
          bothLocked={bothLocked}
          handleOmega={() => dispatch("board omega")}
          handleClassic={() => dispatch("board pi")}
          handleChi={() => dispatch("board chi")}
          handleRandomize={() => dispatch("board random")}
          handleRules={() => game.setShowRules(true)}
          mirrorBoard={() => dispatch("board mirror")}
        />
      }
      trench={
        <TrenchOrganism
          trenchLocked={trenchLocked}
          setTrenchLocked={setTrenchLocked}
          placedCount={placedCount}
          maxPlacement={maxPlacement}
          items={terrainItems}
        />
      }
      chessmen={
        <ChessmanOrganism
          chessLocked={chessLocked}
          setChessLocked={setChessLocked}
          unitsPlaced={totalUnitCount - (inventory[turn] || []).length}
          totalUnits={totalUnitCount}
          items={chessItems}
        />
      }
      playTurn={
        <PlayTurnOrganism
          activePlayers={activePlayers}
          turn={turn}
          getIcon={getIcon}
        />
      }
      theme={
        <ConsoleThemeOrganism
          darkMode={darkMode}
          pieceStyle={pieceStyle}
          toggleTheme={toggleTheme}
          togglePieceStyle={togglePieceStyle}
        />
      }
      pov={
        <PovOrganism
          perspective={isFlipped ? "south" : "north"}
          onPerspectiveChange={(p) => setIsFlipped?.(p === "south")}
          activePlayers={activePlayers}
          side={turn}
          onSideChange={(s) => setTurn?.(s)}
        />
      }
    />
  );
};

export default MmoActionBar;
