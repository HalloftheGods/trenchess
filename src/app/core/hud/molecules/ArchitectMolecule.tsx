import React from "react";
import {
  DualToneNS,
  DualToneEW,
  QuadTone,
  AllianceTone,
  DualToneSwords,
} from "@/shared/components/atoms/RouteIcons";
import {
  Dices,
  Pizza,
  Shell,
  Pi,
  LandPlot,
  ShieldQuestion,
  Omega,
  Eye,
  Copy,
  Settings2,
} from "lucide-react";
import { ActionBarSlot } from "../atoms";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import { TCText } from "@/shared/components/atoms/ui/TCTypography";
import { TCDivider } from "@/shared/components/atoms/ui/TCDivider";
import { PHASES } from "@constants/game";
import type { GameMode, GameState } from "@tc.types/game";

interface ArchitectMoleculeProps {
  gameState?: GameState;
  mode?: GameMode;
  setMode?: (mode: GameMode) => void;
  chessLocked: boolean;
  trenchLocked: boolean;
  bothLocked: boolean;
  handleOmega: () => void;
  handleClassic: () => void;
  handleChi: () => void;
  handleRandomize: () => void;
  handleRules?: () => void;
  mirrorBoard?: () => void;
}

export const ArchitectMolecule: React.FC<ArchitectMoleculeProps> = ({
  gameState,
  mode,
  setMode,
  chessLocked,
  trenchLocked,
  bothLocked,
  handleOmega,
  handleClassic,
  handleChi,
  handleRandomize,
  handleRules,
  mirrorBoard,
}) => {
  return (
    <TCFlex direction="col" align="center" gap={1}>
      <TCFlex align="center" gap={2}>
        {setMode && (
          <>
            <ActionBarSlot
              label="North/South"
              active={mode === "2p-ns"}
              onClick={() => setMode("2p-ns")}
            >
              <DualToneNS size={20} />
            </ActionBarSlot>
            <ActionBarSlot
              label="East/West"
              active={mode === "2p-ew"}
              onClick={() => setMode("2p-ew")}
            >
              <DualToneEW size={20} />
            </ActionBarSlot>
            <ActionBarSlot
              label="4-Player"
              active={mode === "4p"}
              onClick={() => setMode("4p")}
            >
              <QuadTone size={20} />
            </ActionBarSlot>
            <ActionBarSlot
              label="Alliance"
              active={mode === "2v2"}
              onClick={() => setMode("2v2")}
            >
              <AllianceTone size={20} />
            </ActionBarSlot>
            {(gameState === PHASES.GAMEMASTER || handleRules) && (
              <TCDivider className="h-10 mx-2 opacity-10" />
            )}
          </>
        )}

        {(gameState === PHASES.GAMEMASTER ||
          (!setMode && gameState !== PHASES.COMBAT) ||
          handleRules) && (
          <TCFlex align="center" gap={2}>
            {handleRules && (
              <ActionBarSlot
                label="Rules"
                hoverIcon={<Settings2 size={20} className="text-brand-blue" />}
                onClick={handleRules}
              >
                <DualToneSwords size={20} />
              </ActionBarSlot>
            )}
            <ActionBarSlot
              label="Omega Mode"
              hoverIcon={<Omega size={20} className="text-red-400" />}
              onClick={handleOmega}
            >
              <Eye size={20} className="text-slate-500" />
            </ActionBarSlot>
            <ActionBarSlot
              label="Pi Mode"
              disabled={chessLocked}
              hoverIcon={<Pi size={20} className="text-orange-400" />}
              onClick={handleClassic}
            >
              <Pizza
                size={20}
                className={chessLocked ? "text-slate-600" : "text-amber-400"}
              />
            </ActionBarSlot>
            <ActionBarSlot
              label="Chi Mode"
              disabled={chessLocked && trenchLocked}
              hoverIcon={<LandPlot size={20} className="text-teal-400" />}
              onClick={handleChi}
            >
              <Shell
                size={20}
                className={
                  chessLocked && trenchLocked
                    ? "text-slate-600"
                    : "text-emerald-400"
                }
              />
            </ActionBarSlot>
            <ActionBarSlot
              label="Randomize"
              disabled={bothLocked}
              hoverIcon={<ShieldQuestion size={20} className="text-blue-400" />}
              onClick={handleRandomize}
            >
              <Dices
                size={20}
                className={bothLocked ? "text-slate-600" : "text-sky-400"}
              />
            </ActionBarSlot>
            {gameState === PHASES.GAMEMASTER && mirrorBoard && (
              <ActionBarSlot
                label="Mirror Field"
                hoverIcon={<Copy size={20} className="text-pink-400" />}
                onClick={mirrorBoard}
              >
                <Copy size={20} className="text-slate-500" />
              </ActionBarSlot>
            )}
          </TCFlex>
        )}
      </TCFlex>
      <TCText
        variant="muted"
        className="hidden text-[9px] font-black uppercase tracking-[0.25em] opacity-40 mt-1"
      >
        {gameState === PHASES.GAMEMASTER
          ? "Architect Palette"
          : setMode
            ? "Active Board"
            : "Quick Game Modes"}
      </TCText>
    </TCFlex>
  );
};
