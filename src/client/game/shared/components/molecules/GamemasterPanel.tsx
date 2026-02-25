import React, { useMemo } from "react";
import {
  Zap,
  RotateCcw,
  Bomb,
  Mountain,
  Target,
  User,
  Monitor,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PLAYER_CONFIGS, INITIAL_ARMY } from "@/constants";
import { PlayerTypeToggle } from "../atoms/PlayerTypeToggle";
import { SegmentedControl } from "@molecules/SegmentedControl";
import type { BoardPiece, ArmyUnit, PieceType, TerrainType, GameMode } from "@/shared/types/game";
import { DeploymentTerrainPalette } from "./DeploymentTerrainPalette";
import { DeploymentUnitPalette } from "./DeploymentUnitPalette";

interface GamemasterPanelProps {
  playerID: string;
  mode: GameMode;
  terrain: TerrainType[][];
  board: (BoardPiece | null)[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  playerTypes: Record<string, "human" | "computer">;
  setPlayerType: (pid: string, val: "human" | "computer") => void;
  activePlayers: string[];
  
  // Interactions
  onSelectPlayer: (pid: string) => void;
  onNextCommander: () => void;
  onFinishDeployment: () => void;
  
  // Palette state
  setupMode: "terrain" | "pieces";
  setSetupMode: (mode: "terrain" | "pieces") => void;
  placementPiece: PieceType | null;
  setPlacementPiece: (piece: PieceType | null) => void;
  placementTerrain: TerrainType | null;
  setPlacementTerrain: (terrain: TerrainType | null) => void;
  
  // Utils
  getIcon: (unit: ArmyUnit, className?: string, size?: number | string) => React.ReactNode;
  placedCount: number;
  maxPlacement: number;
}

/**
 * GamemasterPanel — The authoritative control center for the Architect.
 */
export const GamemasterPanel: React.FC<GamemasterPanelProps> = ({
  playerID,
  mode,
  terrain,
  board,
  inventory,
  terrainInventory,
  playerTypes,
  setPlayerType,
  activePlayers,
  onSelectPlayer,
  onNextCommander,
  onFinishDeployment,
  setupMode,
  setSetupMode,
  placementPiece,
  setPlacementPiece,
  placementTerrain,
  setPlacementTerrain,
  getIcon,
  placedCount,
  maxPlacement,
}) => {
  const cfg = PLAYER_CONFIGS[playerID] || PLAYER_CONFIGS.red;
  const playerType = playerTypes[playerID] || "human";

  const totalUnitCount = INITIAL_ARMY.reduce((sum, unit) => sum + unit.count, 0);
  const unitsPlaced = totalUnitCount - (inventory[playerID] || []).length;
  const unitsReady = unitsPlaced >= totalUnitCount;
  const terrainReady = placedCount >= maxPlacement;

  const readiness = useMemo(() => {
    const totalPlaced = unitsPlaced + placedCount;
    const totalMax = totalUnitCount + maxPlacement;
    return Math.floor((totalPlaced / totalMax) * 100);
  }, [unitsPlaced, placedCount, totalUnitCount, maxPlacement]);

  const ribbonBgClass = {
    red: "bg-brand-red",
    blue: "bg-brand-blue",
    yellow: "bg-yellow-500",
    green: "bg-green-600",
  }[playerID] || "bg-slate-500";

  const accentTextClass = {
    red: "text-brand-red",
    blue: "text-brand-blue",
    yellow: "text-yellow-500",
    green: "text-green-600",
  }[playerID] || "text-slate-500";

  const borderClass = {
    red: "border-brand-red",
    blue: "border-brand-blue",
    yellow: "border-yellow-500",
    green: "border-green-600",
  }[playerID] || "border-slate-200";

  return (
    <div className="relative w-80 flex flex-col gap-4">
      <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] p-6 pt-10 border-2 border-slate-200 dark:border-white/10 shadow-2xl relative">
        
        {/* Corner Ribbon */}
        <div className={`ribbon-right ${ribbonBgClass} text-[14px] font-black uppercase tracking-[0.1em] text-white shadow-xl`}>
          PLAYER {playerID}
        </div>

        {/* Player Switcher (Top of panel) */}
        <div className="flex items-center gap-2 mb-6">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-lg font-black uppercase tracking-widest ${accentTextClass}`}>
                        PLAYER {playerID}
                    </h3>
                </div>
                <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 w-fit">
                    {playerType === "human" ? <User size={12} className="text-slate-500" /> : <Monitor size={12} className="text-slate-500" />}
                    <PlayerTypeToggle 
                        turn={playerID}
                        playerTypes={playerTypes}
                        setPlayerTypes={(updater: any) => {
                            const next = typeof updater === 'function' ? updater(playerTypes) : updater;
                            setPlayerType(playerID, next[playerID]);
                        }}
                    />
                </div>
            </div>
        </div>

        {/* Setup Mode Toggle */}
        <div className="mb-6">
            <SegmentedControl
                options={[
                    { 
                        label: (
                            <div className="flex items-center gap-2">
                                <span>TRENCH</span>
                                <small className="opacity-60 text-[10px] font-bold">{placedCount}/{maxPlacement}</small>
                            </div>
                        ), 
                        value: "terrain", 
                        activeColor: ribbonBgClass 
                    },
                    { 
                        label: (
                            <div className="flex items-center gap-2">
                                <span>CHESS</span>
                                <small className="opacity-60 text-[10px] font-bold">{unitsPlaced}/{totalUnitCount}</small>
                            </div>
                        ), 
                        value: "pieces", 
                        activeColor: ribbonBgClass 
                    },
                ]}
                value={setupMode}
                onChange={(val) => setSetupMode(val as "terrain" | "pieces")}
            />
        </div>

        {/* Palette Area */}
        <div className="min-h-[240px] mb-6">
            {setupMode === "terrain" ? (
                <DeploymentTerrainPalette
                    turn={playerID}
                    terrainInventory={terrainInventory}
                    placementTerrain={placementTerrain}
                    setPlacementTerrain={setPlacementTerrain}
                    setPlacementPiece={setPlacementPiece}
                    setSetupMode={setSetupMode}
                    isZen={true}
                    placedCount={placedCount}
                    maxPlacement={maxPlacement}
                />
            ) : (
                <DeploymentUnitPalette
                    turn={playerID}
                    inventory={inventory}
                    placementPiece={placementPiece}
                    setPlacementPiece={setPlacementPiece}
                    setPlacementTerrain={setPlacementTerrain}
                    setSetupMode={setSetupMode}
                    pieceStyle="lucide"
                    getIcon={getIcon}
                />
            )}
        </div>

        {/* Readiness Bar */}
        <div className="space-y-2 mb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Zap size={10} className={accentTextClass} />
                    <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">
                        Readiness
                    </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                    {readiness}%
                </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                <div
                    className={`h-full ${ribbonBgClass} transition-all duration-1000 ease-out`}
                    style={{ width: `${readiness}%` }}
                />
            </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
            <button
                onClick={onNextCommander}
                className="w-full py-4 flex items-center justify-center gap-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-slate-200 dark:border-white/10 group"
            >
                <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                NEXT COMMANDER
            </button>
            
            <button
                onClick={onFinishDeployment}
                className={`w-full py-5 flex items-center justify-center gap-3 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all border-2
                    ${readiness === 100 
                        ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse" 
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-transparent cursor-not-allowed"}`}
            >
                {readiness === 100 ? <CheckCircle2 size={18} /> : null}
                FINISH DEPLOYMENT
            </button>
        </div>
      </div>
    </div>
  );
};
