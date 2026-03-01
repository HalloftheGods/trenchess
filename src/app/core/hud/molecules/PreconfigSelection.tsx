import React from "react";
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
  LayoutGrid,
} from "lucide-react";
import { ActionBarSlot } from "../atoms";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";

interface StyleSelectionProps {
  activeStyle?: string;
  chessLocked: boolean;
  trenchLocked: boolean;
  bothLocked: boolean;
  handleOmega: () => void;
  handleClassic: () => void;
  handleAlpha: () => void;
  handleChi: () => void;
  handleRandomize: () => void;
  mirrorBoard?: () => void;
  showMirror?: boolean;
}

export const PreconfigSelection: React.FC<StyleSelectionProps> = ({
  activeStyle,
  chessLocked,
  trenchLocked,
  bothLocked,
  handleOmega,
  handleClassic,
  handleAlpha,
  handleChi,
  handleRandomize,
  mirrorBoard,
  showMirror,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(activeStyle !== "omega");

  const toggleExpand = (fn: () => void) => {
    fn();
    setIsExpanded(!isExpanded);
  };

  const isOmega = activeStyle === "omega";
  const isAlpha = activeStyle === "alpha";
  const isPi = activeStyle === "pi";
  const isChi = activeStyle === "chi";
  const isRandom = activeStyle === "random";

  return (
    <TCFlex align="center" gap={2} className="transition-all duration-500">
      <ActionBarSlot
        label="Omega Mode"
        active={isOmega}
        hoverIcon={<Omega size={20} className="text-red-400" />}
        onClick={() => {
          handleOmega();
          setIsExpanded(!isExpanded);
        }}
      >
        <Eye
          size={20}
          className={isOmega ? "text-red-400" : "text-slate-500"}
        />
      </ActionBarSlot>

      {isExpanded && (
        <>
          <ActionBarSlot
            label="Alpha Mode"
            active={isAlpha}
            hoverIcon={<LayoutGrid size={20} className="text-slate-300" />}
            onClick={() => toggleExpand(handleAlpha)}
          >
            <LayoutGrid
              size={20}
              className={isAlpha ? "text-slate-200" : "text-slate-500"}
            />
          </ActionBarSlot>
          <ActionBarSlot
            label="Pi Mode"
            active={isPi}
            disabled={chessLocked}
            hoverIcon={<Pi size={20} className="text-orange-400" />}
            onClick={() => toggleExpand(handleClassic)}
          >
            <Pizza
              size={20}
              className={
                chessLocked
                  ? "text-slate-600"
                  : isPi
                    ? "text-orange-400"
                    : "text-amber-400"
              }
            />
          </ActionBarSlot>
          <ActionBarSlot
            label="Chi Mode"
            active={isChi}
            disabled={chessLocked && trenchLocked}
            hoverIcon={<LandPlot size={20} className="text-teal-400" />}
            onClick={() => toggleExpand(handleChi)}
          >
            <Shell
              size={20}
              className={
                chessLocked && trenchLocked
                  ? "text-slate-600"
                  : isChi
                    ? "text-teal-400"
                    : "text-emerald-400"
              }
            />
          </ActionBarSlot>
          <ActionBarSlot
            label="Randomize"
            active={isRandom}
            disabled={bothLocked}
            hoverIcon={<ShieldQuestion size={20} className="text-blue-400" />}
            onClick={() => toggleExpand(handleRandomize)}
          >
            <Dices
              size={20}
              className={
                bothLocked
                  ? "text-slate-600"
                  : isRandom
                    ? "text-blue-400"
                    : "text-sky-400"
              }
            />
          </ActionBarSlot>
        </>
      )}

      {showMirror && mirrorBoard && (
        <ActionBarSlot
          label="Mirror Field"
          hoverIcon={<Copy size={20} className="text-pink-400" />}
          onClick={mirrorBoard}
        >
          <Copy size={20} className="text-slate-500" />
        </ActionBarSlot>
      )}
    </TCFlex>
  );
};
