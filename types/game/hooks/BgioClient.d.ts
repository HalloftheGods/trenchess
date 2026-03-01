import type { Ctx } from "boardgame.io";
import type { GameMode } from "../core/GameMode";
import type { PieceType } from "../game/PieceType";
import type { TerrainType } from "../game/TerrainType";
import type { TrenchessState } from "../game/TrenchessState";

export interface BgioClient {
  moves: {
    ready: (pid?: string, isGM?: boolean) => void;
    placePiece: (
      r: number,
      c: number,
      type: PieceType | null,
      explicitPid?: string,
      isGM?: boolean,
    ) => void;
    placeTerrain: (
      r: number,
      c: number,
      type: TerrainType,
      explicitPid?: string,
      isGM?: boolean,
    ) => void;
    movePiece: (from: [number, number], to: [number, number]) => void;
    forfeit: (pid?: string) => void;
    randomizeTerrain: (pid?: string) => void;
    applyChiGarden: (pid?: string) => void;
    randomizeUnits: (pid?: string) => void;
    setClassicalFormation: (pid?: string, allowExplicit?: boolean) => void;
    resetToOmega: (pid?: string) => void;
    resetTerrain: (pid?: string) => void;
    resetUnits: (pid?: string) => void;
    finishGamemaster: () => void;
    setMode: (mode: GameMode) => void;
    mirrorBoard: (pid?: string) => void;
    setTurn: (pid: string) => void;
    setPhase: (phase: string) => void;
    patchG: (patch: Partial<TrenchessState>) => void;
    setActiveScreen: (screenId: string | undefined) => void;
    initMatch: (mode: GameMode, preset: string | null) => void;
    authorizeMasterProtocol: () => void;
    syncLayout: (config: {
      board: (import("../game/BoardPiece").BoardPiece | null)[][];
      terrain: TerrainType[][];
      inventory: Record<string, PieceType[]>;
      terrainInventory: Record<string, TerrainType[]>;
    }) => void;
  };
  stop: () => void;
  start: () => void;
  subscribe: (
    cb: (state: { G: TrenchessState; ctx: Ctx } | null) => void,
  ) => () => void;
  playerID: string | null;
  matchID: string | null;
  chatMessages?: import("../multiplayer/ChatMessage").ChatMessage[];
  sendChatMessage?: (message: { text: string; playerName?: string }) => void;
}
