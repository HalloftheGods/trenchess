import type { GameMode } from "../../game/core/GameMode";
import type { TerrainType } from "../../game/state/TerrainType";
import type { PieceStyle } from "../theme/PieceStyle";

export interface UseBoardPreviewProps {
  selectedMode?: GameMode | null;
  selectedProtocol?: string | null;
  customSeed?: string | null;
  terrainSeed?: number;
  forcedTerrain?: TerrainType | null;
  isReady?: boolean;
  pieceStyle?: PieceStyle;
  hideUnits?: boolean;
}
