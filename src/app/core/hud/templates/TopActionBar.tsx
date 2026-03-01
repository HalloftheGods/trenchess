import React from "react";
import { useRouteContext } from "@context";
import { useActionBar } from "@/shared/hooks/interface/useActionBar";
import { PHASES } from "@constants/game";
import { PLAYER_CONFIGS, INITIAL_ARMY, PIECES } from "@constants";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import { TCDivider } from "@/shared/components/atoms/ui/TCDivider";
import { TCText } from "@/shared/components/atoms/ui/TCTypography";
import { ActionBarSlot } from "../atoms";
import { Check } from "lucide-react";

import { BoardSetup, TacticalSetup, ThemeSetup } from "../organisms";
import { TerrainSelection, UnitSelection, PlayTurn, Pov } from "../molecules";
import { useMatchState, useMatchHUD } from "@/shared/context";

export const TopActionBar: React.FC = () => {
  const ctx = useRouteContext();
  const game = useMatchState();
  const logic = useMatchHUD();
  const { darkMode, pieceStyle, toggleTheme, togglePieceStyle } = ctx;

  const actionBarLogic = useActionBar({ game, logic });
  const {
    trenchLocked,
    setTrenchLocked,
    chessLocked,
    setChessLocked,
    bothLocked,
    wizard,
    totalUnitCount,
    terrainItems,
    chessItems,
    handleStyleSelect,
    handleModeSelect,
    styleChoice,
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
  const showPov = typeof setIsFlipped === "function";

  const renderArchitectContents = () => {
    if (wizard.isWizardActive) {
      return (
        <TCFlex align="center" gap={4}>
          <BoardSetup
            mode={mode}
            setMode={handleModeSelect}
            activeStyle={styleChoice || "omega"}
            chessLocked={chessLocked}
            trenchLocked={trenchLocked}
            bothLocked={bothLocked}
            handleOmega={() => handleStyleSelect("omega")}
            handleClassic={() => handleStyleSelect("pi")}
            handleAlpha={() => handleStyleSelect("alpha")}
            handleChi={() => handleStyleSelect("chi")}
            handleRandomize={() => handleStyleSelect("random")}
            hidePreconfigs={gameState === PHASES.GENESIS}
          />

          {wizard.currentStep === "terrain" && (
            <>
              <TCDivider className="h-10 opacity-10" />
              <TerrainSelection
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
            !["terrain", "board-type", "style"].includes(
              wizard.currentStep,
            ) && (
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
              <UnitSelection
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

    return (
      <BoardSetup
        mode={mode}
        setMode={handleModeSelect}
        activeStyle={styleChoice || "omega"}
        chessLocked={chessLocked}
        trenchLocked={trenchLocked}
        bothLocked={bothLocked}
        handleOmega={() => handleStyleSelect("omega")}
        handleClassic={() => handleStyleSelect("pi")}
        handleAlpha={() => handleStyleSelect("alpha")}
        handleChi={() => handleStyleSelect("chi")}
        handleRandomize={() => handleStyleSelect("random")}
        showMirror={gameState === PHASES.GAMEMASTER}
        mirrorBoard={() => dispatch("board mirror")}
        hidePreconfigs={gameState === PHASES.GENESIS}
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
        justify="around"
        gap={8}
        className="w-full max-w-[1800px] mx-auto px-10 relative z-10"
      >
        {(showSetup || wizard.isWizardActive) && renderArchitectContents()}

        {!wizard.isWizardActive && showSetup && (
          <>
            <TCDivider className="h-10 mx-2 opacity-10" />
            <TacticalSetup
              trenchLocked={trenchLocked}
              setTrenchLocked={setTrenchLocked}
              placedCount={placedCount}
              maxPlacement={maxPlacement}
              terrainItems={terrainItems}
              chessLocked={chessLocked}
              setChessLocked={setChessLocked}
              unitsPlaced={totalUnitCount - (game.inventory[turn] || []).length}
              totalUnits={totalUnitCount}
              chessItems={chessItems}
            />
          </>
        )}

        {showPlay && !wizard.isWizardActive && (
          <TCFlex direction="col" align="center" gap={1}>
            <PlayTurn
              activePlayers={activePlayers}
              turn={turn}
              getIcon={(pid) => {
                const kingUnit = INITIAL_ARMY.find(
                  (u) => u.type === PIECES.KING,
                );
                return kingUnit
                  ? getIcon?.(
                      kingUnit,
                      `${PLAYER_CONFIGS[pid]?.text || ""} drop-shadow-md`,
                      24,
                    )
                  : null;
              }}
            />
            <TCText
              variant="muted"
              className="text-[9px] font-black uppercase tracking-[0.25em] opacity-40 mt-1"
            >
              Turn
            </TCText>
          </TCFlex>
        )}

        <TCDivider className="h-10 mx-2 opacity-10" />

        <ThemeSetup
          darkMode={darkMode}
          pieceStyle={pieceStyle}
          toggleTheme={toggleTheme ?? (() => {})}
          togglePieceStyle={togglePieceStyle ?? (() => {})}
        />

        {showPov && (
          <>
            <TCDivider className="h-10 mx-2 opacity-10" />
            <Pov
              perspective={isFlipped ? "south" : "north"}
              onPerspectiveChange={(p) => setIsFlipped?.(p === "south")}
              activePlayers={activePlayers}
              side={turn}
              onSideChange={(s: string) => dispatch(`setTurn ${s}`)}
            />
          </>
        )}
      </TCFlex>
    </TCFlex>
  );
};
