import React, { useState } from "react";
import {
  Lock,
  LockOpen,
  Dices,
  Pizza,
  Shell,
  Pi,
  LandPlot,
  ShieldQuestion,
  Omega,
  Eye,
} from "lucide-react";
import { ActionBarPalette } from "../molecules/ActionBarPalette";
import { ActionBarSlot } from "../atoms/ActionBarSlot";
import { TERRAIN_TYPES } from "@/constants";
import {
  INITIAL_ARMY,
  PIECES,
  PLAYER_CONFIGS,
  TERRAIN_INTEL,
} from "@/constants";
import ThemeControls from "@/shared/components/molecules/ThemeControls";
import type {
  ArmyUnit,
  PieceType,
  SetupMode,
  TerrainType,
  GameState,
} from "@/shared/types/game";
import type { PieceStyle } from "@/constants";

interface MmoActionBarProps {
  gameState?: GameState;
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  getIcon: (unit: ArmyUnit, className?: string) => React.ReactNode;
  // Setup state
  turn: string;
  activePlayers: string[];
  inventory: Record<string, PieceType[]>;
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  setPlacementPiece: (piece: PieceType | null) => void;
  setPlacementTerrain: (terrain: TerrainType | null) => void;
  setSetupMode: (mode: SetupMode) => void;
  placedCount: number;
  maxPlacement: number;
  // Randomize actions
  randomizeTerrain: () => void;
  randomizeUnits: () => void;

  // Classic formation
  setClassicalFormation: () => void;
  // Chi Garden
  applyChiGarden: () => void;
  // Omega Reset
  resetToOmega: () => void;
}

/**
 * MmoActionBar — MMO-style sticky top bar.
 * Glassmorphism backdrop with Trench (terrain) + Chess (units) palettes,
 * lock toggles, randomizer, and theme controls.
 */
const MmoActionBar: React.FC<MmoActionBarProps> = ({
  gameState,
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  getIcon,
  turn,
  activePlayers,
  inventory,
  placementPiece,
  placementTerrain,
  setPlacementPiece,
  setPlacementTerrain,
  setSetupMode,
  placedCount,
  maxPlacement,
  randomizeTerrain,
  randomizeUnits,
  setClassicalFormation,
  applyChiGarden,
  resetToOmega,
}) => {
  const [trenchLocked, setTrenchLocked] = useState(false);
  const [chessLocked, setChessLocked] = useState(false);

  const bothLocked = trenchLocked && chessLocked;

  const handleRandomize = () => {
    if (bothLocked) return;
    if (!trenchLocked && !chessLocked) {
      // If both unlocked, do a full tactical re-roll
      randomizeTerrain();
      randomizeUnits();
    } else {
      if (!trenchLocked) randomizeTerrain();
      if (!chessLocked) randomizeUnits();
    }
  };

  const handleClassic = () => {
    if (chessLocked) return;
    setClassicalFormation();
  };

  const handleChi = () => {
    if (chessLocked && trenchLocked) return;
    applyChiGarden();
  };

  const handleOmega = () => {
    resetToOmega();
  };

  const totalUnitCount = INITIAL_ARMY.reduce(
    (sum, unit) => sum + unit.count,
    0,
  );

  // Build terrain items
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

  // Build chess unit items
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
    <div className="fixed top-4 left-0 right-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="
          pointer-events-auto
          flex items-center gap-4 px-5 py-3
          bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl
          border-b border-black/[0.05] dark:border-white/[0.06]
          shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]
          rounded-b-2xl"
      >
        {gameState !== "play" && (
          <>
            {/* Options */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <ActionBarSlot
                  label="Omega"
                  hoverIcon={<Omega size={20} className="text-red-400" />}
                  onClick={handleOmega}
                >
                  <Eye size={20} className="text-slate-500" />
                </ActionBarSlot>
                <ActionBarSlot
                  label="Pi"
                  disabled={chessLocked}
                  hoverIcon={<Pi size={20} className="text-orange-400" />}
                  onClick={handleClassic}
                >
                  <Pizza
                    size={20}
                    className={
                      chessLocked ? "text-slate-600" : "text-amber-400"
                    }
                  />
                </ActionBarSlot>
                <ActionBarSlot
                  label="Chi"
                  disabled={chessLocked && trenchLocked}
                  hoverIcon={<LandPlot size={20} className="text-teal-400" />}
                  onClick={handleChi}
                >
                  <Shell
                    size={20}
                    className={
                      chessLocked && trenchLocked
                        ? "text-slate-600"
                        : "text-emerald-400"
                    }
                  />
                </ActionBarSlot>
                <ActionBarSlot
                  label="Random"
                  disabled={bothLocked}
                  hoverIcon={
                    <ShieldQuestion size={20} className="text-blue-400" />
                  }
                  onClick={handleRandomize}
                >
                  <Dices
                    size={20}
                    className={bothLocked ? "text-slate-600" : "text-sky-400"}
                  />
                </ActionBarSlot>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Quick Game Modes
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* Trench Palette */}
            <div className="flex items-start gap-1.5">
              <ActionBarSlot
                label={trenchLocked ? "Unlock" : "Lock"}
                active={trenchLocked}
                onClick={() => setTrenchLocked(!trenchLocked)}
              >
                {trenchLocked ? (
                  <Lock size={20} className="text-amber-400" />
                ) : (
                  <LockOpen size={20} className="text-slate-500" />
                )}
              </ActionBarSlot>
              <ActionBarPalette
                title={`Trench ${placedCount}/${maxPlacement}`}
                items={terrainItems}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent" />

            {/* Chess Palette */}
            <div className="flex items-start gap-1.5">
              <ActionBarSlot
                label={chessLocked ? "Unlock" : "Lock"}
                active={chessLocked}
                onClick={() => setChessLocked(!chessLocked)}
              >
                {chessLocked ? (
                  <Lock size={20} className="text-amber-400" />
                ) : (
                  <LockOpen size={20} className="text-slate-500" />
                )}
              </ActionBarSlot>
              <ActionBarPalette
                title={`Chessmen ${totalUnitCount - (inventory[turn] || []).length}/${totalUnitCount}`}
                items={chessItems}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </>
        )}

        {gameState === "play" && (
          <>
            {/* Players Turn Indicator */}
            <div className="flex items-center gap-3 px-2">
              {activePlayers.map((p) => {
                const isTurn = turn === p;
                return (
                  <div
                    key={p}
                    className={`transition-all duration-300 ${isTurn ? "opacity-100 scale-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "opacity-30 scale-90"}`}
                    title={PLAYER_CONFIGS[p]?.name || p}
                  >
                    {getIcon(
                      INITIAL_ARMY.find((u) => u.type === PIECES.KING)!,
                      `${PLAYER_CONFIGS[p]?.text} drop-shadow-md`,
                      24,
                    )}
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent mx-2" />
          </>
        )}

        {/* Theme */}
        <div className="flex flex-col items-center gap-1">
          <ThemeControls
            darkMode={darkMode}
            pieceStyle={pieceStyle}
            toggleTheme={toggleTheme}
            togglePieceStyle={togglePieceStyle}
          />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Theme
          </span>
        </div>
      </div>
    </div>
  );
};

export default MmoActionBar;
