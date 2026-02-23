import { useMemo } from "react";
import { PIECES } from "@/client/game/theme";
import { TERRAIN_TYPES } from "@/core/primitives/terrain";
import { deserializeGame, adaptSeedToMode } from "@utils/gameUrl";
import { TerraForm } from "@/core/setup/generateTrench";
import type {
  GameMode,
  PieceType,
  TerrainType,
  ArmyUnit,
  PieceStyle,
} from "@/shared/types";

export interface UseBoardPreviewProps {
  selectedMode: GameMode | null;
  selectedProtocol:
    | "classic"
    | "quick"
    | "terrainiffic"
    | "custom"
    | "zen-garden"
    | null;
  customSeed?: string;
  terrainSeed?: number;
  forcedTerrain?: TerrainType | null;
  isReady?: boolean;
  pieceStyle: PieceStyle;
}

export function useBoardPreview({
  selectedMode,
  selectedProtocol,
  customSeed,
  terrainSeed = 0,
  forcedTerrain,
  isReady,
  pieceStyle,
}: UseBoardPreviewProps) {
  const seedData = useMemo(() => {
    if (customSeed) {
      const parsed = deserializeGame(customSeed);
      if (parsed && selectedMode) {
        return adaptSeedToMode(parsed, selectedMode);
      }
      return parsed;
    }
    return null;
  }, [customSeed, selectedMode]);

  const getBorderClasses = () => {
    const baseT = "border-t-slate-200/30 dark:border-t-white/5";
    const baseB = "border-b-slate-200/30 dark:border-b-white/5";
    const baseL = "border-l-slate-200/30 dark:border-l-white/5";
    const baseR = "border-r-slate-200/30 dark:border-r-white/5";

    let borderColors = "border-slate-200/30 dark:border-white/5";

    switch (selectedMode) {
      case "2p-ns":
        borderColors = `${baseL} ${baseR} border-t-brand-red border-b-brand-blue`;
        break;
      case "2p-ew":
        borderColors = `${baseT} ${baseB} border-l-emerald-500 border-r-yellow-500`;
        break;
      case "2v2":
        borderColors =
          "border-t-orange-500 border-l-purple-500 border-b-teal-500 border-r-lime-500";
        break;
      case "4p":
        borderColors =
          "border-t-brand-red border-r-yellow-500 border-b-brand-blue border-l-emerald-500";
        break;
    }

    if (isReady) {
      return `${borderColors} ring-4 ring-offset-4 ring-brand-red/50 dark:ring-offset-slate-900 shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)]`;
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

  const generatedTerrain = useMemo(() => {
    if (forcedTerrain) {
      return TerraForm.generate({
        mode: selectedMode || "2p-ns",
        seed: terrainSeed,
        symmetry: "rotational",
        allowedTypes: [forcedTerrain],
      });
    }

    if (seedData && seedData.terrain) return seedData.terrain;

    if (
      selectedProtocol &&
      selectedProtocol !== "classic" &&
      selectedProtocol !== "quick" &&
      selectedProtocol !== "terrainiffic"
    )
      return null;

    return TerraForm.generate({
      mode: selectedMode || "2p-ns",
      seed: terrainSeed,
      symmetry: "rotational",
    });
  }, [selectedMode, selectedProtocol, terrainSeed, seedData, forcedTerrain]);

  const getTerrainAt = (
    row: number,
    col: number,
    pieceAt: { pieceType: PieceType; player: string } | null,
  ): TerrainType | null => {
    if (generatedTerrain) {
      const t = generatedTerrain[row][col];
      if (t === TERRAIN_TYPES.FLAT) return null;

      if (pieceAt) {
        if (
          pieceAt.pieceType === PIECES.ROOK &&
          (t === TERRAIN_TYPES.RUBBLE || t === TERRAIN_TYPES.TREES)
        )
          return null;
        if (
          pieceAt.pieceType === PIECES.BISHOP &&
          (t === TERRAIN_TYPES.PONDS || t === TERRAIN_TYPES.RUBBLE)
        )
          return null;
        if (
          pieceAt.pieceType === PIECES.KNIGHT &&
          (t === TERRAIN_TYPES.TREES || t === TERRAIN_TYPES.PONDS)
        )
          return null;
        if (pieceAt.pieceType === PIECES.PAWN) return t;
        if (pieceAt.pieceType === PIECES.KING) return null;
        if (pieceAt.pieceType === PIECES.QUEEN) return t;
      }
      return t;
    }
    return null;
  };

  const getPlayerAt = (row: number, col: number): string | null => {
    const mode = selectedMode || "2p-ns";

    if (mode === "2p-ns") {
      return row < 6 ? "red" : "blue";
    }
    if (mode === "2p-ew") {
      return col < 6 ? "green" : "yellow";
    }
    if (row < 6 && col < 6) return "red";
    if (row < 6 && col >= 6) return "yellow";
    if (row >= 6 && col < 6) return "green";
    return "blue";
  };

  const getPieceAt = (
    row: number,
    col: number,
  ): { pieceType: PieceType; player: string } | null => {
    if (seedData && seedData.board) {
      const p = seedData.board[row]?.[col];
      if (p) return { pieceType: p.type, player: p.player };
      return null;
    }

    const effectiveMode = selectedMode || "2p-ns";

    if (
      selectedProtocol !== "classic" &&
      selectedProtocol !== "quick" &&
      selectedProtocol !== "terrainiffic"
    )
      return null;

    if (selectedProtocol === "quick") {
      const player = getPlayerAt(row, col);
      if (!player) return null;

      const presenceSeed =
        Math.sin(row * 13.5 + col * 31.7 + terrainSeed * 88.3) * 10000;
      const randPresence = presenceSeed - Math.floor(presenceSeed);

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

    const backRow = [
      PIECES.ROOK,
      PIECES.KNIGHT,
      PIECES.BISHOP,
      PIECES.QUEEN,
      PIECES.KING,
      PIECES.BISHOP,
      PIECES.KNIGHT,
      PIECES.ROOK,
    ];

    if (effectiveMode === "2p-ns") {
      if (col >= 2 && col <= 9) {
        const cIndex = col - 2;
        if (row === 2) {
          pieceType = backRow[cIndex];
          player = "red";
        } else if (row === 3) {
          pieceType = PIECES.PAWN;
          player = "red";
        } else if (row === 9) {
          pieceType = backRow[cIndex];
          player = "blue";
        } else if (row === 8) {
          pieceType = PIECES.PAWN;
          player = "blue";
        }
      }
    } else if (effectiveMode === "2p-ew") {
      if (row >= 2 && row <= 9) {
        const rIndex = row - 2;
        if (col === 2) {
          pieceType = backRow[rIndex];
          player = "green";
        } else if (col === 3) {
          pieceType = PIECES.PAWN;
          player = "green";
        } else if (col === 9) {
          pieceType = backRow[rIndex];
          player = "yellow";
        } else if (col === 8) {
          pieceType = PIECES.PAWN;
          player = "yellow";
        }
      }
    } else if (effectiveMode === "2v2") {
      const formation = [
        [PIECES.KING, PIECES.QUEEN, PIECES.ROOK, PIECES.ROOK],
        [PIECES.KNIGHT, PIECES.BISHOP, PIECES.BISHOP, PIECES.KNIGHT],
        [PIECES.PAWN, PIECES.PAWN, PIECES.PAWN, PIECES.PAWN],
        [PIECES.PAWN, PIECES.PAWN, PIECES.PAWN, PIECES.PAWN],
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

      getQuadPiece(0, 0, 1, 1, "red");
      getQuadPiece(0, 11, 1, -1, "yellow");
      getQuadPiece(11, 0, -1, 1, "green");
      getQuadPiece(11, 11, -1, -1, "blue");
    } else if (effectiveMode === "4p") {
      const formation = [
        [PIECES.ROOK, PIECES.QUEEN, PIECES.KING, PIECES.ROOK],
        [PIECES.KNIGHT, PIECES.BISHOP, PIECES.BISHOP, PIECES.KNIGHT],
        [PIECES.PAWN, PIECES.PAWN, PIECES.PAWN, PIECES.PAWN],
        [PIECES.PAWN, PIECES.PAWN, PIECES.PAWN, PIECES.PAWN],
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

      getQuadPiece(1, 1, 1, "red");
      getQuadPiece(1, 7, 1, "yellow");
      getQuadPiece(10, 1, -1, "green");
      getQuadPiece(10, 7, -1, "blue");
    }

    if (!pieceType) return null;

    return { pieceType, player };
  };

  return {
    seedData,
    generatedTerrain,
    getBorderClasses,
    getIcon,
    getTerrainAt,
    getPlayerAt,
    getPieceAt,
  };
}
