import React from "react";
import {
  TCCard,
  TCFlex,
  TCHeading,
  TCStack,
  TCText,
  TCButton,
  TCToggle,
  TCBadge,
} from "@/shared/components/atoms/ui";
import {
  Shield,
  Users,
  Swords,
  Activity,
  Cpu,
  RotateCcw,
  Copy,
  X,
  Zap,
  Unlock,
  Layers,
  Lock,
} from "lucide-react";
import { PHASES } from "@constants/game";
import type { GameStateHook, GameMode, TrenchessState } from "@tc.types";

interface ProtocolEditorProps {
  game: GameStateHook;
  onClose?: () => void;
}

/**
 * RuleCard — Re-imagined for cinematic wide-screen layout.
 */
const RuleCard: React.FC<{
  icon: React.ReactElement;
  title: string;
  description: string;
  children: React.ReactNode;
  isActive?: boolean;
  isLocked?: boolean;
}> = ({
  icon,
  title,
  description,
  children,
  isActive = false,
  isLocked = false,
}) => (
  <TCCard
    variant="glass"
    className={`p-6 border-white/5 transition-all duration-500 relative overflow-hidden group h-full ${
      isActive ? "bg-brand-blue/5 border-brand-blue/20" : "bg-slate-900/30"
    }`}
  >
    <TCFlex align="center" justify="between" gap={6} className="h-full">
      <TCFlex align="center" gap={4} className="flex-1 min-w-0">
        <div
          className={`p-3 rounded-2xl transition-all duration-500 shrink-0 ${
            isActive
              ? "bg-brand-blue text-white shadow-[0_0_20px_rgba(0,180,255,0.3)]"
              : "bg-slate-800/50 text-slate-500"
          }`}
        >
          {React.cloneElement(icon as React.ReactElement<{ size?: number }>, {
            size: 24,
          })}
        </div>
        <TCStack gap={1} className="min-w-0">
          <TCFlex align="center" gap={3}>
            <TCText
              className={`font-black uppercase tracking-[0.2em] text-[12px] whitespace-nowrap ${isActive ? "text-white" : "text-slate-300"}`}
            >
              {title}
            </TCText>
            {isLocked && <Lock size={12} className="text-slate-700" />}
          </TCFlex>
          <TCText
            variant="muted"
            className="text-[10px] opacity-30 leading-relaxed font-medium"
          >
            {description}
          </TCText>
        </TCStack>
      </TCFlex>
      <div className="shrink-0 flex items-center">{children}</div>
    </TCFlex>
  </TCCard>
);

/**
 * SegmentedPicker — Fluid wide-screen version.
 */
const SegmentedPicker: React.FC<{
  options: { id: string; label: string; icon?: React.ReactNode }[];
  activeId: string;
  onChange: (id: string) => void;
  color?: string;
  isLocked?: boolean;
}> = ({ options, activeId, onChange, color = "brand-blue", isLocked }) => (
  <div
    className={`flex p-1 bg-black/40 rounded-xl border border-white/5 gap-1 ${isLocked ? "opacity-30 pointer-events-none" : ""}`}
  >
    {options.map((opt) => {
      const isActive = activeId === opt.id;
      return (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
            isActive
              ? `bg-${color} text-white shadow-lg`
              : "text-slate-600 hover:text-slate-300 hover:bg-white/5"
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export const ProtocolEditor: React.FC<ProtocolEditorProps> = ({
  game,
  onClose,
}) => {
  if (!game) return null;

  const { gameState, mode, turn, activePlayers, bgioState, dispatch, patchG } =
    game;

  const G = bgioState?.G as TrenchessState;
  const isGM = G?.isGamemaster ?? false;
  const isMercenary = G?.isMercenary ?? false;

  const toggleMercenary = () => {
    patchG({ isMercenary: !isMercenary });
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

    if (newActive.length === 0 && gameState === PHASES.COMBAT) {
      dispatch("phase gamemaster");
    }

    patchG({ activePlayers: newActive });
    dispatch(
      `info FLEET_UPDATE: ${pid.toUpperCase()} ${isCurrentlyActive ? "DEACTIVATED" : "ACTIVATED"}`,
    );

    if (newActive.length === 0) {
      dispatch("info ENGINE_MODE: OMNIPOTENT_ARCHITECT (0 PARTICIPANTS)");
    }
  };

  const phases = [
    { id: PHASES.GENESIS, label: "GENESIS" },
    { id: PHASES.MAIN, label: "MAIN" },
    { id: PHASES.COMBAT, label: "COMBAT" },
    { id: PHASES.GAMEMASTER, label: "MASTER" },
  ];

  const modes = [
    { id: "2p-ns", label: "2P NORTH/SOUTH" },
    { id: "2p-ew", label: "2P EAST/WEST" },
    { id: "4p", label: "4P QUAD" },
    { id: "2v2", label: "ALLIANCE" },
  ];

  const playerOptions = activePlayers.map((pid) => ({
    id: pid,
    label: pid.toUpperCase(),
  }));

  const allPlayerIds = ["red", "yellow", "green", "blue"];

  return (
    <div className="w-full h-full flex flex-col p-12 font-sans selection:bg-brand-blue/30 selection:text-white overflow-hidden">
      {/* 1. Brand Header — Cinematic Wide-Screen Alignment */}
      <TCFlex justify="between" align="center" className="shrink-0 mb-16">
        <TCFlex align="center" gap={10} className="flex-1">
          <div className="p-4 bg-brand-blue/10 rounded-3xl border border-brand-blue/20 shadow-[0_0_30px_rgba(0,180,255,0.1)]">
            <Shield
              className="text-brand-blue drop-shadow-[0_0_15px_rgba(0,180,255,0.4)]"
              size={56}
              strokeWidth={1.5}
            />
          </div>
          <TCStack gap={0} className="whitespace-nowrap">
            <TCHeading
              level={1}
              variant="plain"
              className="text-7xl font-black text-white tracking-tighter leading-[0.8] flex gap-6 uppercase opacity-90"
            >
              <span>Rules</span>
              <span className="text-slate-400 font-light italic">Protocol</span>
            </TCHeading>
            <TCText
              variant="muted"
              className="text-[11px] font-black uppercase tracking-[1em] text-slate-600 mt-4 ml-2"
            >
              Configuration Interface
            </TCText>
          </TCStack>
        </TCFlex>

        <TCFlex align="center" gap={12}>
          <TCHeading
            level={1}
            variant="plain"
            className="text-9xl font-black text-white/[0.03] tracking-tighter italic leading-none select-none -mb-4 mr-4"
          >
            V2.0
          </TCHeading>

          <TCStack gap={1} className="text-right whitespace-nowrap opacity-40">
            <TCText
              variant="muted"
              className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 leading-none"
            >
              {isGM ? "Master Protocol" : "Standby Mode //"}
            </TCText>
            <TCText
              variant="muted"
              className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 leading-none"
            >
              {isGM ? "Authorized" : "Read-Only"}
            </TCText>
          </TCStack>

          {onClose && (
            <button
              onClick={onClose}
              className="group flex flex-col items-center gap-2 border border-white/5 px-6 py-4 rounded-3xl bg-white/[0.03] hover:bg-white/[0.08] transition-all active:scale-95"
            >
              <X
                size={20}
                className="text-white group-hover:rotate-90 transition-transform duration-500"
              />
              <TCText className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">
                Close Console
              </TCText>
            </button>
          )}
        </TCFlex>
      </TCFlex>

      {/* 2. Main Content — Optimized Fluid Layout */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4">
        <TCStack gap={12} className="pb-24 max-w-[1600px] mx-auto">
          {/* Security Alert — Panoramic Width */}
          {!isGM && (
            <TCCard
              variant="glass"
              className="p-10 border-brand-blue/30 bg-brand-blue/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                <Unlock size={200} />
              </div>
              <TCFlex
                align="center"
                justify="between"
                gap={12}
                className="relative z-10"
              >
                <TCStack gap={2}>
                  <TCText className="text-brand-blue font-black uppercase tracking-widest text-[11px]">
                    Security Alert
                  </TCText>
                  <TCHeading
                    level={2}
                    variant="plain"
                    className="text-white text-4xl font-black uppercase tracking-tight"
                  >
                    Engine Override Required
                  </TCHeading>
                  <TCText
                    variant="muted"
                    className="text-sm font-medium opacity-40 max-w-3xl leading-relaxed"
                  >
                    You must authorize the Master Protocol to perform
                    engine-level overrides and rule modifications.
                  </TCText>
                </TCStack>
                <TCButton
                  variant="brand"
                  size="xl"
                  className="px-14 py-7 text-xs shadow-[0_0_40px_rgba(0,180,255,0.3)] hover:scale-105"
                  onClick={activateGM}
                >
                  Authorize Protocol
                </TCButton>
              </TCFlex>
            </TCCard>
          )}

          {/* Section: Gameplay — Wide 3-Column */}
          <TCStack gap={6}>
            <TCFlex
              align="center"
              gap={4}
              className="px-1 border-l-4 border-brand-blue pl-6 py-1"
            >
              <Zap size={18} className="text-brand-blue" />
              <TCText className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-300">
                Gameplay Modifiers
              </TCText>
            </TCFlex>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RuleCard
                isLocked={!isGM}
                isActive={isMercenary}
                icon={<Swords />}
                title="Mercenary Mode"
                description="Enable point-based draft system."
              >
                <TCToggle
                  checked={isMercenary}
                  onChange={toggleMercenary}
                  disabled={!isGM}
                  size="sm"
                />
              </RuleCard>

              <RuleCard
                isLocked={!isGM}
                isActive={true}
                icon={<Users />}
                title="Fleet Manifest"
                description="Toggle participation for active player IDs."
              >
                <div className="flex bg-black/40 p-1 rounded-lg gap-1">
                  {allPlayerIds.map((pid) => (
                    <button
                      key={pid}
                      disabled={!isGM}
                      onClick={() => togglePlayerActive(pid)}
                      className={`w-8 h-8 rounded-md transition-all flex items-center justify-center ${activePlayers.includes(pid) ? `bg-${pid}-500 shadow-lg` : "bg-white/5 opacity-20"}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </button>
                  ))}
                </div>
              </RuleCard>

              <RuleCard
                isLocked={!isGM}
                isActive={true}
                icon={<RotateCcw />}
                title="Engine Reset"
                description="Reinitialize engine to Omega baseline."
              >
                <TCButton
                  disabled={!isGM}
                  variant="outline"
                  size="sm"
                  className="h-9 border-white/10 hover:border-brand-blue/40 text-[9px] px-6 font-black uppercase tracking-widest disabled:opacity-20"
                  onClick={() => dispatch("reset")}
                >
                  Purge
                </TCButton>
              </RuleCard>
            </div>
          </TCStack>

          {/* Section: Engine — Panoramic 2-Column */}
          <TCStack gap={6}>
            <TCFlex
              align="center"
              gap={4}
              className="px-1 border-l-4 border-brand-blue pl-6 py-1"
            >
              <Cpu size={18} className="text-brand-blue" />
              <TCText className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-300">
                Engine Controls
              </TCText>
            </TCFlex>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RuleCard
                isLocked={!isGM}
                isActive={true}
                icon={<Activity />}
                title="Active Phase"
                description="Forced transition between engine cycle phases."
              >
                <SegmentedPicker
                  options={phases}
                  activeId={gameState}
                  onChange={(id) => dispatch(`phase ${id}`)}
                  color="indigo-500"
                  isLocked={!isGM}
                />
              </RuleCard>

              <RuleCard
                isLocked={!isGM}
                isActive={true}
                icon={<Layers />}
                title="Board Topology"
                description="Shift coordinate matrices and player zones."
              >
                <SegmentedPicker
                  options={modes}
                  activeId={mode || "4p"}
                  onChange={(id) => game.setMode(id as GameMode)}
                  isLocked={!isGM}
                />
              </RuleCard>

              <RuleCard
                isLocked={!isGM}
                isActive={true}
                icon={<Zap />}
                title="Turn priority"
                description="Direct authority allocation to a specific player."
              >
                {activePlayers.length > 0 ? (
                  <SegmentedPicker
                    options={playerOptions}
                    activeId={turn}
                    onChange={(id) => dispatch(`turn ${id}`)}
                    color="amber-500"
                    isLocked={!isGM}
                  />
                ) : (
                  <TCBadge
                    variant="blue"
                    label="OVERRIDE ACTIVE"
                    className="text-[8px] opacity-40"
                  />
                )}
              </RuleCard>

              <RuleCard
                isLocked={!isGM}
                isActive={true}
                icon={<Copy />}
                title="Sync Utilities"
                description="Batch mirror and distribution operations."
              >
                <TCFlex gap={2}>
                  <TCButton
                    disabled={!isGM}
                    variant="outline"
                    size="sm"
                    className="h-9 border-white/10 hover:border-emerald-500/40 text-[9px] px-5 font-black uppercase tracking-widest"
                    onClick={() => dispatch("random")}
                  >
                    Random
                  </TCButton>
                  <TCButton
                    disabled={!isGM}
                    variant="outline"
                    size="sm"
                    className="h-9 border-white/10 hover:border-pink-500/40 text-[9px] px-5 font-black uppercase tracking-widest"
                    onClick={() => dispatch("mirror")}
                  >
                    Mirror
                  </TCButton>
                </TCFlex>
              </RuleCard>
            </div>
          </TCStack>
        </TCStack>
      </div>

      {/* 3. Footer — Panoramic Branding */}
      <TCFlex
        justify="between"
        align="center"
        className="shrink-0 mt-8 opacity-10 pt-8 border-t border-white/5"
      >
        <TCText className="text-[10px] font-black uppercase tracking-[1em] text-white">
          Trenchess // Rule Protocol
        </TCText>
        <TCText className="text-[10px] font-black uppercase tracking-[1em] text-white">
          System Status // Nominal
        </TCText>
      </TCFlex>
    </div>
  );
};
