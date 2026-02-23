import React from "react";
import { useBoardPreview } from "@hooks/useBoardPreview";
import { BOARD_SIZE } from "@constants/core.constants";
import { PLAYER_CONFIGS, type PieceStyle } from "@constants/unit.constants";
import { INITIAL_ARMY } from "@engineConfigs/unitDetails";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import { getQuadrantBaseStyle } from "@setup/boardLayouts";
import type {
  GameMode,
  TerrainType,
} from "@engineTypes/game";
import { Edit, Ban } from "lucide-react";
import { TERRAIN_INTEL } from "@engineConfigs/terrainDetails";
import { TERRAIN_DETAILS } from "@engineConfigs/terrainDetails";

interface BoardPreviewProps {
  selectedMode: GameMode | null;
  selectedProtocol:
    | "classic"
    | "quick"
    | "terrainiffic"
    | "custom"
    | "zen-garden"
    | null;
  darkMode: boolean;
  pieceStyle: PieceStyle;
  isReady?: boolean;
  terrainSeed?: number;
  customSeed?: string;
  playerConfig?: Record<string, "human" | "computer">;
  onTogglePlayerType?: (pid: string) => void;
  showTerrainIcons?: boolean;
  hideUnits?: boolean;
  forcedTerrain?: TerrainType | null;
  highlightOuterSquares?: boolean;
  labelOverride?: string;
}

const BoardPreview: React.FC<BoardPreviewProps> = ({
  selectedMode,
  selectedProtocol,
  pieceStyle,
  isReady,
  terrainSeed = 0,
  customSeed,
  playerConfig,
  onTogglePlayerType,
  showTerrainIcons,
  hideUnits,
  forcedTerrain,
  highlightOuterSquares,
  labelOverride,
}) => {  const {
    getBorderClasses,
    getIcon,
    getTerrainAt,
    getPieceAt,
  } = useBoardPreview({
    selectedMode,
    selectedProtocol: selectedProtocol || null,
    customSeed,
    terrainSeed,
    forcedTerrain,
    isReady,
    pieceStyle,
  });

  // Generate a 12x12 grid
  const grid = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
    const row = Math.floor(i / BOARD_SIZE);
    const col = i % BOARD_SIZE;
    return { row, col };
  });

  return (
    <div
      className={`board-container group ${getBorderClasses()} ${isReady ? "board-glow-ready" : ""}`}
    >
      {/* CRT Scanline Effect Overlay (Moved within container) */}
      <div className="board-crt-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20 mix-blend-overlay" />

      {/* The Board Visualizer Grid */}
      <div
        className="w-full h-full grid grid-cols-12 gap-[2px] relative z-10"
        style={{
          gridTemplateRows: "repeat(12, minmax(0, 1fr))",
        }}
      >
        {grid.map(({ row, col }) => {
          const blandStyle = getQuadrantBaseStyle(row, col, "neutral");

          // Outer Ring Highlight (12x12 vs 8x8)
          const isOuter = row < 2 || row > 9 || col < 2 || col > 9;
          const outerHighlight =
            highlightOuterSquares && isOuter
              ? "ring-1 ring-inset ring-amber-500/60 bg-amber-500/10 animate-pulse shadow-[inset_0_0_15px_rgba(245,158,11,0.4)]"
              : "";

          // Standard Bland Mode - only if no mode AND no terrain icons requested and not terrainiffic
          if (
            !selectedMode &&
            !showTerrainIcons &&
            selectedProtocol !== "terrainiffic"
          ) {
            return (
              <div
                key={`${row}-${col}`}
                className={`${blandStyle} ${outerHighlight} rounded-[1px] transition-all duration-500`}
              />
            );
          }

          const baseStyle = getQuadrantBaseStyle(
            row,
            col,
            selectedMode || "2p-ns",
          );
          const pieceInfo = getPieceAt(row, col);
          const terrain = getTerrainAt(row, col, pieceInfo);

          let cellStyle = baseStyle;

          if (terrain) {
            // Determine if the cell is light or dark square for the checkered pattern
            // (row + col) % 2 === 0 is traditionally the dark square conceptually, or light square, depending on the board's top-left corner.
            const isDarkSquare = (row + col) % 2 !== 0;

            // Apply terrain coloring, mixing in the checkerboard texture
            if (terrain === TERRAIN_TYPES.TREES) {
              const bgClass = isDarkSquare
                ? "bg-emerald-800/90"
                : "bg-emerald-700/80";
              cellStyle = `${bgClass} border-emerald-600/50`;
            } else if (terrain === TERRAIN_TYPES.PONDS) {
              const bgClass = isDarkSquare
                ? "bg-blue-800/90"
                : "bg-blue-700/80";
              cellStyle = `${bgClass} border-blue-600/50`;
            } else if (terrain === TERRAIN_TYPES.RUBBLE) {
              const bgClass = isDarkSquare ? "bg-red-800/90" : "bg-red-700/80";
              cellStyle = `${bgClass} border-red-600/50`;
            } else if (terrain === TERRAIN_TYPES.DESERT) {
              const bgClass = isDarkSquare
                ? "bg-amber-700/40"
                : "bg-amber-600/30";
              cellStyle = `${bgClass} border-amber-600/50`;
            }
          }

          let isSanctuary = false;
          let isBlocked = false;
          let tDetails = null;

          if (selectedProtocol === "terrainiffic" && terrain && pieceInfo) {
            tDetails = TERRAIN_DETAILS.find((t) => t.key === terrain);
            if (tDetails) {
              isSanctuary = tDetails.sanctuaryUnits.includes(
                pieceInfo.pieceType,
              );
              isBlocked = tDetails.blockedUnits.includes(pieceInfo.pieceType);
            }
          }

          if (isSanctuary && tDetails) {
            cellStyle += ` border-dashed border-[3px] shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] z-10`;
          }

          const TerrainIcon =
            terrain && showTerrainIcons ? TERRAIN_INTEL[terrain]?.icon : null;

          return (
            <div
              key={`${row}-${col}`}
              className={`${cellStyle} ${outerHighlight} rounded-[1px] transition-all duration-500 relative flex items-center justify-center`}
            >
              {TerrainIcon && (
                <div className="absolute inset-0 flex items-center justify-center opacity-60">
                  <TerrainIcon
                    size="60%"
                    className="text-white drop-shadow-md"
                  />
                </div>
              )}
              {
                /* Render the unit if present */
                pieceInfo &&
                  !hideUnits &&
                  (() => {
                    const unit = INITIAL_ARMY.find(
                      (u) => u.type === pieceInfo.pieceType,
                    );
                    if (!unit) return null;
                    const config = PLAYER_CONFIGS[pieceInfo.player];
                    const pieceColorClass = config ? config.text : "text-white";

                    let wrapperClass = `flex justify-center items-center pointer-events-none select-none font-bold ${pieceColorClass} leading-none ${
                      pieceStyle !== "emoji" ? "text-xl" : "text-2xl"
                    } w-full h-full relative z-20`;

                    if (isSanctuary && tDetails) {
                      wrapperClass += ` border-double border-4 ${tDetails.color.border} rounded-md bg-black/20 backdrop-blur-sm`;
                    }

                    return (
                      <div className={wrapperClass}>
                        <div
                          className={`w-[80%] h-[80%] flex items-center justify-center ${isBlocked ? "opacity-40 grayscale" : ""}`}
                        >
                          {getIcon(unit, "w-full h-full object-contain")}
                        </div>
                        {isBlocked && (
                          <div className="absolute inset-0 flex items-center justify-center z-30">
                            <Ban
                              className="text-red-500/80 w-3/4 h-3/4 drop-shadow-md"
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()
              }
            </div>
          );
        })}
      </div>

      {/* Overlay Text for Board Type (Centered on Hover) */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="bg-slate-900/90 text-white px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
          <span className="text-sm font-black uppercase tracking-[0.2em] leading-none text-center">
            {labelOverride ||
              (selectedMode
                ? selectedMode === "2v2"
                  ? "Capture the World"
                  : selectedMode === "4p"
                    ? "Ultimate Showdown"
                    : selectedMode === "2p-ns"
                      ? "North vs South"
                      : "East vs West"
                : "Awaiting Protocol")}
          </span>
        </div>
      </div>

      {/* Player Toggles (Absolute Corners) */}
      {selectedMode && playerConfig && onTogglePlayerType && (
        <div className="pointer-events-auto">
          {(selectedMode === "2p-ns"
            ? ["red", "blue"]
            : selectedMode === "2p-ew"
              ? ["green", "yellow"]
              : ["red", "yellow", "green", "blue"]
          ).map((pid) => {
            const isComputer = playerConfig[pid] === "computer";
            const config =
              pid === "red"
                ? { name: "N", color: "brand-red", pos: "top-6 left-6" }
                : pid === "yellow"
                  ? { name: "E", color: "yellow", pos: "top-6 right-6" }
                  : pid === "green"
                    ? { name: "W", color: "green", pos: "bottom-6 left-6" }
                    : {
                        name: "S",
                        color: "brand-blue",
                        pos: "bottom-6 right-6",
                      };

            return (
              <button
                key={pid}
                onClick={() => onTogglePlayerType(pid)}
                className={`absolute ${config.pos} z-40 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all shadow-lg hover:scale-105 ${
                  isComputer
                    ? "bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800"
                    : `bg-white/90 dark:bg-slate-800/90 border-${config.color} text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700`
                }`}
                title={`Toggle ${config.name} Player Type`}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-${config.color} shadow-[0_0_8px_currentColor]`}
                />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {config.name}
                </span>
                <div className="w-px h-3 bg-current opacity-20" />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${isComputer ? "text-slate-400" : `text-${config.color}`}`}
                >
                  {isComputer ? "CPU" : "HUMAN"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Protocol Overlays */}
      {selectedProtocol && selectedProtocol !== "classic" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {selectedProtocol === "custom" && ( // Omega - God Mode
            <div className="animate-in zoom-in-50 duration-500">
              <div className="bg-brand-red/20 p-6 rounded-full backdrop-blur-sm border-4 border-brand-red/50 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
                <Edit size={64} className="text-brand-red drop-shadow-lg" />
              </div>
            </div>
          )}

          {selectedProtocol === "terrainiffic" && ( // Chi - Flow Mode
            // No overlay icon for Chi mode anymore - we show the preview!
            <div className="hidden" />
          )}
        </div>
      )}
    </div>
  );
};

export default BoardPreview;
