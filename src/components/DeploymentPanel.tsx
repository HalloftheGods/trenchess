// Deployment panel component
import { useState, useEffect } from "react";
import {
  Sword,
  RotateCcw,
  Shuffle,
  LayoutGrid,
  Save,
  Sparkles,
  Database,
  Copy,
} from "lucide-react";
import {
  TERRAIN_TYPES,
  PLAYER_CONFIGS,
  INITIAL_ARMY,
  TERRAIN_INTEL,
  MAX_TERRAIN_PER_PLAYER,
} from "../constants";
import { getPlayerCells } from "../utils/setupLogic";
import { serializeGame, deserializeGame } from "../utils/gameUrl";
import type {
  GameState,
  SetupMode,
  PieceType,
  TerrainType,
  ArmyUnit,
  BoardPiece,
  GameMode,
} from "../types";

interface DeploymentPanelProps {
  mode: GameMode;
  terrain: TerrainType[][];
  setTerrain?: (terrain: TerrainType[][]) => void;
  gameState: GameState;
  turn: string;
  setupMode: SetupMode;
  setSetupMode: (mode: SetupMode) => void;
  pieceStyle: string;
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  placementPiece: PieceType | null;
  setPlacementPiece: (piece: PieceType | null) => void;
  placementTerrain: TerrainType | null;
  setPlacementTerrain: (terrain: TerrainType | null) => void;
  activePlayers: string[];
  isAllPlaced: boolean;
  isCurrentPlayerReady?: boolean;
  getIcon: (unit: ArmyUnit, className?: string) => React.ReactNode;
  getPlayerDisplayName: (pid: string) => string;
  setTurn: (turn: string) => void;
  setGameState: (state: GameState) => void;
  setSelectedCell: (cell: null) => void;
  setValidMoves: (moves: number[][]) => void;
  randomizeTerrain: () => void;
  randomizeUnits: () => void;
  setClassicalFormation: () => void;
  mirrorBoard?: () => void;
  inCheck: boolean;
  board: (BoardPiece | null)[][];
  setBoard?: (board: (BoardPiece | null)[][]) => void;
  layoutName?: string;
  setInventory?: (inventory: Record<string, PieceType[]>) => void;
  multiplayer?: any; // Using any to avoid circular deps or complex matching, but ideally MultiplayerState
  localPlayerId?: string;
  playerTypes: Record<string, "human" | "computer">;
  setPlayerTypes: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
}

const DeploymentPanel: React.FC<DeploymentPanelProps> = ({
  mode,
  terrain,
  setTerrain,
  gameState,
  turn,
  setSetupMode,
  pieceStyle,
  inventory,
  terrainInventory,
  placementPiece,
  setPlacementPiece,
  placementTerrain,
  setPlacementTerrain,
  activePlayers,
  isAllPlaced,
  isCurrentPlayerReady,
  getIcon,
  getPlayerDisplayName,
  setTurn,
  setGameState,
  setSelectedCell,
  setValidMoves,
  randomizeTerrain,
  randomizeUnits,
  setClassicalFormation,
  mirrorBoard,
  inCheck,
  board,
  setBoard,
  layoutName,
  setInventory,
  multiplayer,
  playerTypes,
  setPlayerTypes,
}) => {
  const [copied, setCopied] = useState(false);
  const [librarySeeds, setLibrarySeeds] = useState<
    {
      id: string;
      name: string;
      seed: string;
      mode: string;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    if (gameState === "zen-garden") {
      try {
        const stored = localStorage.getItem("trenchess_seeds");
        if (stored) {
          const data = JSON.parse(stored);
          if (Array.isArray(data)) {
            setLibrarySeeds(
              data.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              ),
            );
          }
        }
      } catch (e) {
        console.error("Failed to load seeds from localStorage", e);
      }
    }
  }, [gameState]);

  // Guard against uninitialized state (e.g. during multiplayer sync)
  if (!terrain || !terrain.length || !board || !board.length) {
    return null;
  }

  // Calculate Terrain Placement Limits
  const maxPlacement =
    activePlayers.length === 2
      ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
      : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  const myCells = getPlayerCells(turn, mode);
  let placedCount = 0;
  for (const [r, c] of myCells) {
    if (terrain[r][c] !== TERRAIN_TYPES.FLAT) placedCount++;
  }

  const isZen = gameState === "zen-garden";

  const handleSave = () => {
    const seed = serializeGame(mode, board, terrain, layoutName);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("seed", seed);
      window.history.pushState({}, "", url);
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });

      // Save to local library
      try {
        const stored = localStorage.getItem("trenchess_seeds");
        const currentLibrary = stored ? JSON.parse(stored) : [];
        const newSeed = {
          id: Date.now().toString(),
          name: layoutName || `Untitled ${new Date().toLocaleDateString()}`,
          seed,
          mode,
          createdAt: new Date().toISOString(),
        };

        const updatedLibrary = [newSeed, ...currentLibrary];
        localStorage.setItem("trenchess_seeds", JSON.stringify(updatedLibrary));
        setLibrarySeeds(updatedLibrary);
      } catch (e) {
        console.error("Failed to save to library", e);
      }
    }
  };

  const handleClearBoard = () => {
    if (confirm("Clear entire layout?") && setBoard && setTerrain) {
      setBoard(board.map((row) => row.map(() => null)));
      setTerrain(
        terrain.map((row) => row.map(() => TERRAIN_TYPES.FLAT as TerrainType)),
      );
      if (setInventory) {
        const newInv: Record<string, PieceType[]> = {};
        activePlayers.forEach((p) => {
          newInv[p] = INITIAL_ARMY.flatMap((u) => Array(u.count).fill(u.type));
        });
        setInventory(newInv);
      }
    }
  };

  return (
    <div className="xl:col-span-3 space-y-6 order-2 xl:order-1 sticky top-24">
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-[2.5rem] p-6 border border-slate-200 dark:border-white/5 shadow-2xl flex flex-col max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-xl font-black flex items-center gap-3 uppercase tracking-tighter ${PLAYER_CONFIGS[turn].text}`}
          >
            {isZen ? (
              <Sparkles size={24} className="text-emerald-500" />
            ) : (
              <Sword size={24} />
            )}
            {isZen
              ? "Zen Garden"
              : gameState === "setup"
                ? "Deployment"
                : "Command Center"}
          </h2>

          {!isZen && gameState === "setup" && !multiplayer?.isConnected && (
            <div className="flex bg-slate-100 dark:bg-black/20 rounded-lg p-1 border border-slate-200 dark:border-white/5">
              <button
                onClick={() =>
                  setPlayerTypes((prev) => ({ ...prev, [turn]: "human" }))
                }
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${playerTypes[turn] === "human" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
              >
                Human
              </button>
              <button
                onClick={() =>
                  setPlayerTypes((prev) => ({ ...prev, [turn]: "computer" }))
                }
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${playerTypes[turn] === "computer" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
              >
                CPU
              </button>
            </div>
          )}
        </div>

        {/* Zen Garden: Player Tabs at Top */}
        {isZen && (
          <div className="flex p-1 bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 mb-6">
            {activePlayers.map((pid) => (
              <button
                key={pid}
                onClick={() => setTurn(pid)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  turn === pid
                    ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white cursor-default"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                }`}
              >
                {pid === "player1"
                  ? "Red"
                  : pid === "player2"
                    ? "Yellow"
                    : pid === "player3"
                      ? "Green"
                      : "Blue"}
              </button>
            ))}
          </div>
        )}

        {/* Zen Garden: Name & Player Palette */}

        {(gameState === "setup" || isZen) && (
          <>
            {/* --- Terrain Section --- */}
            <div className="mb-5">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 pl-1 flex justify-between">
                <span>Terrain</span>
                <span
                  className={
                    placedCount >= maxPlacement
                      ? "text-red-400"
                      : "text-slate-500"
                  }
                >
                  {placedCount}/{maxPlacement}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  TERRAIN_TYPES.TREES,
                  TERRAIN_TYPES.PONDS,
                  TERRAIN_TYPES.RUBBLE,
                  TERRAIN_TYPES.DESERT,
                ].map((tType) => {
                  const count =
                    (terrainInventory[turn]?.filter((u) => u === tType) || [])
                      .length || 0;

                  const intel = TERRAIN_INTEL[tType];
                  if (!intel) return null;
                  const IconComp = intel.icon;

                  let colorClass = "text-stone-400";
                  if (intel.color === "emerald")
                    colorClass = "text-emerald-500";
                  if (intel.color === "blue") colorClass = "text-blue-500";
                  if (intel.color === "sky") colorClass = "text-sky-400";

                  return (
                    <button
                      key={tType}
                      disabled={
                        (!isZen && count === 0) ||
                        (isZen && placedCount >= maxPlacement)
                      }
                      onClick={() => {
                        setPlacementTerrain(tType as TerrainType);
                        setPlacementPiece(null);
                        setSetupMode("terrain");
                      }}
                      className={`relative p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${placementTerrain === tType ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-white/10 scale-105" : "border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10"} ${(!isZen && count === 0) || (isZen && placedCount >= maxPlacement) ? "opacity-20 grayscale cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <IconComp size={32} className={colorClass} />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                        {intel.label}
                      </span>
                      {!isZen && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded-full text-[9px] flex items-center justify-center font-black border-2 border-white dark:border-slate-900 shadow-lg">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!isZen && (
                <button
                  onClick={randomizeTerrain}
                  className="w-full mt-2 py-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 hover:border-emerald-400/50 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-emerald-400 hover:text-emerald-300 hover:scale-[1.02] active:scale-95"
                >
                  <Shuffle size={14} /> Randomize Terrain
                </button>
              )}
            </div>

            {/* --- Units Section --- */}
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 pl-1">
                Units{" "}
                {isZen &&
                  `(${
                    turn === "player1"
                      ? "Red"
                      : turn === "player2"
                        ? "Yellow"
                        : turn === "player3"
                          ? "Green"
                          : "Blue"
                  })`}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {INITIAL_ARMY.map((unit) => {
                  const count =
                    (inventory[turn]?.filter((u) => u === unit.type) || [])
                      .length || 0;
                  return (
                    <button
                      key={unit.type}
                      disabled={count === 0}
                      onClick={() => {
                        setPlacementPiece(unit.type);
                        setPlacementTerrain(null);
                        setSetupMode("pieces");
                      }}
                      className={`relative p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${placementPiece === unit.type ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-white/10 scale-105" : "border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10"} ${count === 0 ? "opacity-20 grayscale cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {getIcon(
                        unit,
                        pieceStyle === "custom"
                          ? `w-14 h-14 ${PLAYER_CONFIGS[turn].text}`
                          : `text-5xl ${PLAYER_CONFIGS[turn].text}`,
                      )}
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                        {unit.type}
                      </span>
                      {true && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded-full text-[9px] flex items-center justify-center font-black border-2 border-white dark:border-slate-900 shadow-lg">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!isZen && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={randomizeUnits}
                    className="flex-1 py-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 hover:from-violet-600/30 hover:to-fuchsia-600/30 border border-violet-500/30 hover:border-violet-400/50 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-violet-400 hover:text-violet-300 hover:scale-[1.02] active:scale-95"
                  >
                    <Shuffle size={14} /> Randomize
                  </button>
                  <button
                    onClick={setClassicalFormation}
                    className="flex-1 py-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 hover:border-amber-400/50 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-amber-400 hover:text-amber-300 hover:scale-[1.02] active:scale-95"
                  >
                    <LayoutGrid size={14} /> Classic Formation
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {(gameState === "setup" || isZen) && (
          <div className="mt-auto space-y-3 pt-6">
            {!isZen && !multiplayer?.isConnected && (
              <button
                onClick={() => {
                  const idx = activePlayers.indexOf(turn);
                  const next = activePlayers[(idx + 1) % activePlayers.length];
                  setTurn(next);
                  setPlacementPiece(null);
                  setPlacementTerrain(null);
                }}
                className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <RotateCcw size={16} /> Next Commander
              </button>
            )}

            {!isZen && !multiplayer?.isConnected && (
              <button
                disabled={!isAllPlaced && !isCurrentPlayerReady}
                onClick={() => {
                  if (isAllPlaced) {
                    setGameState("play");
                    setSelectedCell(null);
                    setValidMoves([]);
                  } else {
                    const idx = activePlayers.indexOf(turn);
                    const next =
                      activePlayers[(idx + 1) % activePlayers.length];
                    setTurn(next);
                    setPlacementPiece(null);
                    setPlacementTerrain(null);
                  }
                }}
                className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-tighter transition-all ${
                  isAllPlaced
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer"
                    : isCurrentPlayerReady
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg cursor-pointer"
                      : "bg-slate-100 dark:bg-white/5 opacity-20 cursor-not-allowed"
                }`}
              >
                {isAllPlaced ? "Commence War" : "Finish Deployment"}
              </button>
            )}

            {/* Multiplayer Ready Logic */}
            {!isZen && multiplayer?.isConnected && (
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  {/* Readiness Status of others */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Lobby Status</span>
                    <span>
                      {
                        multiplayer.players.filter(
                          (p: string) => multiplayer.readyPlayers[p],
                        ).length
                      }
                      /{multiplayer.players.length} Ready
                    </span>
                  </div>

                  <div className="flex gap-2 justify-center">
                    {multiplayer.players.map((pid: string, i: number) => {
                      const isReady = multiplayer.readyPlayers[pid];
                      const isMe = pid === multiplayer.socketId;
                      return (
                        <div
                          key={pid}
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isReady ? "bg-emerald-500 border-emerald-400 text-white" : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400"}`}
                          title={isMe ? "You" : `Player ${i + 1}`}
                        >
                          {isReady ? (
                            <Sword size={14} />
                          ) : (
                            <span className="text-[10px]">{i + 1}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {multiplayer.isHost &&
                multiplayer.players.every(
                  (p: string) => multiplayer.readyPlayers[p],
                ) ? (
                  <button
                    onClick={() => {
                      setGameState("play");
                      setSelectedCell(null);
                      setValidMoves([]);
                      // Broadcast start is handled by sync in useGameState
                    }}
                    className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-tighter transition-all bg-amber-500 hover:bg-amber-400 text-white shadow-lg animate-pulse cursor-pointer"
                  >
                    START GAME
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      multiplayer.toggleReady &&
                      multiplayer.socketId &&
                      multiplayer.toggleReady(
                        !multiplayer.readyPlayers[multiplayer.socketId],
                      )
                    }
                    className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-tighter transition-all flex items-center justify-center gap-2 ${
                      multiplayer.socketId &&
                      multiplayer.readyPlayers[multiplayer.socketId]
                        ? "bg-slate-800 dark:bg-slate-700 text-white"
                        : (isCurrentPlayerReady ?? isAllPlaced)
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
                          : "bg-slate-100 dark:bg-white/5 opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!(isCurrentPlayerReady ?? isAllPlaced)}
                  >
                    {multiplayer.socketId &&
                    multiplayer.readyPlayers[multiplayer.socketId]
                      ? "CANCEL READY"
                      : "MARK READY"}
                  </button>
                )}

                {multiplayer.socketId &&
                  multiplayer.readyPlayers[multiplayer.socketId] &&
                  !multiplayer.players.every(
                    (p: string) => multiplayer.readyPlayers[p],
                  ) && (
                    <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                      Waiting for other players...
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        {gameState === "play" && (
          <div className="space-y-6">
            {inCheck && (
              <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-4 text-center animate-pulse">
                <h3 className="text-2xl font-black text-red-500 uppercase tracking-tighter">
                  ⚠️ CHECK DETECTED ⚠️
                </h3>
                <p className="text-red-400 font-bold text-xs uppercase tracking-widest mt-1">
                  Commander Under Threat
                </p>
              </div>
            )}

            {/* Active Field Strategy */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden">
              <div className="bg-slate-100 dark:bg-white/10 px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Active Field Strategy
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${PLAYER_CONFIGS[turn].bg} animate-pulse`}
                />
              </div>
              <div className="p-6 text-center">
                <h3
                  className={`text-2xl font-black tracking-tighter ${PLAYER_CONFIGS[turn].text}`}
                >
                  {getPlayerDisplayName(turn)} DECISION
                </h3>
              </div>
            </div>

            {/* Army Roster */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden">
              <div className="bg-slate-100 dark:bg-white/10 px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Active Army Roster
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${PLAYER_CONFIGS[turn].bg} animate-pulse`}
                />
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {INITIAL_ARMY.map((unit) => {
                  const count = board
                    .flat()
                    .filter(
                      (cell) =>
                        cell?.player === turn && cell?.type === unit.type,
                    ).length;

                  return (
                    <div
                      key={unit.type}
                      className={`relative p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                        count > 0
                          ? "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 shadow-sm"
                          : "bg-slate-100 dark:bg-black/20 border-transparent opacity-40"
                      }`}
                    >
                      {/* Centered Large Icon */}
                      <div className={count > 0 ? "opacity-60" : "opacity-20"}>
                        {getIcon(
                          unit,
                          pieceStyle === "custom"
                            ? `w-14 h-14 ${PLAYER_CONFIGS[turn].text}`
                            : `text-5xl ${PLAYER_CONFIGS[turn].text}`,
                        )}
                      </div>

                      {/* Title Underneath */}
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center leading-none">
                        {unit.type}
                      </span>

                      {/* Count Badge (same as preconfig) */}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded-full text-[9px] flex items-center justify-center font-black border-2 border-white dark:border-slate-900 shadow-lg text-slate-700 dark:text-slate-200">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {isZen && (
        <div className="space-y-3">
          <button
            onClick={mirrorBoard}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-900/20 hover:scale-[1.02] active:scale-95 mb-1"
          >
            <Copy size={18} /> Mirror to Opposite
          </button>
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${copied ? "bg-emerald-600 text-white shadow-emerald-500/25" : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:scale-[1.02]"}`}
          >
            {copied ? (
              "Link Copied!"
            ) : (
              <>
                <Save size={18} /> Save & Share
              </>
            )}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGameState("menu")}
              className="py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 border border-transparent transition-all hover:text-slate-700 dark:hover:text-slate-300"
            >
              Exit Editor
            </button>
            <button
              onClick={handleClearBoard}
              className="py-3 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 transition-all"
            >
              Clear Board
            </button>
          </div>

          {librarySeeds.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                <Database size={12} /> Seed Library
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {librarySeeds.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const parsed = deserializeGame(item.seed);
                      if (parsed && setBoard && setTerrain) {
                        if (
                          confirm(
                            `Load "${item.name}"? Unsaved changes will be lost.`,
                          )
                        ) {
                          setBoard(parsed.board);
                          setTerrain(parsed.terrain);
                          setPlacementPiece(null);
                          setPlacementTerrain(null);
                        }
                      }
                    }}
                    className="w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl p-3 text-left transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/20 group"
                  >
                    <div className="font-bold text-xs text-slate-700 dark:text-slate-200 truncate group-hover:text-amber-500 transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium mt-1 flex justify-between">
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="uppercase tracking-widest opacity-50">
                        {item.mode}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeploymentPanel;
