import React, { useState, useCallback } from "react";
import AccordionSection from "../atoms/AccordionSection";
import JsonTreeViewer from "../atoms/JsonTreeViewer";
import type { Ctx } from "boardgame.io";
import type {
  GameState,
  GameMode,
  SetupMode,
  PieceType,
  TerrainType,
  TrenchessState,
} from "@/shared/types";
import type { MultiplayerPlayer } from "@/shared/types/multiplayer";

interface OnlineInfo {
  roomId: string | null;
  playerIndex: number | null;
  isHost: boolean;
  isConnected: boolean;
  players: MultiplayerPlayer[];
  serverUrl: string;
}

interface DebugRowProps {
  label: string;
  children: React.ReactNode;
}

const DebugRow: React.FC<DebugRowProps> = ({ label, children }) => (
  <div className="flex justify-between gap-3">
    <span className="text-slate-500 whitespace-nowrap">{label}</span>
    <span className="text-slate-700 dark:text-slate-200 text-right truncate">
      {children}
    </span>
  </div>
);

interface GameStateDebugProps {
  gameState: GameState;
  mode: GameMode;
  turn: string;
  setupMode: SetupMode;
  activePlayers: string[];
  getPlayerDisplayName: (pid: string) => string;
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  isFlipped: boolean;
  inventoryCounts: Record<string, number>;
  terrainInventoryCounts: Record<string, number>;
  placedCount: number;
  maxPlacement: number;
  setGameState?: (state: GameState) => void;
  setMode?: (mode: GameMode) => void;
  setTurn?: (turn: string) => void;
  setSetupMode?: (mode: SetupMode) => void;
  readyPlayers?: Record<string, boolean>;
  setReadyPlayers?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  playerTypes?: Record<string, "human" | "computer">;
  setPlayerTypes?: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
  localPlayerName?: string;
  setLocalPlayerName?: (name: string) => void;
  setActivePlayers?: (players: string[]) => void;
  showBgDebug?: boolean;
  setShowBgDebug?: (show: boolean) => void;
  bgioState?: { G: TrenchessState; ctx: Ctx } | null;
  onlineInfo?: OnlineInfo;
  isSheet?: boolean;
}

/**
 * GameStateDebug (Organism)
 * Primary developer diagnostic tool for inspecting and manipulating real-time game state.
 */
const GameStateDebug: React.FC<GameStateDebugProps> = ({
  gameState,
  mode,
  turn,
  setupMode,
  activePlayers,
  getPlayerDisplayName,
  placementPiece,
  placementTerrain,
  isFlipped,
  inventoryCounts,
  terrainInventoryCounts,
  placedCount,
  maxPlacement,
  setGameState,
  setMode,
  setTurn,
  setSetupMode,
  readyPlayers,
  setReadyPlayers,
  playerTypes,
  setPlayerTypes,
  localPlayerName,
  setLocalPlayerName,
  setActivePlayers,
  showBgDebug,
  setShowBgDebug,
  bgioState,
  onlineInfo,
  isSheet = false,
}) => {
  const isOnlineMatch = !!onlineInfo?.roomId;
  const initialActiveSection = isOnlineMatch ? "online" : "game";
  const [activeSection, setActiveSection] = useState<string | null>(initialActiveSection);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    const isAlreadyActive = activeSection === section;
    setActiveSection(isAlreadyActive ? null : section);
  };

  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      const resetCopyStatus = () => setCopiedKey(null);
      setTimeout(resetCopyStatus, 1500);
    });
  }, []);

  const renderGameStateControl = () => {
    const isControlAvailable = !!setGameState;
    if (isControlAvailable) {
      return (
        <select
          className="bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 rounded px-1 outline-none text-right cursor-pointer"
          value={gameState}
          onChange={(event) => setGameState!(event.target.value as GameState)}
        >
          <option value="menu">menu</option>
          <option value="setup">setup</option>
          <option value="play">play</option>
          <option value="library">library</option>
          <option value="how-to-play">how-to-play</option>
          <option value="zen-garden">zen-garden</option>
        </select>
      );
    }
    
    const isSetup = gameState === "setup";
    const isPlay = gameState === "play";
    const statusColor = isSetup ? "text-emerald-400" : isPlay ? "text-amber-400" : "text-slate-400";
    
    return <span className={`font-bold ${statusColor}`}>{gameState}</span>;
  };

  const renderModeControl = () => {
    const isControlAvailable = !!setMode;
    if (isControlAvailable) {
      return (
        <select
          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded px-1 outline-none text-right cursor-pointer"
          value={mode}
          onChange={(event) => setMode!(event.target.value as GameMode)}
        >
          <option value="2p-ns">2p-ns</option>
          <option value="2p-ew">2p-ew</option>
          <option value="4p">4p</option>
        </select>
      );
    }
    return mode;
  };

  const renderTurnControl = () => {
    const isControlAvailable = !!setTurn;
    if (isControlAvailable) {
      return (
        <select
          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded px-1 outline-none text-right max-w-[120px] cursor-pointer"
          value={turn}
          onChange={(event) => setTurn!(event.target.value)}
        >
          {activePlayers.map((playerId) => (
            <option key={playerId} value={playerId}>
              {getPlayerDisplayName(playerId)} ({playerId})
            </option>
          ))}
        </select>
      );
    }
    return `${getPlayerDisplayName(turn)} (${turn})`;
  };

  const renderSetupModeControl = () => {
    const isControlAvailable = !!setSetupMode;
    if (isControlAvailable) {
      return (
        <select
          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded px-1 outline-none text-right cursor-pointer"
          value={setupMode}
          onChange={(event) => setSetupMode!(event.target.value as SetupMode)}
        >
          <option value="terrain">terrain</option>
          <option value="units">units</option>
        </select>
      );
    }
    return setupMode;
  };

  const renderBgDebugControl = () => {
    const isControlAvailable = !!setShowBgDebug;
    if (isControlAvailable) {
      const activeClasses = "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/50";
      const inactiveClasses = "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
      const statusClasses = showBgDebug ? activeClasses : inactiveClasses;
      
      return (
        <button
          onClick={() => setShowBgDebug!(!showBgDebug)}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${statusClasses}`}
        >
          {showBgDebug ? "ON" : "OFF"}
        </button>
      );
    }
    return showBgDebug ? "ON" : "OFF";
  };

  const hasUnitsInInventory = Object.keys(inventoryCounts).length > 0;
  const hasTerrainInInventory = Object.keys(terrainInventoryCounts).length > 0;

  const containerClasses = isSheet
    ? "h-full flex flex-col text-xs font-mono"
    : "bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-xl p-4 text-xs font-mono shadow-xl max-h-[90vh] flex flex-col transition-all duration-300";

  return (
    <div className={containerClasses}>
      {!isSheet && (
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 shrink-0">
          Debug
        </h3>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
        {isOnlineMatch && onlineInfo && (
          <AccordionSection
            title="Online"
            isOpen={activeSection === "online"}
            onToggle={() => toggleSection("online")}
          >
            <div className="space-y-1.5">
              <DebugRow label="Status">
                <span
                  className={`font-bold ${
                    onlineInfo.isConnected
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {onlineInfo.isConnected ? "● Connected" : "○ Offline"}
                </span>
              </DebugRow>
              <DebugRow label="Room Code">
                <span className="flex items-center gap-1.5">
                  <span className="text-amber-300 font-bold tracking-wide">
                    {onlineInfo.roomId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(onlineInfo.roomId!, "room")}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  >
                    {copiedKey === "room" ? "✓" : "copy"}
                  </button>
                </span>
              </DebugRow>
              <DebugRow label="Share Link">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}${window.location.pathname}?room=${onlineInfo.roomId}`,
                      "link",
                    )
                  }
                  className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                >
                  {copiedKey === "link" ? "✓ Copied!" : "Copy Link"}
                </button>
              </DebugRow>
              <DebugRow label="Your Slot">
                {(() => {
                  const isPlayerIndexAvailable = onlineInfo.playerIndex !== null;
                  if (!isPlayerIndexAvailable) return "—";
                  
                  const playerIndexKey = onlineInfo.playerIndex!.toString();
                  const mappedPlayerId = bgioState?.G?.playerMap?.[playerIndexKey];
                  
                  const hasMappedPlayer = !!mappedPlayerId;
                  const displayName = hasMappedPlayer ? getPlayerDisplayName(mappedPlayerId!) : "";
                  
                  return hasMappedPlayer
                    ? `Slot ${onlineInfo.playerIndex} (${displayName})`
                    : `Slot ${onlineInfo.playerIndex}`;
                })()}
              </DebugRow>
              <DebugRow label="Role">
                <span
                  className={
                    onlineInfo.isHost ? "text-amber-400" : "text-slate-300"
                  }
                >
                  {onlineInfo.isHost ? "Host" : "Guest"}
                </span>
              </DebugRow>
              <DebugRow label="Players Joined">
                {onlineInfo.players.length} joined
              </DebugRow>
              <DebugRow label="Server">
                <span className="truncate text-slate-400 text-[9px]">
                  {onlineInfo.serverUrl}
                </span>
              </DebugRow>
            </div>
          </AccordionSection>
        )}

        <AccordionSection
          title="Player Info"
          isOpen={activeSection === "players"}
          onToggle={() => toggleSection("players")}
        >
          <div className="space-y-3 py-1">
            <DebugRow label="Engine CurrentPlayer">
              {bgioState?.ctx?.currentPlayer || "—"}
            </DebugRow>

            <DebugRow label="Local View mapped to">
              {setLocalPlayerName ? (
                <select
                  className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded px-1 outline-none text-right cursor-pointer"
                  value={localPlayerName || ""}
                  onChange={(event) => setLocalPlayerName(event.target.value)}
                >
                  <option value="">(None - use turn)</option>
                  {["red", "blue", "green", "yellow"].map((playerId) => (
                    <option key={playerId} value={playerId}>
                      {playerId}
                    </option>
                  ))}
                </select>
              ) : (
                localPlayerName || "(None)"
              )}
            </DebugRow>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Player States
              </div>
              {["red", "blue", "green", "yellow"].map((playerId) => {
                const isActive = activePlayers.includes(playerId);
                const isReady = readyPlayers?.[playerId] ?? false;
                const playerType = playerTypes?.[playerId] ?? "human";

                return (
                  <div
                    key={playerId}
                    className={`pl-2 border-l-2 ${isActive ? "border-amber-500" : "border-slate-700 opacity-50"} text-[10px]`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="font-bold cursor-pointer"
                        onClick={() => {
                          const isControlAvailable = !!setActivePlayers;
                          if (isControlAvailable) {
                            const updatedPlayers = isActive
                              ? activePlayers.filter((p) => p !== playerId)
                              : [...activePlayers, playerId];
                            setActivePlayers!(updatedPlayers);
                          }
                        }}
                      >
                        {playerId} {isActive ? "(Active)" : "(Inactive)"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500">Ready</span>
                      <input
                        type="checkbox"
                        checked={isReady}
                        onChange={(event) => {
                          const isControlAvailable = !!setReadyPlayers;
                          if (isControlAvailable) {
                            setReadyPlayers!((current) => ({
                              ...current,
                              [playerId]: event.target.checked,
                            }));
                          }
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Type</span>
                      {setPlayerTypes ? (
                        <select
                          className="bg-transparent border border-slate-700 rounded text-right outline-none text-[9px]"
                          value={playerType}
                          onChange={(event) => {
                            const newType = event.target.value as "human" | "computer";
                            setPlayerTypes!((current) => ({
                              ...current,
                              [playerId]: newType,
                            }));
                          }}
                        >
                          <option value="human">Human</option>
                          <option value="computer">Computer</option>
                        </select>
                      ) : (
                        playerType
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Game State"
          isOpen={activeSection === "game"}
          onToggle={() => toggleSection("game")}
        >
          <div className="space-y-1.5">
            <DebugRow label="State">{renderGameStateControl()}</DebugRow>
            <DebugRow label="Mode">{renderModeControl()}</DebugRow>
            <DebugRow label="Turn">{renderTurnControl()}</DebugRow>
            <DebugRow label="Setup Mode">{renderSetupModeControl()}</DebugRow>
            <DebugRow label="Players">
              {activePlayers
                .map((playerId) => `${getPlayerDisplayName(playerId)} (${playerId})`)
                .join(", ")}
            </DebugRow>
            <DebugRow label="Placement Piece">{placementPiece || "—"}</DebugRow>
            <DebugRow label="Placement Terrain">
              {placementTerrain || "—"}
            </DebugRow>
            <DebugRow label="Flipped">{isFlipped ? "Yes" : "No"}</DebugRow>
            <DebugRow label="Terrain Placed">
              {placedCount} / {maxPlacement}
            </DebugRow>
            <DebugRow label="BG.IO Debug">{renderBgDebugControl()}</DebugRow>
          </div>
        </AccordionSection>

        {hasUnitsInInventory && (
          <AccordionSection
            title="Unit Inventory"
            isOpen={activeSection === "units"}
            onToggle={() => toggleSection("units")}
          >
            <div className="space-y-1">
              {Object.entries(inventoryCounts).map(([unitType, count]) => {
                const hasRemaining = count > 0;
                const countColor = hasRemaining ? "text-emerald-400" : "text-slate-600";
                return (
                  <div key={unitType} className="flex justify-between">
                    <span className="text-slate-500">{unitType}</span>
                    <span className={countColor}>{count}</span>
                  </div>
                );
              })}
            </div>
          </AccordionSection>
        )}

        {hasTerrainInInventory && (
          <AccordionSection
            title="Terrain Inventory"
            isOpen={activeSection === "terrain"}
            onToggle={() => toggleSection("terrain")}
          >
            <div className="space-y-1">
              {Object.entries(terrainInventoryCounts).map(([terrainType, count]) => {
                const hasRemaining = count > 0;
                const countColor = hasRemaining ? "text-blue-400" : "text-slate-600";
                return (
                  <div key={terrainType} className="flex justify-between">
                    <span className="text-slate-500">{terrainType}</span>
                    <span className={countColor}>{count}</span>
                  </div>
                );
              })}
            </div>
          </AccordionSection>
        )}

        <AccordionSection
          title="BG.IO — G Object"
          isOpen={activeSection === "bgio-g"}
          onToggle={() => toggleSection("bgio-g")}
        >
          <div className="py-1">
            <JsonTreeViewer
              data={
                (bgioState?.G as unknown as Record<string, unknown>) ?? null
              }
            />
          </div>
        </AccordionSection>

        <AccordionSection
          title="BG.IO — Ctx"
          isOpen={activeSection === "bgio-ctx"}
          onToggle={() => toggleSection("bgio-ctx")}
        >
          <div className="py-1">
            <JsonTreeViewer
              data={
                (bgioState?.ctx as unknown as Record<string, unknown>) ?? null
              }
            />
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};

export default GameStateDebug;
