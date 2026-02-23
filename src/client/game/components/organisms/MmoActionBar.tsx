import React, { useState } from "react";
import { Lock, LockOpen, Dices, Pizza, Shell } from "lucide-react";
import { ActionBarPalette } from "../molecules/ActionBarPalette";
import { ActionBarSlot } from "../atoms/ActionBarSlot";
import { TERRAIN_INTEL, TERRAIN_TYPES } from "@/core/configs/terrainDetails";
import { INITIAL_ARMY, PIECES } from "@/core/configs/unitDetails";
import { PLAYER_CONFIGS } from "@/shared/constants/unit.constants";
import ThemeControls from "@/shared/components/molecules/ThemeControls";
import type {
  ArmyUnit,
  PieceType,
  SetupMode,
  TerrainType,
  GameState,
} from "@/core/types/game";
import type { PieceStyle } from "@/shared/constants/unit.constants";

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
  // Elemental terrain
  generateElementalTerrain: () => void;
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
  generateElementalTerrain,
}) => {
  const [trenchLocked, setTrenchLocked] = useState(false);
  const [chessLocked, setChessLocked] = useState(false);

  const bothLocked = trenchLocked && chessLocked;

  const handleRandomize = () => {
    if (bothLocked) return;
    if (!trenchLocked) randomizeTerrain();
    if (!chessLocked) randomizeUnits();
  };

  const handleClassic = () => {
    if (chessLocked) return;
    setClassicalFormation();
    if (!trenchLocked) randomizeTerrain();
  };

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
    const colorClass = intel?.color || "text-stone-400";
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
        ["custom", "lucide"].includes(pieceStyle)
          ? `w-6 h-6 ${PLAYER_CONFIGS[turn]?.text || PLAYER_CONFIGS.red.text} drop-shadow-md`
          : `text-xl ${PLAYER_CONFIGS[turn]?.text || PLAYER_CONFIGS.red.text} drop-shadow-md`,
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
            {/* Trench Palette */}
            <div className="flex items-end gap-1.5">
              <ActionBarSlot
                label={trenchLocked ? "Unlock" : "Lock"}
                active={trenchLocked}
                onClick={() => setTrenchLocked(!trenchLocked)}
              >
                {trenchLocked ? (
                  <Lock size={18} className="text-amber-400" />
                ) : (
                  <LockOpen size={18} className="text-slate-500" />
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
            <div className="flex items-end gap-1.5">
              <ActionBarSlot
                label={chessLocked ? "Unlock" : "Lock"}
                active={chessLocked}
                onClick={() => setChessLocked(!chessLocked)}
              >
                {chessLocked ? (
                  <Lock size={18} className="text-amber-400" />
                ) : (
                  <LockOpen size={18} className="text-slate-500" />
                )}
              </ActionBarSlot>
              <ActionBarPalette
                title={`Chessmen ${16 - (inventory[turn] || []).length}/16`}
                items={chessItems}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* Options */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Options
              </span>
              <div className="flex items-center gap-2">
                <ActionBarSlot
                  label="Classic"
                  disabled={chessLocked}
                  onClick={handleClassic}
                >
                  <Pizza
                    size={18}
                    className={
                      chessLocked ? "text-slate-600" : "text-orange-400"
                    }
                  />
                </ActionBarSlot>
                <ActionBarSlot
                  label="Elemental"
                  disabled={trenchLocked}
                  onClick={generateElementalTerrain}
                >
                  <Shell
                    size={18}
                    className={
                      trenchLocked ? "text-slate-600" : "text-teal-400"
                    }
                  />
                </ActionBarSlot>
                <ActionBarSlot
                  label="Randomize"
                  disabled={bothLocked}
                  onClick={handleRandomize}
                >
                  <Dices
                    size={18}
                    className={bothLocked ? "text-slate-600" : "text-blue-400"}
                  />
                </ActionBarSlot>
              </div>
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
                      ["custom", "lucide"].includes(pieceStyle)
                        ? `w-7 h-7 ${PLAYER_CONFIGS[p]?.text} drop-shadow-md`
                        : `text-2xl ${PLAYER_CONFIGS[p]?.text} drop-shadow-md`,
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
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Theme
          </span>
          <ThemeControls
            darkMode={darkMode}
            pieceStyle={pieceStyle}
            toggleTheme={toggleTheme}
            togglePieceStyle={togglePieceStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default MmoActionBar;
