import type { PlayerConfig } from "./types/game";

// --- Game Identity ---
export const GAME_NAME = "Trenchess";

// --- Board ---
export const BOARD_SIZE = 12;

// --- Terrain Limits & Deck ---
export const MAX_TERRAIN_PER_PLAYER = {
  TWO_PLAYER: 16,
  FOUR_PLAYER: 8, // 8 per player = 32 total
};

// Cards per type in the deck.
// 4 types * 18 = 72 cards total. Enough for 4 players * 16 = 64 cards.
export const TERRAIN_CARDS_PER_TYPE = 32;

// --- Terrain Types ---
// Moved to src/data/terrainDetails.tsx

// --- Sanctuary Protection ---
// Moved to src/utils/gameLogic.ts

// --- Piece Types ---
// Moved to src/data/unitDetails.ts

// --- Player Configs ---
export const PLAYER_CONFIGS: Record<string, PlayerConfig> = {
  player1: {
    name: "NW",
    color: "brand-red",
    text: "text-brand-red",
    bg: "bg-brand-red",
    shadow: "shadow-brand-red/40",
  },
  player2: {
    name: "NE",
    color: "yellow",
    text: "text-yellow-500",
    bg: "bg-yellow-500",
    shadow: "shadow-yellow-900/40",
  },
  player3: {
    name: "SW",
    color: "green",
    text: "text-green-500",
    bg: "bg-green-600",
    shadow: "shadow-green-900/40",
  },
  player4: {
    name: "SE",
    color: "brand-blue",
    text: "text-brand-blue",
    bg: "bg-brand-blue",
    shadow: "shadow-brand-blue/40",
  },
};

// --- Initial Army ---
// Moved to src/data/unitDetails.ts

// --- Unit Intel (simple tooltips) ---
// Moved to src/data/unitDetails.ts

// --- Terrain Intel (simple tooltips) ---
// Moved to src/data/terrainDetails.tsx

// --- Board Styling ---
// Moved to src/utils/boardLayouts.ts

// --- Piece Style Options ---
export const PIECE_STYLES = [
  "emoji",
  "bold",
  "outlined",
  "custom",
  "lucide",
] as const;
export type PieceStyle = (typeof PIECE_STYLES)[number];
