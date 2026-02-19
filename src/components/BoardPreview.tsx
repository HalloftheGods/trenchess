import React from "react";
import {
  BOARD_SIZE,
  getQuadrantBaseStyle,
  INITIAL_ARMY,
  PIECES,
  PLAYER_CONFIGS,
  TERRAIN_TYPES,
  type PieceStyle,
} from "../constants";
import type { GameMode, ArmyUnit, PieceType, TerrainType } from "../types";
import { Edit } from "lucide-react";
import { deserializeGame, adaptSeedToMode } from "../utils/gameUrl";
import { TERRAIN_INTEL } from "../constants";
import { TerraForm } from "../utils/TerraForm";

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
}) => {
  // Parse custom seed if present
  const seedData = React.useMemo(() => {
    if (customSeed) {
      const parsed = deserializeGame(customSeed);
      // Adapt if necessary (e.g. NS seed in EW mode)
      if (parsed && selectedMode) {
        return adaptSeedToMode(parsed, selectedMode);
      }
      return parsed;
    }
    return null;
  }, [customSeed, selectedMode]);
  // Generate a 12x12 grid
  const grid = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
    const row = Math.floor(i / BOARD_SIZE);
    const col = i % BOARD_SIZE;
    return { row, col };
  });

  const getBorderClasses = () => {
    // Define base border sides for mixing
    const baseT = "border-t-slate-200/30 dark:border-t-white/5";
    const baseB = "border-b-slate-200/30 dark:border-b-white/5";
    const baseL = "border-l-slate-200/30 dark:border-l-white/5";
    const baseR = "border-r-slate-200/30 dark:border-r-white/5";

    let borderColors = "border-slate-200/30 dark:border-white/5"; // Default fallback

    switch (selectedMode) {
      case "2p-ns":
        borderColors = `${baseL} ${baseR} border-t-red-500 border-b-blue-600`;
        break;
      case "2p-ew":
        borderColors = `${baseT} ${baseB} border-l-emerald-500 border-r-yellow-500`;
        break;
      case "2v2":
        borderColors =
          "border-t-orange-500 border-l-purple-500 border-b-teal-500 border-r-lime-500";
        break;
      case "4p":
        // Showdown: Red (Top), Yellow (Right), Blue (Bottom), Green (Left)
        borderColors =
          "border-t-red-500 border-r-yellow-500 border-b-blue-600 border-l-emerald-500";
        break;
    }

    // Add Ready State Glow
    if (isReady) {
      return `${borderColors} ring-4 ring-offset-4 ring-red-600/50 dark:ring-offset-slate-900 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]`;
    }

    return borderColors;
  };

  const getIcon = (unit: ArmyUnit, className = "") => {
    if (pieceStyle === "custom") {
      const Icon = unit.custom;
      return <Icon className={className} />;
    }
    if (pieceStyle === "lucide") {
      const Icon = unit.lucide;
      return <Icon className={className} />;
    }
    return (
      <span className={className}>
        {unit[pieceStyle as "emoji" | "bold" | "outlined"]}
      </span>
    );
  };

  // Generate terrain using TerraForm if needed
  const generatedTerrain = React.useMemo(() => {
    // 0. Forced Terrain (Menu Hover Mode)
    if (forcedTerrain) {
      return TerraForm.generate({
        mode: selectedMode || "2p-ns", // Default to 2p-ns for preview if no mode
        seed: terrainSeed, // Use existing seed prop for consistency or animation
        symmetry: "rotational",
        allowedTypes: [forcedTerrain], // <--- RESTRICTION
      });
    }

    if (seedData && seedData.terrain) return seedData.terrain; // Custom seed

    // Only generate for classic/quick/default modes
    if (
      selectedProtocol &&
      selectedProtocol !== "classic" &&
      selectedProtocol !== "quick" &&
      selectedProtocol !== "terrainiffic"
    )
      return null;

    // Use TerraForm
    // We use the terrainSeed prop for the seed
    return TerraForm.generate({
      mode: selectedMode || "2p-ns",
      seed: terrainSeed,
      symmetry: "rotational",
    });
  }, [selectedMode, selectedProtocol, terrainSeed, seedData, forcedTerrain]);

  // Deterministic pseudo-random terrain generator
  const getTerrainAt = (
    row: number,
    col: number,
    pieceAt: { pieceType: PieceType; player: string } | null,
  ): TerrainType | null => {
    // 1. Custom Seed (Chi Mode) or TerraForm
    // If we have a generated grid, use it
    if (generatedTerrain) {
      const t = generatedTerrain[row][col];
      if (t === TERRAIN_TYPES.FLAT) return null;

      // Logic: terrain cant be placed on a unit that cant traverse it
      // TerraForm doesn't know about unit placement, so we filter valid placements here
      // similar to before
      if (pieceAt) {
        if (
          pieceAt.pieceType === PIECES.TANK &&
          (t === TERRAIN_TYPES.RUBBLE || t === TERRAIN_TYPES.TREES)
        )
          return null;
        if (
          pieceAt.pieceType === PIECES.SNIPER &&
          (t === TERRAIN_TYPES.PONDS || t === TERRAIN_TYPES.RUBBLE)
        )
          return null;
        if (
          pieceAt.pieceType === PIECES.HORSEMAN &&
          (t === TERRAIN_TYPES.TREES || t === TERRAIN_TYPES.PONDS)
        )
          return null;
        if (pieceAt.pieceType === PIECES.BOT) return t;
        if (pieceAt.pieceType === PIECES.COMMANDER) return null;
        if (pieceAt.pieceType === PIECES.BATTLEKNIGHT) return t;
      }
      return t;
    }

    return null;
  };

  const getPlayerAt = (row: number, col: number): string | null => {
    if (!selectedMode) return null;

    if (selectedMode === "2p-ns") {
      return row < 6 ? "player1" : "player4";
    }
    if (selectedMode === "2p-ew") {
      return col < 6 ? "player3" : "player2";
    }
    // 2v2 and 4p use quadrants
    if (row < 6 && col < 6) return "player1";
    if (row < 6 && col >= 6) return "player2";
    if (row >= 6 && col < 6) return "player3";
    return "player4";
  };

  const getPieceAt = (
    row: number,
    col: number,
  ): { pieceType: PieceType; player: string } | null => {
    // 1. Custom Seed (Chi Mode)
    if (seedData && seedData.board) {
      // NOTE: seedData.board is (BoardPiece | null)[][]
      // We need to return { pieceType, player } for compatibility
      const p = seedData.board[row]?.[col];
      if (p) return { pieceType: p.type, player: p.player };
      return null;
    }

    if (
      !selectedMode ||
      (selectedProtocol !== "classic" && selectedProtocol !== "quick")
    )
      return null;

    // Randomize pieces for Alpha (Quick) Protocol
    if (selectedProtocol === "quick") {
      const player = getPlayerAt(row, col);
      if (!player) return null;

      // Seed based on coordinates + terrainSeed for deterministic variation
      const presenceSeed =
        Math.sin(row * 13.5 + col * 31.7 + terrainSeed * 88.3) * 10000;
      const randPresence = presenceSeed - Math.floor(presenceSeed);

      // Chance per mode (approximating 16 pieces per zone)
      // 2P: 72 squares per zone -> 16/72 approx 0.22
      // 4P/2v2: 36 squares per zone -> 16/36 approx 0.44
      const threshold =
        selectedMode === "2p-ns" || selectedMode === "2p-ew" ? 0.22 : 0.44;

      if (randPresence < threshold) {
        const typeSeed =
          Math.sin(row * 99.1 + col * 77.2 + terrainSeed * 50.3) * 10000;
        const pieceOptionValues = Object.values(PIECES);
        const randIndex = Math.floor(
          (typeSeed - Math.floor(typeSeed)) * pieceOptionValues.length,
        );
        return { pieceType: pieceOptionValues[randIndex], player };
      }
      return null;
    }

    let pieceType: PieceType | null = null;
    let player: string = "";

    // 8-wide Standard Army (16 pieces = 2 rows of 8)
    const backRow = [
      PIECES.TANK,
      PIECES.HORSEMAN,
      PIECES.SNIPER,
      PIECES.BATTLEKNIGHT,
      PIECES.COMMANDER,
      PIECES.SNIPER,
      PIECES.HORSEMAN,
      PIECES.TANK,
    ];

    // 2P North vs South (Inner 8x8: Cols 2-9, Rows 2-9)
    if (selectedMode === "2p-ns") {
      // 8-wide centered = Cols 2 to 9
      if (col >= 2 && col <= 9) {
        const cIndex = col - 2;
        // Player 1 (Top)
        if (row === 2) {
          pieceType = backRow[cIndex];
          player = "player1";
        } else if (row === 3) {
          pieceType = PIECES.BOT;
          player = "player1";
        }
        // Player 4 (Bottom)
        else if (row === 9) {
          pieceType = backRow[cIndex];
          player = "player4";
        } else if (row === 8) {
          pieceType = PIECES.BOT;
          player = "player4";
        }
      }
    }

    // 2P East vs West (Inner 8x8: Rows 2-9, Cols 2-9)
    else if (selectedMode === "2p-ew") {
      // 8-high centered = Rows 2 to 9
      if (row >= 2 && row <= 9) {
        const rIndex = row - 2;
        // Player 3 (Left)
        if (col === 2) {
          pieceType = backRow[rIndex];
          player = "player3";
        } else if (col === 3) {
          pieceType = PIECES.BOT;
          player = "player3";
        }

        // Player 2 (Right)
        else if (col === 9) {
          pieceType = backRow[rIndex];
          player = "player2";
        } else if (col === 8) {
          pieceType = PIECES.BOT;
          player = "player2";
        }
      }
    }

    // 2v2 Alliance (Capture the World) - Corner King Formation
    else if (selectedMode === "2v2") {
      // Commander at [0][0] to sit in the absolute corner
      const formation = [
        [PIECES.COMMANDER, PIECES.BATTLEKNIGHT, PIECES.TANK, PIECES.TANK],
        [PIECES.HORSEMAN, PIECES.SNIPER, PIECES.SNIPER, PIECES.HORSEMAN],
        [PIECES.BOT, PIECES.BOT, PIECES.BOT, PIECES.BOT],
        [PIECES.BOT, PIECES.BOT, PIECES.BOT, PIECES.BOT],
      ];

      const getQuadPiece = (
        rOrigin: number,
        cOrigin: number,
        rStep: number,
        cStep: number,
        ply: string,
      ) => {
        const rRel = (row - rOrigin) * rStep;
        const cRel = (col - cOrigin) * cStep;
        if (rRel >= 0 && rRel < 4 && cRel >= 0 && cRel < 4) {
          pieceType = formation[rRel][cRel];
          player = ply;
        }
      };

      // NW (Red) - Corner (0,0)
      getQuadPiece(0, 0, 1, 1, "player1");
      // NE (Yellow) - Corner (0,11)
      getQuadPiece(0, 11, 1, -1, "player2");
      // SW (Green) - Corner (11,0)
      getQuadPiece(11, 0, -1, 1, "player3");
      // SE (Blue) - Corner (11,11)
      getQuadPiece(11, 11, -1, -1, "player4");
    }

    // 4P Ultimate Showdown - Standard Formation
    else if (selectedMode === "4p") {
      const formation = [
        [PIECES.TANK, PIECES.BATTLEKNIGHT, PIECES.COMMANDER, PIECES.TANK],
        [PIECES.HORSEMAN, PIECES.SNIPER, PIECES.SNIPER, PIECES.HORSEMAN],
        [PIECES.BOT, PIECES.BOT, PIECES.BOT, PIECES.BOT],
        [PIECES.BOT, PIECES.BOT, PIECES.BOT, PIECES.BOT],
      ];

      const getQuadPiece = (
        rOrigin: number,
        cOrigin: number,
        rStep: number,
        ply: string,
      ) => {
        const rRel = (row - rOrigin) * rStep;
        const cRel = col - cOrigin;
        if (rRel >= 0 && rRel < 4 && cRel >= 0 && cRel < 4) {
          pieceType = formation[rRel][cRel];
          player = ply;
        }
      };

      // NW (Red)
      getQuadPiece(1, 1, 1, "player1");
      // NE (Yellow)
      getQuadPiece(1, 7, 1, "player2");
      // SW (Green)
      getQuadPiece(10, 1, -1, "player3");
      // SE (Blue)
      getQuadPiece(10, 7, -1, "player4");
    }

    if (!pieceType) return null;

    return { pieceType, player };
  };

  return (
    <div
      className={`group bg-white dark:bg-slate-900 border-4 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden w-full aspect-square flex items-center justify-center transition-all duration-500 ${getBorderClasses()}`}
    >
      {/* CRT Scanline Effect Overlay (Moved within container) */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20 mix-blend-overlay" />

      {/* The Board Visualizer Grid */}
      <div
        className="w-full h-full grid grid-cols-12 gap-0.5 relative z-10"
        style={{
          gridTemplateRows: "repeat(12, minmax(0, 1fr))",
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transform: "rotateX(20deg) scale(0.9)",
        }}
      >
        {grid.map(({ row, col }) => {
          const blandStyle = getQuadrantBaseStyle(row, col, "neutral");

          // Standard Bland Mode - only if no mode AND no terrain icons requested
          if (!selectedMode && !showTerrainIcons) {
            return (
              <div
                key={`${row}-${col}`}
                className={`${blandStyle} rounded-[1px] transition-all duration-500`}
              />
            );
          }

          const baseStyle = selectedMode
            ? getQuadrantBaseStyle(row, col, selectedMode)
            : blandStyle;
          const pieceInfo = getPieceAt(row, col);
          const terrain = getTerrainAt(row, col, pieceInfo);

          let cellStyle = baseStyle;

          if (terrain) {
            // Apply terrain coloring
            if (terrain === TERRAIN_TYPES.TREES)
              cellStyle = "bg-emerald-800/80 border-emerald-600/50"; // Forest
            else if (terrain === TERRAIN_TYPES.PONDS)
              cellStyle = "bg-blue-800/80 border-blue-600/50"; // Swamp
            else if (terrain === TERRAIN_TYPES.RUBBLE)
              cellStyle = "bg-red-800/80 border-red-600/50"; // Mountain
            else if (terrain === TERRAIN_TYPES.DESERT)
              cellStyle = "bg-amber-200/80 border-amber-300/50"; // Desert
          }

          const TerrainIcon =
            terrain && showTerrainIcons ? TERRAIN_INTEL[terrain]?.icon : null;

          return (
            <div
              key={`${row}-${col}`}
              className={`${cellStyle} rounded-[1px] transition-all duration-500 relative flex items-center justify-center`}
            >
              {TerrainIcon && (
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
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

                    return (
                      <div
                        className={`flex justify-center items-center pointer-events-none select-none font-bold ${pieceColorClass} leading-none ${
                          pieceStyle !== "emoji" ? "text-xl" : "text-2xl"
                        } w-full h-full`}
                      >
                        {getIcon(unit, "w-[80%] h-[80%] object-contain")}
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
            {selectedMode
              ? selectedMode === "2v2"
                ? "Capture the World"
                : selectedMode === "4p"
                  ? "Ultimate Showdown"
                  : selectedMode === "2p-ns"
                    ? "North vs South"
                    : "East vs West"
              : "Awaiting Protocol"}
          </span>
        </div>
      </div>

      {/* Player Toggles (Absolute Corners) */}
      {selectedMode && playerConfig && onTogglePlayerType && (
        <div className="pointer-events-auto">
          {(selectedMode === "2p-ns"
            ? ["player1", "player4"]
            : selectedMode === "2p-ew"
              ? ["player3", "player2"]
              : ["player1", "player2", "player3", "player4"]
          ).map((pid) => {
            const isComputer = playerConfig[pid] === "computer";
            const config =
              pid === "player1"
                ? { name: "N", color: "red", pos: "top-6 left-6" }
                : pid === "player2"
                  ? { name: "E", color: "yellow", pos: "top-6 right-6" }
                  : pid === "player3"
                    ? { name: "W", color: "green", pos: "bottom-6 left-6" }
                    : { name: "S", color: "blue", pos: "bottom-6 right-6" };

            return (
              <button
                key={pid}
                onClick={() => onTogglePlayerType(pid)}
                className={`absolute ${config.pos} z-40 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all shadow-lg hover:scale-105 ${
                  isComputer
                    ? "bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800"
                    : `bg-white/90 dark:bg-slate-800/90 border-${config.color}-500 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700`
                }`}
                title={`Toggle ${config.name} Player Type`}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-${config.color}-500 shadow-[0_0_8px_currentColor]`}
                />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {config.name}
                </span>
                <div className="w-px h-3 bg-current opacity-20" />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${isComputer ? "text-slate-400" : `text-${config.color}-500`}`}
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
              <div className="bg-red-600/20 p-6 rounded-full backdrop-blur-sm border-4 border-red-500/50 shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                <Edit size={64} className="text-red-500 drop-shadow-lg" />
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
