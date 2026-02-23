// Intel panel component
import { Info, Users, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react";
import { isUnitProtected } from "@/core/rules/gameLogic";
import { getTraversableTerrains } from "@/core/setup/terrainCompat";
import { PIECES, INITIAL_ARMY } from "@/core/data/unitDetails";
import { TERRAIN_INTEL } from "@/core/data/terrainDetails";
import { TERRAIN_TYPES } from "@/core/data/terrainDetails";
import type {
  GameState,
  SetupMode,
  PieceType,
  TerrainType,
  BoardPiece,
  ArmyUnit,
} from "@/shared/types/game";
import type {
  UnitIntelPanelEntry,
  TerrainIntelPanelEntry,
} from "@/shared/types/guide";

import {
  UNIT_INTEL_PANEL,
  TERRAIN_INTEL_PANEL,
} from "@/core/constants/intel.constants";
import { UnitIntelCard } from "../molecules/UnitIntelCard";
import { TerrainPreviewGrid } from "../molecules/TerrainPreviewGrid";

interface IntelPanelProps {
  gameState: GameState;
  setupMode: SetupMode;
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  selectedCell: [number, number] | null;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  pieceStyle: string;
  getIcon: (unit: ArmyUnit, className?: string) => React.ReactNode;
  activePlayers?: string[];
  capturedBy?: Record<string, BoardPiece[]>;
}

const IntelPanel: React.FC<IntelPanelProps> = ({
  gameState,
  setupMode,
  placementPiece,
  placementTerrain,
  selectedCell,
  board,
  terrain,
  pieceStyle: _pieceStyle,
  getIcon,
  activePlayers = ["red", "yellow"],
  capturedBy = {},
}) => {
  let activeData: UnitIntelPanelEntry | TerrainIntelPanelEntry | null = null;
  let activeType: "unit" | "terrain" | null = null;

  if (gameState === "setup" || gameState === "zen-garden") {
    if (setupMode === "pieces" && placementPiece) {
      activeData = UNIT_INTEL_PANEL[placementPiece];
      activeType = "unit";
    } else if (setupMode === "terrain" && placementTerrain) {
      activeData = TERRAIN_INTEL_PANEL[placementTerrain];
      activeType = "terrain";
    }
  } else if (gameState === "play" && selectedCell) {
    const [r, c] = selectedCell;
    const piece = board[r][c];
    if (piece) {
      activeData = UNIT_INTEL_PANEL[piece.type];
      activeType = "unit";
    } else {
      activeData = TERRAIN_INTEL_PANEL[terrain[r][c]];
      activeType = "terrain";
    }
  }

  if (!activeData) {
    if (gameState === "play") {
      // Show Scoreboard / Game Status
      return (
        <div className="xl:col-span-3 order-3">
          <div className="bg-white/60 dark:bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5 sticky top-24 min-h-[400px] flex flex-col gap-4">
            <div className="text-center mb-2">
              <h3 className="text-xl font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Current Intel
              </h3>
            </div>

            <div className="space-y-4">
              {activePlayers.map((pid) => {
                // Calculate army value
                let armyValue = 0;

                // Count current units for this player
                const currentCounts: Record<string, number> = {};
                board.forEach((row) => {
                  row.forEach((cell) => {
                    if (cell && cell.player === pid) {
                      currentCounts[cell.type] =
                        (currentCounts[cell.type] || 0) + 1;
                    }
                  });
                });

                INITIAL_ARMY.forEach((unit) => {
                  const currentParams = UNIT_INTEL_PANEL[unit.type];
                  const count = currentCounts[unit.type] || 0;

                  // Add value for surviving units
                  if (typeof currentParams.points === "number") {
                    armyValue += count * currentParams.points;
                  }
                });

                const capturedUnits = capturedBy[pid] || [];

                // Calculate capture value
                let captureValue = 0;
                capturedUnits.forEach((piece) => {
                  const unitParams = UNIT_INTEL_PANEL[piece.type];
                  if (unitParams && typeof unitParams.points === "number") {
                    captureValue += unitParams.points;
                  }
                });

                return (
                  <UnitIntelCard
                    key={pid}
                    pid={pid}
                    armyValue={armyValue}
                    captureValue={captureValue}
                    capturedUnits={capturedUnits}
                    getIcon={getIcon}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="xl:col-span-3 order-3">
        <div className="bg-white/60 dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 sticky top-24 min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-2 border border-slate-200 dark:border-white/5 shadow-inner">
              <Info size={40} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-1">
              {setupMode === "terrain" ? "Open the Trench" : "Crack the Game"}
            </h3>
            <p className="text-sm font-black text-slate-500 dark:text-slate-400 max-w-[260px] leading-relaxed uppercase tracking-[0.2em]">
              {setupMode === "terrain"
                ? "Lay 16 pieces of trench however you wish."
                : "Lay your Chessmen however you wish."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeType === "unit") {
    const unitData = activeData as UnitIntelPanelEntry;
    const activePieceType =
      placementPiece ||
      (selectedCell && board[selectedCell[0]][selectedCell[1]]?.type);
    const unit = INITIAL_ARMY.find((u) => u.type === activePieceType);

    const previewGridSize = 8;
    const centerRow = 4;
    const centerCol = 3;
    const moves = unitData.movePattern(centerRow, centerCol);

    return (
      <div className="xl:col-span-3 order-3">
        <div className="bg-white/60 dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 sticky top-24 min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <div className="flex items-center gap-6 mb-8 text-left">
              <div
                className={`w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-300 dark:border-slate-700 shadow-xl shrink-0 text-4xl 
                  ${selectedCell && terrain[selectedCell[0]][selectedCell[1]] && isUnitProtected(activePieceType!, terrain[selectedCell[0]][selectedCell[1]]) ? "border-double border-[6px]" : ""}
                `}
              >
                {unit &&
                  getIcon(unit, "w-16 h-16 text-slate-900 dark:text-white")}
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none mb-1">
                  {unitData.title}
                </h3>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    {unitData.role}
                  </p>
                  <span className="text-xs font-black text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/5">
                    {unitData.points === "∞" ? "∞" : unitData.points}{" "}
                    {unitData.points === "∞"
                      ? ""
                      : unitData.points === 1
                        ? "PT"
                        : "PTS"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-200 dark:border-white/5">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">
                Movement Pattern
              </div>
              <div
                className="grid gap-[2px] mx-auto w-64"
                style={{
                  gridTemplateColumns: `repeat(${previewGridSize}, 1fr)`,
                }}
              >
                {Array.from({
                  length: previewGridSize * previewGridSize,
                }).map((_, i) => {
                  const r = Math.floor(i / previewGridSize);
                  const c = i % previewGridSize;
                  const isCenter = r === centerRow && c === centerCol;
                  const isMove = moves.some(([mr, mc]) => mr === r && mc === c);

                  const isDark = (r + c) % 2 === 1;
                  const baseColor = isDark
                    ? "bg-slate-300 dark:bg-white/10"
                    : "bg-slate-200 dark:bg-white/5";

                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-[2px] transition-all flex items-center justify-center ${
                        isCenter
                          ? "bg-slate-900 dark:bg-white z-10 scale-110 shadow-lg"
                          : isMove
                            ? "bg-emerald-500/80 shadow-emerald-500/50 shadow-sm"
                            : baseColor
                      }`}
                    >
                      {isCenter &&
                        unit &&
                        getIcon(unit, "w-4 h-4 text-white dark:text-black")}
                    </div>
                  );
                })}
              </div>
              {unitData.title === "Bot" && (
                <p className="text-[10px] text-center text-slate-400 mt-2 font-bold uppercase">
                  (Direction depends on player)
                </p>
              )}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed text-left border-l-4 border-slate-300 dark:border-slate-700 pl-4 mb-6">
              {unitData.desc}
            </p>

            {/* Terrain Compatibility */}
            {activePieceType &&
              (() => {
                const traversable = getTraversableTerrains(activePieceType);
                const allTerrains = [
                  TERRAIN_TYPES.TREES,
                  TERRAIN_TYPES.PONDS,
                  TERRAIN_TYPES.RUBBLE,
                  TERRAIN_TYPES.DESERT,
                ];
                return (
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-white/5">
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 text-center">
                      Terrain Compatibility
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {allTerrains.map((t) => {
                        const intel = TERRAIN_INTEL[t];
                        if (!intel) return null;
                        const IconComp = intel.icon;
                        const canTraverse = traversable.includes(
                          t as TerrainType,
                        );
                        const colorClass = intel.color;
                        return (
                          <div
                            key={t}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${canTraverse ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-brand-red/5 border border-brand-red/10 opacity-40"}`}
                          >
                            <IconComp
                              size={28}
                              className={
                                canTraverse ? colorClass : "text-slate-500"
                              }
                            />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                              {intel.label}
                            </span>
                            <span
                              className={`text-[8px] font-black uppercase ${canTraverse ? "text-emerald-500" : "text-brand-red"}`}
                            >
                              {canTraverse ? "✓" : "✗"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </div>
    );
  }

  // Terrain intel
  const terrainData = activeData as TerrainIntelPanelEntry;
  let bgClass = "bg-slate-900/20";
  let borderClass = "border-slate-500/30";
  let textClass = "text-slate-500";

  if (terrainData.color === "brand-red") {
    bgClass = "bg-red-900/20";
    borderClass = "border-brand-red/30";
    textClass = "text-brand-red";
  } else if (terrainData.color === "emerald") {
    bgClass = "bg-emerald-900/20";
    borderClass = "border-emerald-500/30";
    textClass = "text-emerald-500";
  } else if (terrainData.color === "brand-blue") {
    bgClass = "bg-blue-900/20";
    borderClass = "border-brand-blue/30";
    textClass = "text-brand-blue";
  } else if (terrainData.color === "sky") {
    bgClass = "bg-sky-50 dark:bg-sky-900/20";
    borderClass = "border-sky-200 dark:border-sky-500/30";
    textClass = "text-sky-500 dark:text-sky-400";
  } else if (terrainData.color === "amber") {
    bgClass = "bg-amber-50 dark:bg-amber-900/20";
    borderClass = "border-amber-200 dark:border-amber-500/30";
    textClass = "text-amber-500 dark:text-amber-400";
  }

  return (
    <div className="xl:col-span-3 order-3">
      <div className="bg-white/60 dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 sticky top-24 min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
          <div className="flex items-center gap-6 mb-8 text-left">
            <div
              className={`w-24 h-24 rounded-2xl flex items-center justify-center border ${bgClass} ${borderClass} shadow-xl shrink-0`}
            >
              <terrainData.icon className={textClass} size={48} />
            </div>
            <div>
              <h3
                className={`text-3xl font-black uppercase tracking-tighter leading-none mb-1 ${textClass}`}
              >
                {terrainData.label}
              </h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Terrain Type
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {terrainData.interactions.map((rule, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const uType =
                      PIECES[rule.unit.toUpperCase()] ||
                      (rule.unit === "Tank" ? PIECES.ROOK : null) ||
                      (rule.unit === "Sniper" ? PIECES.BISHOP : null) ||
                      (rule.unit === "Horseman" ? PIECES.KNIGHT : null);
                    const u = INITIAL_ARMY.find((x) => x.type === uType);

                    // We need to know which terrain this is to check protection
                    let tKey = null;
                    if (terrainData.label === "Swamp")
                      tKey = TERRAIN_TYPES.PONDS;
                    else if (terrainData.label === "Forest")
                      tKey = TERRAIN_TYPES.TREES;
                    else if (terrainData.label === "Mountains")
                      tKey = TERRAIN_TYPES.RUBBLE;
                    else if (terrainData.label === "Desert")
                      tKey = TERRAIN_TYPES.DESERT;

                    const isProtected =
                      tKey && isUnitProtected(uType as PieceType, tKey);

                    return u ? (
                      <div
                        className={
                          isProtected
                            ? "border-double border-2 p-0.5 rounded-lg border-current"
                            : ""
                        }
                      >
                        {getIcon(
                          u,
                          "w-6 h-6 text-slate-700 dark:text-slate-300",
                        )}
                      </div>
                    ) : (
                      <Users size={20} className="text-slate-400" />
                    );
                  })()}
                  <div className="text-left">
                    <span className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 leading-none mb-1">
                      {rule.unit}
                    </span>
                    <div className="flex items-center gap-1">
                      {rule.status === "allow" && (
                        <ThumbsUp
                          size={12}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                      )}
                      {rule.status === "block" && (
                        <ThumbsDown
                          size={12}
                          className="text-brand-red dark:text-brand-red"
                        />
                      )}
                      {rule.status === "special" && (
                        <AlertTriangle
                          size={12}
                          className="text-amber-600 dark:text-amber-400"
                        />
                      )}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          rule.status === "allow"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : rule.status === "block"
                              ? "text-brand-red dark:text-brand-red"
                              : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {rule.text}
                      </span>
                    </div>
                  </div>
                </div>

                {rule.unit !== "Others" && (
                  <TerrainPreviewGrid
                    unitType={rule.unit}
                    terrainData={terrainData}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelPanel;
