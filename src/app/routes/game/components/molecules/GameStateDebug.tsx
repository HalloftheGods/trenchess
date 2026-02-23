import React, { useState, useCallback } from "react";
import AccordionSection from "../atoms/AccordionSection";
import JsonTreeViewer from "../atoms/JsonTreeViewer";
import type {
  GameState,
  GameMode,
  SetupMode,
  PieceType,
  TerrainType,
} from "@engineTypes/game";

interface OnlineInfo {
  roomId: string | null;
  playerIndex: number | null;
  isHost: boolean;
  isConnected: boolean;
  players: string[];
  serverUrl: string;
}

interface DebugRowProps {
  label: string;
  children: React.ReactNode;
}

const DebugRow: React.FC<DebugRowProps> = ({ label, children }) => (
  <div className="flex justify-between gap-3">
    <span className="text-slate-500 whitespace-nowrap">{label}</span>
    <span className="text-slate-200 text-right truncate">{children}</span>
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
  setGameState?: (s: GameState) => void;
  setMode?: (m: GameMode) => void;
  setTurn?: (t: string) => void;
  setSetupMode?: (s: SetupMode) => void;
  showBgDebug?: boolean;
  setShowBgDebug?: (val: boolean) => void;
  bgioState?: { G: any; ctx: any } | null;
  onlineInfo?: OnlineInfo;
}

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
  showBgDebug,
  setShowBgDebug,
  bgioState,
  onlineInfo,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(
    onlineInfo?.roomId ? "online" : "game",
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection((curr) => (curr === section ? null : section));
  };

  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }, []);

  const gameStateValue = setGameState ? (
    <select
      className="bg-slate-800 text-amber-400 border border-slate-700 rounded px-1 outline-none text-right cursor-pointer"
      value={gameState}
      onChange={(e) => setGameState(e.target.value as GameState)}
    >
      <option value="menu">menu</option>
      <option value="setup">setup</option>
      <option value="play">play</option>
      <option value="library">library</option>
      <option value="how-to-play">how-to-play</option>
      <option value="zen-garden">zen-garden</option>
    </select>
  ) : (
    <span
      className={`font-bold ${gameState === "setup" ? "text-emerald-400" : gameState === "play" ? "text-amber-400" : "text-slate-400"}`}
    >
      {gameState}
    </span>
  );

  const modeValue = setMode ? (
    <select
      className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-1 outline-none text-right cursor-pointer"
      value={mode}
      onChange={(e) => setMode(e.target.value as GameMode)}
    >
      <option value="2p-ns">2p-ns</option>
      <option value="2p-ew">2p-ew</option>
      <option value="4p">4p</option>
    </select>
  ) : (
    mode
  );

  const turnValue = setTurn ? (
    <select
      className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-1 outline-none text-right max-w-[120px] cursor-pointer"
      value={turn}
      onChange={(e) => setTurn(e.target.value)}
    >
      {activePlayers.map((p) => (
        <option key={p} value={p}>
          {getPlayerDisplayName(p)} ({p})
        </option>
      ))}
    </select>
  ) : (
    `${getPlayerDisplayName(turn)} (${turn})`
  );

  const setupModeValue = setSetupMode ? (
    <select
      className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-1 outline-none text-right cursor-pointer"
      value={setupMode}
      onChange={(e) => setSetupMode(e.target.value as SetupMode)}
    >
      <option value="terrain">terrain</option>
      <option value="units">units</option>
    </select>
  ) : (
    setupMode
  );

  const bgDebugValue = setShowBgDebug ? (
    <button
      onClick={() => setShowBgDebug(!showBgDebug)}
      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
        showBgDebug
          ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
          : "bg-slate-800 text-slate-400 border border-slate-700"
      }`}
    >
      {showBgDebug ? "ON" : "OFF"}
    </button>
  ) : showBgDebug ? (
    "ON"
  ) : (
    "OFF"
  );

  const hasUnits = Object.keys(inventoryCounts).length > 0;
  const hasTerrain = Object.keys(terrainInventoryCounts).length > 0;
  const isOnlineRoom = !!onlineInfo?.roomId;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 text-xs font-mono shadow-xl max-h-[90vh] flex flex-col transition-all duration-300">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 shrink-0">
        Debug
      </h3>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
        {isOnlineRoom && onlineInfo && (
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
                  if (onlineInfo.playerIndex === null) return "—";
                  const mappedId =
                    bgioState?.G?.playerMap?.[
                      onlineInfo.playerIndex.toString()
                    ];
                  const dName = mappedId ? getPlayerDisplayName(mappedId) : "";
                  return dName
                    ? `Slot ${onlineInfo.playerIndex} (${dName})`
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
          title="Game State"
          isOpen={activeSection === "game"}
          onToggle={() => toggleSection("game")}
        >
          <div className="space-y-1.5">
            <DebugRow label="State">{gameStateValue}</DebugRow>
            <DebugRow label="Mode">{modeValue}</DebugRow>
            <DebugRow label="Turn">{turnValue}</DebugRow>
            <DebugRow label="Setup Mode">{setupModeValue}</DebugRow>
            <DebugRow label="Players">
              {activePlayers
                .map((p) => `${getPlayerDisplayName(p)} (${p})`)
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
            <DebugRow label="BG.IO Debug">{bgDebugValue}</DebugRow>
          </div>
        </AccordionSection>

        {hasUnits && (
          <AccordionSection
            title="Unit Inventory"
            isOpen={activeSection === "units"}
            onToggle={() => toggleSection("units")}
          >
            <div className="space-y-1">
              {Object.entries(inventoryCounts).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-slate-500">{type}</span>
                  <span
                    className={
                      count > 0 ? "text-emerald-400" : "text-slate-600"
                    }
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        {hasTerrain && (
          <AccordionSection
            title="Terrain Inventory"
            isOpen={activeSection === "terrain"}
            onToggle={() => toggleSection("terrain")}
          >
            <div className="space-y-1">
              {Object.entries(terrainInventoryCounts).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-slate-500">{type}</span>
                  <span
                    className={count > 0 ? "text-blue-400" : "text-slate-600"}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </AccordionSection>
        )}

        <AccordionSection
          title="BG.IO — G Object"
          isOpen={activeSection === "bgio-g"}
          onToggle={() => toggleSection("bgio-g")}
        >
          <div className="py-1">
            <JsonTreeViewer data={bgioState?.G ?? null} />
          </div>
        </AccordionSection>

        <AccordionSection
          title="BG.IO — Ctx"
          isOpen={activeSection === "bgio-ctx"}
          onToggle={() => toggleSection("bgio-ctx")}
        >
          <div className="py-1">
            <JsonTreeViewer data={bgioState?.ctx ?? null} />
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};

export default GameStateDebug;
