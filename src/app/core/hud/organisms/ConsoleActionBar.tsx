import React from "react";
import { useRouteContext } from "@context";
import { useConsoleLogic } from "@/shared/hooks/interface/useConsoleLogic";
import { useActionBar } from "@/shared/hooks/interface/useActionBar";
import { PHASES } from "@constants/game";
import type { GameStateHook } from "@tc.types";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import { TCDivider } from "@/shared/components/atoms/ui/TCDivider";
import { TCText } from "@/shared/components/atoms/ui/TCTypography";
import { ActionBarSlot } from "../atoms";
import {
  DualToneNS,
  DualToneEW,
  QuadTone,
  AllianceTone,
} from "@/shared/components/atoms/RouteIcons";
import {
  Eye,
  Pizza,
  Shell,
  Dices,
  Omega,
  Pi,
  LandPlot,
  ShieldQuestion,
  Check,
} from "lucide-react";

import {
  ArchitectMolecule,
  TrenchMolecule,
  ChessmanMolecule,
  PlayTurnMolecule,
  ConsoleThemeMolecule,
  PovMolecule,
} from "../molecules";

const MODE_ICONS: Record<string, React.ReactNode> = {
  "2p-ns": <DualToneNS size={20} />,
  "2p-ew": <DualToneEW size={20} />,
  "4p": <QuadTone size={20} />,
  "2v2": <AllianceTone size={20} />,
};

const STYLE_ICONS: Record<string, React.ReactNode> = {
  omega: <Omega size={20} className="text-red-400" />,
  pi: <Pi size={20} className="text-orange-400" />,
  chi: <LandPlot size={20} className="text-teal-400" />,
  random: <ShieldQuestion size={20} className="text-blue-400" />,
};

const STYLE_LABELS: Record<string, string> = {
  omega: "Omega",
  pi: "Pi",
  chi: "Chi",
  random: "Random",
};

interface ConsoleActionBarProps {
  game: GameStateHook;
  logic: ReturnType<typeof useConsoleLogic>;
}

export const ConsoleActionBar: React.FC<ConsoleActionBarProps> = ({
  game,
  logic,
}) => {
  const ctx = useRouteContext();
  const { darkMode, pieceStyle, toggleTheme, togglePieceStyle } = ctx;

  const actionBarLogic = useActionBar({ game, logic });
  const {
    trenchLocked,
    setTrenchLocked,
    chessLocked,
    setChessLocked,
    bothLocked,
    styleChoice,
    setStyleChoice,
    wizard,
    totalUnitCount,
    terrainItems,
    chessItems,
    handleStyleSelect,
    handleModeSelect,
  } = actionBarLogic;

  const {
    gameState,
    mode,
    activePlayers,
    isFlipped,
    setIsFlipped,
    turn,
    dispatch,
    getIcon,
  } = game;
  const { placedCount, maxPlacement } = logic;
  const showSetup = gameState !== PHASES.COMBAT;
  const showPlay = gameState === PHASES.COMBAT;
  const showPov = typeof game.setMode === "function";

  const renderArchitectContents = () => {
    if (wizard.isWizardActive) {
      return (
        <TCFlex align="center" gap={4}>
          <TCFlex align="center" gap={2}>
            {wizard.isModeSelected && wizard.currentStep !== "board-type" ? (
              <ActionBarSlot
                label={`Mode: ${mode?.toUpperCase()}`}
                active
                onClick={() => handleModeSelect(null)}
              >
                {MODE_ICONS[mode as string]}
              </ActionBarSlot>
            ) : (
              <>
                <ActionBarSlot
                  label="North/South"
                  active={mode === "2p-ns"}
                  onClick={() => handleModeSelect("2p-ns")}
                >
                  <DualToneNS size={20} />
                </ActionBarSlot>
                <ActionBarSlot
                  label="East/West"
                  active={mode === "2p-ew"}
                  onClick={() => handleModeSelect("2p-ew")}
                >
                  <DualToneEW size={20} />
                </ActionBarSlot>
                <ActionBarSlot
                  label="4-Player"
                  active={mode === "4p"}
                  onClick={() => handleModeSelect("4p")}
                >
                  <QuadTone size={20} />
                </ActionBarSlot>
                <ActionBarSlot
                  label="Alliance"
                  active={mode === "2v2"}
                  onClick={() => handleModeSelect("2v2")}
                >
                  <AllianceTone size={20} />
                </ActionBarSlot>
              </>
            )}
          </TCFlex>

          {wizard.currentStep === "style" && (
            <>
              <TCDivider className="h-10 opacity-10" />
              <TCFlex align="center" gap={2}>
                <ActionBarSlot
                  label="Omega"
                  hoverIcon={<Omega size={20} className="text-red-400" />}
                  onClick={() => handleStyleSelect("omega")}
                >
                  <Eye size={20} className="text-slate-500" />
                </ActionBarSlot>
                <ActionBarSlot
                  label="Pi"
                  hoverIcon={<Pi size={20} className="text-orange-400" />}
                  onClick={() => handleStyleSelect("pi")}
                >
                  <Pizza size={20} className="text-amber-400" />
                </ActionBarSlot>
                <ActionBarSlot
                  label="Chi"
                  hoverIcon={<LandPlot size={20} className="text-teal-400" />}
                  onClick={() => handleStyleSelect("chi")}
                >
                  <Shell size={20} className="text-emerald-400" />
                </ActionBarSlot>
                <ActionBarSlot
                  label="Random"
                  hoverIcon={<Dices size={20} className="text-sky-400" />}
                  onClick={() => handleStyleSelect("random")}
                >
                  <ShieldQuestion size={20} className="text-blue-400" />
                </ActionBarSlot>
              </TCFlex>
            </>
          )}

          {wizard.isStyleSelected && wizard.currentStep !== "style" && (
            <>
              <TCDivider className="h-10 opacity-10" />
              <ActionBarSlot
                label={`Style: ${STYLE_LABELS[styleChoice as string]}`}
                active
                onClick={() => setStyleChoice(null)}
              >
                {STYLE_ICONS[styleChoice as string]}
              </ActionBarSlot>
            </>
          )}

          {wizard.currentStep === "terrain" && (
            <>
              <TCDivider className="h-10 opacity-10" />
              <TrenchMolecule
                trenchLocked={trenchLocked}
                setTrenchLocked={setTrenchLocked}
                placedCount={placedCount}
                maxPlacement={maxPlacement}
                items={terrainItems}
                hideTitle
              />
            </>
          )}

          {wizard.isTerrainComplete &&
            wizard.currentStep !== "terrain" &&
            wizard.currentStep !== "board-type" &&
            wizard.currentStep !== "style" && (
              <>
                <TCDivider className="h-10 opacity-10" />
                <ActionBarSlot label="Terrain Complete" active>
                  <Check size={20} className="text-emerald-400" />
                </ActionBarSlot>
              </>
            )}

          {wizard.currentStep === "chessmen" && (
            <>
              <TCDivider className="h-10 opacity-10" />
              <ChessmanMolecule
                chessLocked={chessLocked}
                setChessLocked={setChessLocked}
                unitsPlaced={
                  totalUnitCount - (game.inventory[turn] || []).length
                }
                totalUnits={totalUnitCount}
                items={chessItems}
                hideTitle
              />
            </>
          )}

          {wizard.currentStep === "ready" && (
            <>
              <TCDivider className="h-10 opacity-10" />
              <button
                onClick={() => dispatch("finishGamemaster")}
                className="px-6 h-12 bg-emerald-500 hover:bg-emerald-400 text-white rounded-md font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-3"
              >
                <Check size={18} />
                Start Game
              </button>
            </>
          )}
        </TCFlex>
      );
    }

    // Default Architect Structure
    return (
      <ArchitectMolecule
        gameState={gameState}
        mode={mode}
        setMode={(m) => dispatch(`play ${m}`)}
        chessLocked={chessLocked}
        trenchLocked={trenchLocked}
        bothLocked={bothLocked}
        handleOmega={() => dispatch("board omega")}
        handleClassic={() => dispatch("board pi")}
        handleChi={() => dispatch("board chi")}
        handleRandomize={() => dispatch("board random")}
        handleRules={() => game.setShowRules(true)}
        mirrorBoard={() => dispatch("board mirror")}
      />
    );
  };

  return (
    <TCFlex
      align="center"
      className="fixed top-0 left-0 right-0 z-50 h-20 bg-gradient-to-b from-slate-900/90 to-slate-950/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-all duration-500"
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-50" />

      <TCFlex
        align="center"
        justify="between"
        gap={8}
        className="w-full max-w-[1800px] mx-auto px-10 relative z-10"
      >
        <TCFlex align="center" gap={2}>
          {(showSetup || wizard.isWizardActive) && (
            <>
              <TCFlex align="center" gap={1}>
                {renderArchitectContents()}
              </TCFlex>
              {!wizard.isWizardActive && (
                <>
                  <TCDivider className="h-10 opacity-15" />
                  <TCFlex align="center" gap={1}>
                    <TrenchMolecule
                      trenchLocked={trenchLocked}
                      setTrenchLocked={setTrenchLocked}
                      placedCount={placedCount}
                      maxPlacement={maxPlacement}
                      items={terrainItems}
                    />
                  </TCFlex>
                  <TCDivider className="h-10 opacity-15" />
                  <TCFlex align="center" gap={1}>
                    <ChessmanMolecule
                      chessLocked={chessLocked}
                      setChessLocked={setChessLocked}
                      unitsPlaced={
                        totalUnitCount - (game.inventory[turn] || []).length
                      }
                      totalUnits={totalUnitCount}
                      items={chessItems}
                    />
                  </TCFlex>
                  <TCDivider className="h-10 opacity-15" />
                </>
              )}
            </>
          )}

          {showPlay && !wizard.isWizardActive && (
            <>
              <TCFlex align="center" gap={1}>
                <TCFlex direction="col" align="center" gap={1}>
                  <PlayTurnMolecule
                    activePlayers={activePlayers}
                    turn={turn}
                    getIcon={getIcon}
                  />
                  <TCText
                    variant="muted"
                    className="text-[9px] font-black uppercase tracking-[0.25em] opacity-40 mt-1"
                  >
                    Turn
                  </TCText>
                </TCFlex>
              </TCFlex>
              <TCDivider className="h-10 opacity-15" />
            </>
          )}

          <TCFlex align="center" gap={1}>
            <ConsoleThemeMolecule
              darkMode={darkMode}
              pieceStyle={pieceStyle}
              toggleTheme={toggleTheme ?? (() => {})}
              togglePieceStyle={togglePieceStyle ?? (() => {})}
            />
          </TCFlex>
        </TCFlex>

        {showPov && (
          <TCFlex align="center" gap={8}>
            <TCDivider className="h-10 opacity-15" />
            <TCFlex align="center" gap={1}>
              <PovMolecule
                perspective={isFlipped ? "south" : "north"}
                onPerspectiveChange={(p) => setIsFlipped?.(p === "south")}
                activePlayers={activePlayers}
                side={turn}
                onSideChange={(s) => dispatch(`setTurn ${s}`)}
              />
            </TCFlex>
          </TCFlex>
        )}
      </TCFlex>
    </TCFlex>
  );
};
