import type { TerrainType, PieceType } from "@/shared/types/game";
import { PIECES } from "@/core/primitives/pieces";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;
export const TERRAIN_TYPES: Record<string, TerrainType> = {
  FLAT: "flat",
  FORESTS: "forests",
  SWAMPS: "swamps",
  MOUNTAINS: "mountains",
  DESERT: "desert",
  // Aliases for compatibility
  TREES: "forests" as TerrainType,
  PONDS: "swamps" as TerrainType,
  RUBBLE: "mountains" as TerrainType,
};

export const MAX_TERRAIN_PER_PLAYER = {
  TWO_PLAYER: 16,
  FOUR_PLAYER: 8,
};

export const TERRAIN_CARDS_PER_TYPE = 32;

export interface TerrainDetail {
  key: string;
  name: string;
  terrainTypeKey: TerrainType;
  label: string;
  desc: string;
  sanctuaryUnits: PieceType[];
  allowedUnits: PieceType[];
  blockedUnits: PieceType[];
  subtitle?: string;
  tagline?: string;
  flavorTitle?: string;
  flavorStats?: string[];
}

export const TERRAIN_INTEL_DATA: Record<string, Omit<TerrainDetail, "key">> = {
  [TERRAIN_TYPES.SWAMPS]: {
    name: "Swamps",
    terrainTypeKey: TERRAIN_TYPES.SWAMPS,
    label: "Swamps",
    desc: "Sanctuary for Rooks. Grants protection from Bishops and Knights. Difficult terrain that slows movement.",
    sanctuaryUnits: [ROOK.id],
    allowedUnits: [KING.id, QUEEN.id, ROOK.id, PAWN.id],
    blockedUnits: [KNIGHT.id, BISHOP.id],
    subtitle: "The Sunken Realm",
    tagline: "Heavy Armor Advantage",
    flavorTitle: "Swamp stats",
    flavorStats: ["Visibility: -40%", "Movement: -2", "Cover: +10"],
  },
  [TERRAIN_TYPES.FORESTS]: {
    name: "Forests",
    terrainTypeKey: TERRAIN_TYPES.FORESTS,
    label: "Forests",
    desc: "Sanctuary for Kings, Queens, Bishops, and Pawns. Grants protection from Rooks and Knights. Impassable for Rooks and Knights.",
    sanctuaryUnits: [KING.id, QUEEN.id, BISHOP.id, PAWN.id],
    allowedUnits: [KING.id, QUEEN.id, BISHOP.id, PAWN.id],
    blockedUnits: [ROOK.id, KNIGHT.id],
    subtitle: "The Whispering Woods",
    tagline: "Natural Cover",
    flavorTitle: "Forest stats",
    flavorStats: ["Visibility: -60%", "Movement: -1", "Cover: +15"],
  },
  [TERRAIN_TYPES.MOUNTAINS]: {
    name: "Mountains",
    terrainTypeKey: TERRAIN_TYPES.MOUNTAINS,
    label: "Mountains",
    desc: "Sanctuary for Knights. Grants protection from Rooks and Bishops. High peaks that block direct movement.",
    sanctuaryUnits: [KNIGHT.id],
    allowedUnits: [KING.id, QUEEN.id, KNIGHT.id, PAWN.id],
    blockedUnits: [ROOK.id, BISHOP.id],
    subtitle: "The Iron Peaks",
    tagline: "High Ground",
    flavorTitle: "Mountain stats",
    flavorStats: ["Visibility: +20%", "Movement: -3", "Cover: +20"],
  },
  [TERRAIN_TYPES.DESERT]: {
    name: "Desert",
    terrainTypeKey: TERRAIN_TYPES.DESERT,
    label: "Deserts",
    desc: "Exclusive zone for Rooks. Immune to non-Rook attacks. Deserts end movement; must exit next turn.",
    sanctuaryUnits: [ROOK.id],
    allowedUnits: [ROOK.id],
    blockedUnits: [KING.id, QUEEN.id, BISHOP.id, KNIGHT.id, PAWN.id],
    subtitle: "The Endless Sands",
    tagline: "Deadly Mirage",
    flavorTitle: "Desert stats",
    flavorStats: ["Visibility: +50%", "Movement: 0", "Cover: -10"],
  },
};

export const TERRAIN_DETAILS: (TerrainDetail & { key: string })[] = Object.keys(
  TERRAIN_INTEL_DATA,
).map((key) => ({
  key,
  ...TERRAIN_INTEL_DATA[key],
}));

export const TERRAIN_LIST = TERRAIN_DETAILS;
export const TERRAIN_INTEL = TERRAIN_INTEL_DATA;
