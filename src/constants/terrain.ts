import type { TerrainType, TerrainIntel } from "@/shared/types";
import { PIECES } from "./pieces";

export const TERRAIN_TYPES: Record<string, TerrainType> = {
  FLAT: "flat", // Plains - Welcome to all

  // Legacy
  DESERT: "desert", // Desert - One turn only
  FORESTS: "forests", // Forests - Bishop Sanctuary
  SWAMPS: "swamps", // Swamps - Rook Sanctuary
  MOUNTAINS: "mountains", // Mountains - Knight Sanctuary

  // Deprecated
  TREES: "forests",
  PONDS: "swamps",
  RUBBLE: "mountains",
} as const;

const { FORESTS, SWAMPS, MOUNTAINS, DESERT } = TERRAIN_TYPES;
const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

export const MAX_TERRAIN_PER_PLAYER = {
  TWO_PLAYER: 16,
  FOUR_PLAYER: 8,
};

export const TERRAIN_CARDS_PER_TYPE = 32;

export const CORE_TERRAIN_INTEL: Record<string, TerrainIntel> = {
  [SWAMPS]: {
    label: "Swamps",
    desc: "Sanctuary for Rooks. Grants protection from Bishops and Knights. Difficult terrain that slows movement.",
    sanctuaryUnits: [ROOK],
    allowedUnits: [KING, QUEEN, ROOK, PAWN],
    blockedUnits: [KNIGHT, BISHOP],
    subtitle: "The Sunken Realm",
    tagline: "Heavy Armor Advantage",
    flavorTitle: "Swamp stats",
    flavorStats: ["Visibility: -40%", "Movement: -2", "Cover: +10"],
  },
  [FORESTS]: {
    label: "Forests",
    desc: "Sanctuary for Kings, Queens, Bishops, and Pawns. Grants protection from Rooks and Knights. Impassable for Rooks and Knights.",
    sanctuaryUnits: [KING, QUEEN, BISHOP, PAWN],
    allowedUnits: [KING, QUEEN, BISHOP, PAWN],
    blockedUnits: [ROOK, KNIGHT],
    subtitle: "The Whispering Woods",
    tagline: "Natural Cover",
    flavorTitle: "Forest stats",
    flavorStats: ["Visibility: -60%", "Movement: -1", "Cover: +15"],
  },
  [MOUNTAINS]: {
    label: "Mountains",
    desc: "Sanctuary for Knights. Grants protection from Rooks and Bishops. High peaks that block direct movement.",
    sanctuaryUnits: [KNIGHT],
    allowedUnits: [KING, QUEEN, KNIGHT, PAWN],
    blockedUnits: [ROOK, BISHOP],
    subtitle: "The Iron Peaks",
    tagline: "High Ground",
    flavorTitle: "Mountain stats",
    flavorStats: ["Visibility: +20%", "Movement: -3", "Cover: +20"],
  },
  [DESERT]: {
    label: "Deserts",
    desc: "The harsh desert is home to all units, but none can stay for long.",
    sanctuaryUnits: [],
    allowedUnits: [KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN],
    blockedUnits: [],
    subtitle: "The Endless Sands",
    tagline: "Deadly Mirage",
    flavorTitle: "Desert stats",
    flavorStats: ["Visibility: +50%", "Movement: 0", "Cover: -10"],
  },
};
