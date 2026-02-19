// Intel panel component
import {
  Info,
  Waves,
  Users,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Trees,
  Mountain,
} from "lucide-react";
import { DesertIcon } from "../UnitIcons";
import { getValidMoves } from "../utils/gameLogic";
import { getTraversableTerrains } from "../utils/terrainCompat";
import {
  TERRAIN_TYPES,
  PIECES,
  INITIAL_ARMY,
  TERRAIN_INTEL,
  PLAYER_CONFIGS,
  isUnitProtected,
} from "../constants";
import type {
  GameState,
  SetupMode,
  PieceType,
  TerrainType,
  BoardPiece,
  ArmyUnit,
  UnitIntelPanelEntry,
  TerrainIntelPanelEntry,
} from "../types";

// --- Detailed intel data for the panel ---
const UNIT_INTEL_PANEL: Record<string, UnitIntelPanelEntry> = {
  [PIECES.COMMANDER]: {
    title: "Commander",
    role: "Leader",
    points: "∞",
    movePattern: (r, c) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 1, c - 1],
      [r + 1, c + 1],
    ],
    desc: "The Leader. Capture to win.",
  },
  [PIECES.BATTLEKNIGHT]: {
    title: "BattleKnight",
    role: "Elite",
    points: 9,
    movePattern: (r, c) => {
      const moves: number[][] = [];
      const knightMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];
      knightMoves.forEach(([dr, dc]) => moves.push([r + dr, c + dc]));
      for (let i = 1; i < 8; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
    desc: "Moves like Queen + Horseman. Jump tundra and units in L-shape.",
  },
  [PIECES.TANK]: {
    title: "Tank",
    role: "Heavy Armor",
    points: 5,
    movePattern: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 8; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
      }
      return moves;
    },
    desc: "Traverses Swamps. Claims Tundra.",
  },
  [PIECES.SNIPER]: {
    title: "Sniper",
    role: "Ranged",
    points: 3,
    movePattern: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 8; i++) {
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
    desc: "Hides in Forest. Diagonals only.",
  },
  [PIECES.HORSEMAN]: {
    title: "Horseman",
    role: "Cavalry",
    points: 3,
    movePattern: (r, c) => [
      [r - 2, c - 1],
      [r - 2, c + 1],
      [r - 1, c - 2],
      [r - 1, c + 2],
      [r + 1, c - 2],
      [r + 1, c + 2],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
    desc: "Jumps tundra/units. Agile in Mountains.",
  },
  [PIECES.BOT]: {
    title: "Bot",
    role: "Infantry",
    points: 1,
    movePattern: (r, c) => [[r - 1, c]],
    desc: "Moves forward 1. All-Terrain Walker.",
  },
};

const TERRAIN_INTEL_PANEL: Record<string, TerrainIntelPanelEntry> = {
  [TERRAIN_TYPES.PONDS]: {
    label: "Swamp",
    icon: Waves,
    color: "blue",
    interactions: [
      { unit: "Tank", status: "allow", text: "Pushes Through" },
      { unit: "BattleKnight", status: "allow", text: "Can Enter" },
      { unit: "Bot", status: "allow", text: "Slowly Wades" },
      { unit: "Commander", status: "allow", text: "Can Enter" },
      { unit: "Horseman", status: "block", text: "Bogged Down" },
      { unit: "Sniper", status: "block", text: "Bogged Down" },
    ],
  },
  [TERRAIN_TYPES.TREES]: {
    label: "Forests",
    icon: Trees,
    color: "emerald",
    interactions: [
      { unit: "Sniper", status: "allow", text: "Perfect Cover" },
      { unit: "BattleKnight", status: "allow", text: "Can Enter" },
      { unit: "Bot", status: "allow", text: "Slowly Passes" },
      { unit: "Commander", status: "allow", text: "Can Enter" },
      { unit: "Tank", status: "block", text: "Too Dense" },
      { unit: "Horseman", status: "block", text: "Too Dense" },
    ],
  },
  [TERRAIN_TYPES.RUBBLE]: {
    label: "Mountains",
    icon: Mountain,
    color: "red",
    interactions: [
      { unit: "Horseman", status: "allow", text: "Agile Climb" },
      { unit: "BattleKnight", status: "allow", text: "Can Enter" },
      { unit: "Bot", status: "allow", text: "Climbs Over" },
      { unit: "Commander", status: "allow", text: "Can Enter" },
      { unit: "Tank", status: "block", text: "Too Steep" },
      { unit: "Sniper", status: "block", text: "No Line of Sight" },
    ],
  },
  [TERRAIN_TYPES.DESERT]: {
    label: "Desert",
    icon: DesertIcon,
    color: "amber",
    interactions: [
      { unit: "Tank", status: "allow", text: "Traverses Dunes" },
      { unit: "Others", status: "block", text: "Impassable" },
    ],
  },
};

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
  activePlayers = ["player1", "player2"],
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
                const config = PLAYER_CONFIGS[pid];
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
                  <div
                    key={pid}
                    className={`relative overflow-hidden rounded-2xl border bg-white/50 dark:bg-slate-800/50 p-4 transition-all border-${config.color}-500/20`}
                  >
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${config.bg} shadow-[0_0_10px_rgba(0,0,0,0.3)] animate-pulse`}
                        />
                        <span className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                          {config.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/20 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5">
                          <span className="text-[10px] items-center font-bold uppercase tracking-wider text-slate-400">
                            Army
                          </span>
                          <span
                            className={`text-sm font-black ${config.text} ml-1`}
                          >
                            {armyValue}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/20 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5">
                          <span className="text-[10px] items-center font-bold uppercase tracking-wider text-slate-400">
                            Prisoners
                          </span>
                          <span className="text-sm font-black text-rose-500 ml-1">
                            {captureValue}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Prisoners */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                        <span>Prisoners</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {capturedUnits.length === 0 ? (
                          <span className="text-[10px] text-slate-400 italic pl-1">
                            None
                          </span>
                        ) : (
                          capturedUnits.map((piece, i) => {
                            const unit = INITIAL_ARMY.find(
                              (u) => u.type === piece.type,
                            );
                            if (!unit) return null;
                            const ownerConfig = PLAYER_CONFIGS[piece.player];
                            return (
                              <div
                                key={i}
                                className="flex items-center justify-center w-14 h-14 hover:scale-110 transition-all origin-left bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm text-2xl"
                                title={`Captured ${unit.type} (from ${ownerConfig.name})`}
                              >
                                {getIcon(unit, `w-9 h-9 ${ownerConfig.text}`)}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
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
          <div className="opacity-30 flex flex-col items-center gap-4">
            <Info size={64} className="text-slate-500" />
            <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">
              Select {setupMode === "pieces" ? "Unit" : "Terrain"} <br /> for
              Field Intel
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
                        const canTraverse = traversable.includes(t as any);
                        const colorClass = intel.color;
                        return (
                          <div
                            key={t}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${canTraverse ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/5 border border-red-500/10 opacity-40"}`}
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
                              className={`text-[8px] font-black uppercase ${canTraverse ? "text-emerald-500" : "text-red-400"}`}
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

  if (terrainData.color === "red") {
    bgClass = "bg-red-900/20";
    borderClass = "border-red-500/30";
    textClass = "text-red-500";
  } else if (terrainData.color === "emerald") {
    bgClass = "bg-emerald-900/20";
    borderClass = "border-emerald-500/30";
    textClass = "text-emerald-500";
  } else if (terrainData.color === "blue") {
    bgClass = "bg-blue-900/20";
    borderClass = "border-blue-500/30";
    textClass = "text-blue-500";
  } else if (terrainData.color === "sky") {
    bgClass = "bg-sky-50 dark:bg-sky-900/20";
    borderClass = "border-sky-200 dark:border-sky-500/30";
    bgClass = "bg-sky-50 dark:bg-sky-900/20";
    borderClass = "border-sky-200 dark:border-sky-500/30";
    textClass = "text-sky-500 dark:text-sky-400";
  } else if (terrainData.color === "amber") {
    bgClass = "bg-amber-50 dark:bg-amber-900/20";
    borderClass = "border-amber-200 dark:border-amber-500/30";
    textClass = "text-amber-500 dark:text-amber-400";
  }

  // Helper to render a preview of a unit on this terrain
  const renderTerrainPreview = (unitType: string) => {
    // 3x3 Grid
    const gridSize = 3;
    const center = 1;

    // Map piece string to PieceType
    const pType =
      PIECES[unitType.toUpperCase()] || (unitType === "Bot" ? "bot" : null);
    if (!pType) return null;

    // Create mini board/terrain
    // We want to see if the unit can ENTER the terrain (if in center) or move through it?
    // The textual descriptions say "Can Enter", "Blocked", etc.
    // Let's place the unit in the center (1,1) and surround it with the target terrain.
    // OR place it at (0,1) and make (1,1) the target terrain?
    // Most interactions are about *entering* or *traversing*.
    // Let's try placing unit at center, and filling the WHOLE 3x3 with the terrain.
    // If it can move, it will show valid moves.
    // EXCEPT "Desert" + "Tank" -> "Traverses Dunes".
    // "Forest" + "Tank" -> "Too Dense" (cannot move).

    // Let's make the center current terrain (or flat?) and the surroundings the target terrain.
    // Actually, simply filling the 3x3 with the target terrain is best.
    const miniTerrain = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize).fill(
          unitType === "Horseman" && terrainData.label === "Forest"
            ? TERRAIN_TYPES.TREES // Special case if needed? No, just use terrainData type.
            : TERRAIN_TYPES[
                terrainData.label.toUpperCase() === "MOUNTAINS"
                  ? "RUBBLE"
                  : terrainData.label.toUpperCase() === "SWAMP"
                    ? "PONDS"
                    : terrainData.label.toUpperCase()
              ],
        ),
      );

    // Fix terrain type mapping relying on label is risky if label changes?
    // Let's find key by panel entry?
    // Better: We know the activeData key from how we selected it?
    // activeData doesn't store its key.
    // But `terrainData` came from `TERRAIN_INTEL_PANEL[...]`.
    // Let's assume we can map label back or pass it in.
    // Actually, let's just look at `terrain` prop from parent? No we don't have the key.
    // Let's deduce Type from label.
    let tType = TERRAIN_TYPES.FLAT;
    if (terrainData.label === "Swamp") tType = TERRAIN_TYPES.PONDS;
    if (terrainData.label === "Forest") tType = TERRAIN_TYPES.TREES;
    if (terrainData.label === "Mountains") tType = TERRAIN_TYPES.RUBBLE;
    if (terrainData.label === "Desert") tType = TERRAIN_TYPES.DESERT;

    // Fill 3x3 with this terrain
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        miniTerrain[r][c] = tType;
      }
    }

    // Place unit at center
    const miniBoard = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(null));
    miniBoard[center][center] = { type: pType as PieceType, player: "player1" };

    // Calculate moves
    // We need to pass a "mode" -> standard "2p-ns" is fine
    // We need to pass the board/terrain to getValidMoves
    // BUT `getValidMoves` expects 12x12 board...
    // Our utility function *checks bounds* (nr < BOARD_SIZE).
    // If we pass a 3x3 board, it might break or we have to mock BOARD_SIZE.
    // ACTUALLY: `getValidMoves` imports `BOARD_SIZE` from constants (which is 12).
    // So passing a 3x3 array will cause out of bounds errors probably if it tries to check `terrain[r][c]` where r > 2.
    // We should probably create a full size board for the simulation but only care about the area around user.
    // OR we can make `getValidMoves` accept board size? No, it's imported constant.

    // Workaround: Mock a full board, place unit at 6,6 (center of 12x12), fill surroundings with terrain.
    const simSize = 12; // Must match BOARD_SIZE
    const simCenter = 6;
    const simBoard = Array(simSize)
      .fill(null)
      .map(() => Array(simSize).fill(null));
    const simTerrain = Array(simSize)
      .fill(null)
      .map(() => Array(simSize).fill(TERRAIN_TYPES.FLAT)); // Default flat

    // Fill a small area around center with the target terrain
    for (let r = simCenter - 1; r <= simCenter + 1; r++) {
      for (let c = simCenter - 1; c <= simCenter + 1; c++) {
        simTerrain[r][c] = tType;
      }
    }

    simBoard[simCenter][simCenter] = {
      type: pType as PieceType,
      player: "player1",
    };

    const moves = getValidMoves(
      simCenter,
      simCenter,
      simBoard[simCenter][simCenter]!,
      "player1",
      simBoard,
      simTerrain,
      "2p-ns",
    );

    // Check if unit allows moving into any of the surrounding squares
    // (which are all the target terrain).
    // If moves > 0, shows it can move/interact.

    // We can render just the 3x3 surrounding area.
    return (
      <div className="grid grid-cols-3 gap-[1px] bg-slate-200 dark:bg-slate-700/50 p-[2px] rounded overflow-hidden">
        {[-1, 0, 1].map((dr) =>
          [-1, 0, 1].map((dc) => {
            const fr = simCenter + dr;
            const fc = simCenter + dc;
            const isCenter = dr === 0 && dc === 0;
            const isMove = moves.some(([mr, mc]) => mr === fr && mc === fc);

            let cellColor = "bg-slate-300 dark:bg-white/5";
            if (tType === TERRAIN_TYPES.TREES)
              cellColor = "bg-emerald-200 dark:bg-emerald-900/40";
            if (tType === TERRAIN_TYPES.PONDS)
              cellColor = "bg-blue-200 dark:bg-blue-900/40";
            if (tType === TERRAIN_TYPES.RUBBLE)
              cellColor = "bg-red-200 dark:bg-red-900/40";
            if (tType === TERRAIN_TYPES.DESERT)
              cellColor = "bg-amber-100 dark:bg-amber-900/40";

            return (
              <div
                key={`${dr}-${dc}`}
                className={`w-3 h-3 flex items-center justify-center ${cellColor}`}
              >
                {isCenter && (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
                )}
                {!isCenter && isMove && (
                  <div className="w-1 h-1 rounded-full bg-green-500/80" />
                )}
                {!isCenter && !isMove && (
                  <div className="w-0.5 h-0.5 rounded-full bg-red-500/20" />
                )}
              </div>
            );
          }),
        )}
      </div>
    );
  };

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
                      (rule.unit === "Tank" ? PIECES.TANK : null) ||
                      (rule.unit === "Sniper" ? PIECES.SNIPER : null) ||
                      (rule.unit === "Horseman" ? PIECES.HORSEMAN : null);
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
                      tKey && isUnitProtected(uType as any, tKey);

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
                          className="text-red-600 dark:text-red-400"
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
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {rule.text}
                      </span>
                    </div>
                  </div>
                </div>

                {rule.unit !== "Others" && renderTerrainPreview(rule.unit)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelPanel;
