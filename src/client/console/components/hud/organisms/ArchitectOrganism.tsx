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
import type { GameMode, GameState } from "@/shared/types/game";

interface ArchitectOrganismProps {
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

export const ArchitectOrganism: React.FC<ArchitectOrganismProps> = ({
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
            {(gameState === "gamemaster" || handleRules) && <TCDivider className="h-6" />}
          </>
        )}

        {(gameState === "gamemaster" || (!setMode && gameState !== "play") || handleRules) && (
          <>
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
              label="Omega"
              hoverIcon={<Omega size={20} className="text-red-400" />}
              onClick={handleOmega}
            >
              <Eye size={20} className="text-slate-500" />
            </ActionBarSlot>
            <ActionBarSlot
              label="Pi"
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
              label="Chi"
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
              label="Random"
              disabled={bothLocked}
              hoverIcon={<ShieldQuestion size={20} className="text-blue-400" />}
              onClick={handleRandomize}
            >
              <Dices
                size={20}
                className={bothLocked ? "text-slate-600" : "text-sky-400"}
              />
            </ActionBarSlot>
            {gameState === "gamemaster" && mirrorBoard && (
              <ActionBarSlot
                label="Mirror"
                hoverIcon={<Copy size={20} className="text-pink-400" />}
                onClick={mirrorBoard}
              >
                <Copy size={20} className="text-slate-500" />
              </ActionBarSlot>
            )}
          </>
        )}
      </TCFlex>
      <TCText
        variant="muted"
        className="text-[10px] font-black uppercase tracking-[0.2em]"
      >
        {gameState === "gamemaster"
          ? "Architect Palette"
          : !!setMode
            ? "Active Board"
            : "Quick Game Modes"}
      </TCText>
    </TCFlex>
  );
};
