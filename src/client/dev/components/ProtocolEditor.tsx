import React from "react";
import { useNavigate } from "react-router-dom";
import { TCFlex, TCStack, TCText } from "@/shared/components/atoms/ui";
import {
  X,
  Eye,
  Swords,
  RotateCcw,
  Copy,
  Zap,
  ShieldAlert,
  Unlock,
  Lock,
  Activity,
  Layers,
  Users,
} from "lucide-react";
import type { GameStateHook, TrenchessState } from "@/shared/types";

interface ProtocolEditorProps {
  game: GameStateHook;
  onClose?: () => void;
}

// ==========================================
// Nintendo-Style Big Components
// ==========================================

const BigSegmentedControl: React.FC<{
  label: string;
  icon: React.ReactNode;
  options: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}> = ({ label, icon, options, activeId, onChange, disabled }) => (
  <div
    className={`flex flex-col gap-3 p-4 bg-white/5 rounded-[2rem] border border-white/5 ${disabled ? "opacity-40 pointer-events-none" : ""}`}
  >
    <TCFlex align="center" gap={3} className="px-2">
      <div className="text-white/40">
        {React.cloneElement(
          icon as React.ReactElement<{
            size?: number | string;
            strokeWidth?: number | string;
            className?: string;
          }>,
          { size: 20 },
        )}
      </div>
      <TCText className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
        {label}
      </TCText>
    </TCFlex>
    <div className="flex bg-black/40 p-2 rounded-2xl gap-2 h-16">
      {options.map((opt) => {
        const isActive = activeId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex-1 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 active:scale-95 ${
              isActive
                ? "bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-100"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

const BigToggle: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ icon, label, active, onClick, disabled }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-300 border-2 active:scale-95 h-full ${
      active
        ? "border-brand-blue bg-brand-blue/10 text-brand-blue shadow-[0_0_30px_rgba(0,180,255,0.15)]"
        : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
    } ${disabled ? "opacity-40 pointer-events-none" : ""}`}
  >
    <div
      className={`mb-4 p-4 rounded-full transition-colors ${active ? "bg-brand-blue/20" : "bg-black/20"}`}
    >
      {React.cloneElement(
        icon as React.ReactElement<{
          size?: number | string;
          strokeWidth?: number | string;
          className?: string;
        }>,
        {
          size: 32,
          strokeWidth: active ? 2.5 : 1.5,
        },
      )}
    </div>
    <span
      className={`font-black tracking-[0.15em] uppercase text-[10px] text-center max-w-[120px] ${active ? "text-white" : ""}`}
    >
      {label}
    </span>
    <div
      className={`absolute top-5 right-5 w-3 h-3 rounded-full transition-colors ${active ? "bg-brand-blue shadow-[0_0_10px_#00b4ff]" : "bg-black/40"}`}
    />
  </button>
);

const BigIconButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "outline" | "danger" | "brand";
}> = ({ icon, label, onClick, disabled, variant = "outline" }) => {
  let baseClasses =
    "border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white";
  if (variant === "danger")
    baseClasses =
      "border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20";
  if (variant === "brand")
    baseClasses =
      "border-brand-blue/20 bg-brand-blue text-white shadow-[0_0_20px_rgba(0,180,255,0.3)] hover:scale-105";

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-3 h-full p-4 rounded-[1.5rem] font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 ${baseClasses} ${
        disabled ? "opacity-30 pointer-events-none grayscale" : ""
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

// ==========================================
// Protocol Editor View
// ==========================================

export const ProtocolEditor: React.FC<ProtocolEditorProps> = ({
  game,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!game) return null;

  const { gameState, mode, turn, activePlayers, bgioState, dispatch, patchG } =
    game;

  const fogOfWar =
    (bgioState?.G as TrenchessState | undefined)?.fogOfWar ?? true;
  const isGM =
    (bgioState?.G as TrenchessState | undefined)?.isGamemaster ?? false;
  const isMercenary =
    (bgioState?.G as TrenchessState | undefined)?.isMercenary ?? false;

  const toggleFog = () => {
    patchG({ fogOfWar: !fogOfWar } as Partial<TrenchessState>);
    dispatch(`info FOG_OF_WAR: ${!fogOfWar ? "ENABLED" : "DISABLED"}`);
  };

  const toggleMercenary = () => {
    patchG({ isMercenary: !isMercenary } as Partial<TrenchessState>);
    dispatch(`info MERCENARY_MODE: ${!isMercenary ? "ENABLED" : "DISABLED"}`);
  };

  const activateGM = () => {
    game.authorizeMasterProtocol();
    dispatch("info GAMEMASTER_PROTOCOL_ACTIVATED");
  };

  const togglePlayerActive = (pid: string) => {
    const isCurrentlyActive = activePlayers.includes(pid);
    const newActive = isCurrentlyActive
      ? activePlayers.filter((p) => p !== pid)
      : [...activePlayers, pid];

    if (newActive.length === 0 && gameState === "play") {
      dispatch("phase gamemaster");
    }

    patchG({ activePlayers: newActive } as Partial<TrenchessState>);
    dispatch(
      `info FLEET_UPDATE: ${pid.toUpperCase()} ${isCurrentlyActive ? "DEACTIVATED" : "ACTIVATED"}`,
    );

    if (newActive.length === 0) {
      dispatch("info ENGINE_MODE: OMNIPOTENT_ARCHITECT (0 PARTICIPANTS)");
    }
  };

  const phases = [
    { id: "setup", label: "Setup" },
    { id: "play", label: "Play" },
    { id: "gamemaster", label: "Master" },
  ];

  const modes = [
    { id: "2p-ns", label: "2P N/S" },
    { id: "2p-ew", label: "2P E/W" },
    { id: "4p", label: "4P Quad" },
    { id: "2v2", label: "Alliance" },
  ];

  const allPlayerIds = ["red", "yellow", "green", "blue"];

  return (
    <div className="w-full h-full flex flex-col p-8 md:p-12 font-sans selection:bg-brand-blue/30 selection:text-white max-w-6xl mx-auto">
      {/* 1. Header Area */}
      <TCFlex justify="between" align="center" className="shrink-0 mb-8">
        <TCStack gap={1}>
          <TCFlex align="center" gap={4}>
            <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse shadow-[0_0_10px_#00b4ff]" />
            <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase m-0 leading-none">
              Game Protocol
            </h1>
          </TCFlex>
          <TCText className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-6">
            Global Engine Overrides
          </TCText>
        </TCStack>

        <TCFlex align="center" gap={4}>
          {!isGM && (
            <div className="mr-4 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-2">
              <ShieldAlert size={14} className="text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                Locked
              </span>
            </div>
          )}
          <button
            onClick={onClose || (() => navigate(-1))}
            className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all active:scale-90"
          >
            <X size={24} className="text-white" strokeWidth={2.5} />
          </button>
        </TCFlex>
      </TCFlex>

      {/* 2. Full-Screen Fit Layout */}
      <div className="flex-1 flex flex-col justify-end gap-6 text-white pb-4">
        {/* Row 1: Pickers (Phase & Topology) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BigSegmentedControl
            disabled={!isGM}
            label="System Phase"
            icon={<Activity />}
            options={phases}
            activeId={gameState}
            onChange={(id) => dispatch(`phase ${id}`)}
          />
          <BigSegmentedControl
            disabled={!isGM}
            label="Board Topology"
            icon={<Layers />}
            options={modes}
            activeId={mode || "4p"}
            onChange={(id) => dispatch(`play ${id}`)}
          />
        </div>

        {/* Row 2: Turn & Fleet Manifest (Combined Block) */}
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
          <TCStack gap={4} className="flex-1 w-full">
            <TCFlex align="center" gap={3}>
              <Users size={20} className="text-white/40" />
              <TCText className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
                Fleet Manifest
              </TCText>
            </TCFlex>
            <div className="flex bg-black/40 p-2 rounded-2xl gap-2 h-16 w-full">
              {allPlayerIds.map((pid) => {
                const isActive = activePlayers.includes(pid);
                return (
                  <button
                    key={pid}
                    disabled={!isGM}
                    onClick={() => togglePlayerActive(pid)}
                    className={`flex-1 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                      isActive
                        ? "bg-white/15 text-white ring-2 ring-white/20 scale-100"
                        : "text-white/30 hover:bg-white/5 hover:text-white/70"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${isActive ? `bg-${pid}-500 shadow-[0_0_10px_currentColor]` : "bg-white/20"}`}
                    />
                    <span className="hidden lg:inline">{pid}</span>
                  </button>
                );
              })}
            </div>
          </TCStack>

          <TCStack gap={4} className="flex-1 w-full relative">
            <TCFlex align="center" gap={3}>
              <Zap size={20} className="text-white/40" />
              <TCText className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
                Turn Authority
              </TCText>
            </TCFlex>
            {activePlayers.length > 0 ? (
              <div className="flex bg-black/40 p-2 rounded-2xl gap-2 h-16 w-full">
                {activePlayers.map((pid) => (
                  <button
                    key={`turn-${pid}`}
                    disabled={!isGM}
                    onClick={() => dispatch(`turn ${pid}`)}
                    className={`flex-1 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                      turn === pid
                        ? `bg-${pid}-500/20 text-${pid}-400 ring-2 ring-${pid}-500/50 scale-100`
                        : "text-white/40 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {pid}
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-16 rounded-2xl bg-black/40 flex items-center justify-center px-6 ring-1 ring-white/10 opacity-50">
                <span className="text-xs font-black uppercase tracking-widest text-white/60">
                  Omnipotent Architecture
                </span>
              </div>
            )}

            {/* If GM mode is off, put an unlock overlay over this whole row maybe? (Handled cleanly enough by buttons) */}
          </TCStack>
        </div>

        {/* Row 3: Big Toggles & Utilities */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 h-48">
          {/* Main Override Unlock */}
          <div className="col-span-2 lg:col-span-1 h-full">
            {!isGM ? (
              <BigIconButton
                icon={<Unlock size={32} strokeWidth={2} />}
                label="Unlock Config"
                variant="brand"
                onClick={activateGM}
              />
            ) : (
              <BigIconButton
                icon={
                  <Lock size={32} strokeWidth={2} className="text-brand-blue" />
                }
                label="Master Mode"
                variant="outline"
                disabled
                onClick={() => {}}
              />
            )}
          </div>

          <div className="h-full">
            <BigToggle
              disabled={!isGM}
              active={fogOfWar}
              onClick={toggleFog}
              icon={<Eye />}
              label="Fog of War"
            />
          </div>

          <div className="h-full">
            <BigToggle
              disabled={!isGM}
              active={isMercenary}
              onClick={toggleMercenary}
              icon={<Swords />}
              label="Mercenary"
            />
          </div>

          <div className="h-full flex flex-col gap-4">
            <BigIconButton
              disabled={!isGM}
              icon={<Zap size={20} />}
              label="Randomize"
              onClick={() => dispatch("random")}
            />
            <BigIconButton
              disabled={!isGM}
              icon={<Copy size={20} />}
              label="Mirror"
              onClick={() => dispatch("mirror")}
            />
          </div>

          <div className="col-span-2 lg:col-span-1 h-full">
            <BigIconButton
              disabled={!isGM}
              variant="danger"
              icon={<RotateCcw size={32} />}
              label="Engine Reset"
              onClick={() => dispatch("reset")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
