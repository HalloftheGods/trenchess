import { PIECES } from "@constants/pieces";
import type { UnitBlueprint } from "@/shared/types";
import {
  movePatternKing as king,
  movePatternKnight as knight,
  tripleBarJump as thirdBarJump,
  movePatternQueen as slidingQueen,
  movePatternRook as slidingRook,
  movePatternBishop as slidingBishop,
  movePatternPawn as pawnStandard,
  movePatternPawnAttack as pawnAttack,
  movePatternKingAttack as kingAttack,
  footsoldierFootstool as orthogonal2,
  fourCornersFortnight as diagonal1,
  doubleBackflip as pawnBackflip,
} from "../mechanics/moves/patterns";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

// --- Blueprints ---

export const UNIT_BLUEPRINTS: Record<string, UnitBlueprint> = {
  [KING]: {
    type: KING,
    movePattern: king,
    newMovePattern: orthogonal2,
    attackPattern: kingAttack,
    sanctuaryTerrain: ["mountains", "forests", "swamps"],
  },
  [QUEEN]: {
    type: QUEEN,
    movePattern: slidingQueen,
    newMovePattern: knight,
    sanctuaryTerrain: ["mountains", "forests", "swamps"],
  },
  [ROOK]: {
    type: ROOK,
    movePattern: slidingRook,
    newMovePattern: diagonal1,
    sanctuaryTerrain: ["swamps"],
  },
  [BISHOP]: {
    type: BISHOP,
    movePattern: slidingBishop,
    newMovePattern: orthogonal2,
    sanctuaryTerrain: ["forests"],
  },
  [KNIGHT]: {
    type: KNIGHT,
    movePattern: knight,
    newMovePattern: thirdBarJump,
    sanctuaryTerrain: ["mountains"],
  },
  [PAWN]: {
    type: PAWN,
    movePattern: pawnStandard,
    newMovePattern: pawnBackflip,
    attackPattern: pawnAttack,
    sanctuaryTerrain: ["mountains", "forests", "swamps"],
  },
};
